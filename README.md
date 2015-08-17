# README pagevisittimer

The package `pagevisisttimer` enables  use of websockets to measure the time a visitor stays on the pages of your site. 

# Prerequisites
* MongoDB is required. Feel free to send a pull request if you have implemented another backing.

## Installation & Usage Example

1. `npm install pagevisittimer`
2. In your `app.js` or equivalent:
 
        var server = http.createServer(app)
        var pagevisittimer = require('pagevisittimer');
        pagevisittimer.start(server); // will start the websocket server
3. Copy client-side Javascript file to your public folder: `cp node_modules/pagevisittimer/pagevisittimer.js public/js/`
4. Add to you base layout view HTML: `<script type="text/javascript" src="/js/pagevisittimer.js"></script>`

## Configuration
### Change MongoDB host
pagevisittimer will use the collection `pagevisists`. This cannot currently be changed, but the MongoDB host can be changed using one call:

    var pagevisittimer = require('pagevisittimer');
    pagevisittimer.set('mongodburl', 'mongodb://localhost:27017/pagevisists')
    
