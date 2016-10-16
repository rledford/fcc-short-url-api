var config = require('./config'),
   express = require('express'),
   app = express();

//apply routing middleware
require('./short.server.route')(app);
require('./goto.server.route')(app);

app.get('/', function (req, res) {
   res.send("Welcome!");
});

console.log("listening on port: " + config.port);

app.listen(config.port);
