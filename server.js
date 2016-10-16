var config = require('./config'),
   express = require('express'),
   app = express();

//apply routing middleware
require('./short.server.route')(app);
require('./goto.server.route')(app);

app.get('/', function (req, res) {
   //ugly... should have used html (at least)... sorry
   res.write("Welcome!\n\nIn order to generate a short URL please use the following format\n\n");
   res.write("https://short-url-rl.herokuapp.com/short/<your address goes here>");
   res.write("\n\nPlease make sure you include http:// or https:// in the address you provide");
   res.write("\n\nExample Input");
   res.write("\nhttps://short-url-rl.herokuapp.com/short/http://freecodecamp.com");
   res.write("\n\nReturns\nhttps://short-url-rl.herokuapp.com/goto/2");
   res.write("\n\nPaste the returned address into your browsers address bar");
   res.write("\nand you will be directed to http://freecodecamp.com");
   res.write("\n\nThanks for visiting,\n\nRyan");
   res.end();
});

console.log("listening on port: " + config.port);

app.listen(config.port);
