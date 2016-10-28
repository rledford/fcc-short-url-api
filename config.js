module.exports = {
   db: process.env.MONGO_URI,
   urlCollection: process.env.SHORT,
   autoIncCollection: process.env.TRACKER,
   port: process.env.PORT || process.env.LOCAL_PORT
};
