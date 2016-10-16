var config = require("./config"),
   MongoClient = require('mongodb').MongoClient;

exports.shortIdLookup = function(req, res, next){
   var shortId = parseInt(req.params.id) || -1;
   MongoClient.connect(config.db, function(err, db){
      if(!err){
         console.log("connected to database");
         db.collection(config.urlCollection, function(err, collection){
            if(!err){
               console.log("checking for document match");
               collection.findOne({'short':{$eq: shortId}}, function(err, doc){
                  if(!err){
                     if (doc){
                        console.log("found matching document");
                        console.log(doc.url);
                        res.writeHead(301,
                           {Location: doc.url});
                        res.end();
                        return next();
                     } else {
                        console.log("there are no matching urls for id " + shortId);
                        res.send("There are no matching URLs for the ID provided: "+shortId);
                     }
                     db.close();
                     return next();
                  } else {
                     db.close();
                     console.log(err);
                     return next();
                  }
               });
            } else {
               console.log(err);
               db.close();
               res.send(err);
            }
         });
      } else {
         res.send(err);
      }
   });
};
