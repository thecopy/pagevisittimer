var MongoClient = require('mongodb').MongoClient
var WebSocketServer = require('websocket').server;

module.app = {};
module.app.settings = 
  {
    mongodburl: 'mongodb://localhost:27017/timertest' 
  }

module.exports.set = function(key,val){
  module.app.settings[key] = val;
}

module.exports.start = function(server){
  createApplication(server);
  return module.app.wsServer;
}

function createApplication(server){
  // Create an object for the websocket
  module.app.wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  // Create a callback to handle each connection request
  module.app.wsServer.on('request', module.exports.onConnectionRequest);
}

module.exports.onConnectionRequest = function(req){
  var connection = req.accept();
  connection.on('message', function(message){onMessageRecieved(connection,message)});   

}

function onMessageRecieved(connection, message){
  if (message.type === 'utf8') 
  {
    if(!IsJsonString(message.utf8Data)){
      connection.close(); // Not JSON
    }
    
    var messageObj = JSON.parse(message.utf8Data);
    if(messageObj.type && messageObj.type == 1){
      module.exports.addPageVisit(messageObj, function(res)
      {
          connection.sendUTF(JSON.stringify({result:res}));
      });
    }
  }
}

module.exports.addPageVisit = function(messageObj, callback){
  withDb(function(err, db) {
    if(err)
      console.log("Error:" + err);

    var collection = db.collection('pagevisists');
    collection.insert(
      {
              url : messageObj.url, 
        timestamp : messageObj.timestamp, 
              uid : messageObj.uid  
      }, 
      function(err, result) {
        if(err){
          console.log(err)
          callback(-1);
          db.close();
          return;
        }
        callback(1);
      db.close();
    });
  });
}

module.exports.getVisits = function(callback){
  withDb(function(err, db) {
    if(err)
      console.log("Error:" + err);

    // Map function
    var map = function() { emit({url: this.url, uid: this.uid }, this.timestamp); };
    // Reduce function
    var reduce = function(k,vals) 
    {
      var max = -1;
      for(var i = 0; i<vals.length; i++){
        if(vals[i] > max){
          max = vals[i];
        }
      }
      return max;
    };

    var collection = db.collection('pagevisists');
    collection.mapReduce(map, reduce, {out: {replace : 'tempCollection', readPreference : 'secondary'}}, function(err,c){
      if(err){
        console.log(err)
        callback([]);
        return;
      }
      c.find().toArray(function(err, docs) {
        callback(docs);
      });
    });
  });
}

function withDb(f){
  MongoClient.connect(module.app.settings.mongodburl, f);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}