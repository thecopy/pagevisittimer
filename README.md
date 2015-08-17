# README pagevisittimer

The package `pagevisisttimer` enables  use of websockets to measure the time a visitor stays on the pages of your site. 

## How it works

Client side script `pagevisisttimer.js` connects to the websocket, and will send repeated calls to the backend with a time-stamp. The interval between the calls will decrease with time.

# Prerequisites
* MongoDB and the npm package `mongodb` is required. Feel free to send a pull request if you have implemented another backing.
* npm package `websocket`
## Installation & Usage Example

1. `npm install pagevisittimer`
2. In your `app.js` or equivalent:
 
        var server = http.createServer(app)
        var pagevisittimer = require('pagevisittimer');
        pagevisittimer.start(server); // will start the websocket server
3. Copy client-side Javascript file to your public folder: `cp node_modules/pagevisittimer/pagevisittimer.js public/js/`
4. Add to you base layout view HTML: `<script type="text/javascript" src="/js/pagevisittimer.js"></script>`

## Example: To add a public route to summary of your visit data
    app.get('/getvisits/summary', function(req,res){
        pagevisittimer.getVisits(function(r){
            urls = []
            for(var i=0; i < r.length; i++){
                var curr = r[i];
                var found = 0;
                for(var j=0; j<urls.length; j++){
                    if(urls[j].url == curr._id.url){
                        urls[j].visits++;
                        urls[j].max = Math.max(urls[j].max, curr.value);
                        urls[j].total += curr.value;
                        found = 1;
                        break;
                    }
                }
                if(found == 0){
                    console.log(curr)
                    urls.push({url: curr._id.url, visits:1, max:curr.value, total: 0});
                }
            }console.log(urls)
            for(var j=0; j<urls.length; j++){
                var curr = urls[j];
                res.write(curr.url + ": " + curr.visits + " visits, in total " 
                                    + curr.total/1000+ " seconds, longest: " + curr.max/1000 + " seconds.");
                res.write('\n');
            }
            res.end();
        });
## Example: To add a public route to your visit data:

    app.get('/getvisits', function(req,res){
	      pagevisittimer.getVisits(function(r){res.send(JSON.stringify(r))});
    });


## Configuration
### Change MongoDB host
pagevisittimer will use the collection `pagevisists`. This cannot currently be changed, but the MongoDB host can be changed using one call:

    var pagevisittimer = require('pagevisittimer');
    pagevisittimer.set('mongodburl', 'mongodb://localhost:27017/pagevisists')
    
