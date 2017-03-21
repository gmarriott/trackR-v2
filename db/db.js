const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017/aaf'
var database

module.exports.connect = function(){
MongoClient.connect(url, function(err, db) { //Pass in the url and return the assign db object to database variable
    assert.equal(null, err)
    console.log("Connected to Mongo")
    database = db;
});
}

module.exports.get = function() {
  return database
}
