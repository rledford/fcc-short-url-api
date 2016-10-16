var short = require('./short.server.controller');

module.exports = function(app){
   app.get("/short/*",
      short.validateUrl,
      short.shortUrlLookup,
      short.reportShortUrlResult);
};
