var uid = Math.round(Math.random() * 0xFFFFFFFFFFFFFFF);
var client = new WebSocket('ws://' + window.location.host);
var start = new Date().getTime(); 
var currentUrlIteration = 0;

client.onerror = function(e) {
    console.log("ERROR")
    console.error(e);
};

function sendNumber(my_iteration) {
    if(currentUrlIteration != my_iteration)
        return;

    if (client.readyState === client.OPEN) {
        var time = new Date().getTime() - start;
        client.send(JSON.stringify({
            type: 1,
            url: window.location.href ,
            timestamp: time,
            uid: uid
        }));
        setTimeout(function(){sendNumber(my_iteration);}, getDelay(time));
    }
}

client.onopen = function() {
    sendNumber(currentUrlIteration);
};

client.onclose = function() {

};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {

        //console.log("Received: '" + e.data + "'");
    }
};

function getDelay(totalTimeSpentOnThisPage){
    var t = totalTimeSpentOnThisPage;
    if(t < 5000)
        return 200;
    if(t < 10000)
        return 1000;
    if(t < 20000)
        return 2000;
    if(t < 300000)
        return 5000;
    return 10000;
}

function hashchange(){
    start = new Date().getTime(); 
    currentUrlIteration++;
    sendNumber(currentUrlIteration);
}
