var goto = require('./goto.server.controller');

module.exports = function(app){
   app.get('/goto/:id', goto.shortIdLookup);
};
