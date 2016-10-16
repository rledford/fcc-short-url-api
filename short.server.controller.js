var config = require('./config'),
   mongodb = require('mongodb'),
   url = require('url'),
   http = require('http'),
   MongoClient = mongodb.MongoClient,
   shortUrlFound = false,
   shortUrlId = -1,
   dbConnection = null;

function resetLookup(){
   shortUrlFound = false;
   shortUrlId = -1;
}

function closeDbConnection(){
   console.log("closing database connection");
   if (dbConnection){
      dbConnection.close();
   }
}

function setShortUrlFound(val){
   console.log("setting short url found: "+val);
   shortUrlFound = val;
}

function getShortUrlFound(){
   return shortUrlFound;
}

function setShortUrlId(val){
   console.log("setting short url id: "+val);
   shortUrlId = val;
}

function getShortUrlId(){
   return shortUrlId;
}

exports.validateUrl = function(req, res, next){
   console.log("validating url");
   var options = {
      method: 'HEAD',
      host: url.parse(req.params[0]).host,
      port: 80,
      path: url.parse(req.params[0]).pathname
   };
   var r = http.request(options, function(response){
      if (response.statusCode != 404){
         console.log("url is valid");
         return next();
      }
      else{
         res.send("Error: "+responseCode);
      }
   });
   r.on('error', function (e) {
      console.log("unable to resolve: "+e);
      res.send("unable to resolve: "+req.params[0]);
   });
   r.end();
};

exports.shortUrlLookup = function(req, res, next){
   resetLookup();
   var urlCollection = null;
   var autoIncCollection = null;
   var targetUrl = req.params[0];
   MongoClient.connect(config.db, function(err, db){
      if(!err){
         dbConnection = db;
         console.log("connected to database");
         db.collection(config.urlCollection, function(err, collection){
            if(!err){
               urlCollection = collection;
               console.log("checking url collection");
               collection.findOne({'url': targetUrl}, function(err, doc){
                  if(!err){
                     if(doc){
                        console.log("found matching document with short id: "+doc.short);
                        setShortUrlFound(true);
                        setShortUrlId(doc.short);
                        return next();
                     } else {
                        console.log("no match found");
                     }
                     if (!getShortUrlFound()){
                        db.collection(config.autoIncCollection, function(err, collection){
                           if(!err){
                              autoIncCollection = collection;
                              console.log("getting new id");
                              collection.findOne({}, function(err, doc){
                                 if(!err){
                                    if(doc){
                                       setShortUrlId(doc.next+1);
                                       autoIncCollection.update({_id: doc._id},{next:getShortUrlId()}, function(err){
                                          console.log("updating id tracker");
                                          if(err){
                                             console.log("failed to update tracker");
                                             console.log(err);
                                             return next();
                                          }
                                          console.log("inserting new short_url document into collection");
                                          urlCollection.insert({'url':targetUrl, 'short':getShortUrlId()}, function(err, result){
                                             if(!err){
                                                console.log("successfully inserted new document");
                                                setShortUrlFound(true);
                                             } else {
                                                console.log(err);
                                             }
                                             return next();
                                          });
                                       });
                                    }

                                 } else {
                                    return next();
                                 }
                              });
                           }
                        });
                     } else {
                        return next();
                     }
                  }
               });
            }
         });
      }
   });
};

exports.reportShortUrlResult = function(req, res){
   closeDbConnection();
   console.log("reporting results");
   console.log(getShortUrlFound(), getShortUrlId());
   if(shortUrlFound && shortUrlId >= 0){
      res.write("Original URL\n");
      res.write("https://short-url-rl.herokuapp.com/short/"+req.params[0]);
      res.write("\n\nShort URL\n");
      res.write("https://short-url-rl.herokuapp.com/goto/"+shortUrlId);
      res.end();
   }
   else{
      res.send("unable to resolve: "+req.params[0]);
   }
};

