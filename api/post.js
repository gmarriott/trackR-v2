const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const cookieParser = require('cookie-parser');
const router = express.Router();
const database = require('../db/db.js'); //include database file for CRUD operations
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest: './public/images'});
const jwt_secret = "b3015660";  
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
router.use(cookieParser());


router.get('/', function(req, res) {
	res.send("Post API Initialised")
});


router.get('/:collection', function(req, res) {
    let dbcollection = req.params.collection;
    database.get().collection(dbcollection).find().toArray(function(err, result){
        res.json(result)
    }); 
  
});

router.get('/:collection/:id', function(req, res) {
    let dbcollection = req.params.collection;
     let id = req.params.id;
    database.get().collection(dbcollection).find({_id: new mongodb.ObjectId(id)}).toArray(function(err, result){
        res.json(result)
    }); 
  
});

router.get('/:collection/getUserPosts', function(req, res) {
  let name = req.cookies.currentUser;
    let dbcollection = req.params.collection;
    database.get().collection(dbcollection).find( {
                     userDetails: { $all: [
                                    { "$elemMatch" : { username: name } }
                                  ] }
                   } ).toArray(function(err, result){
        console.log(result)
        res.json(result)
    });
});

router.post('/:collection', upload.any(), function(req, res) {
   let dbcollection = req.params.collection;
   let username = req.cookies.currentUser;
   let date = new Date();
   let user = [];
   console.log(req.body.long); 



     
    
  if(username == null){
      res.json({message: "New post failed, authentication required"})
  }else{
    database.get().collection('user').find({username: username}, { username: 1, profileImg: 1 } ).toArray(function(err, result){
    

  database.get().collection(dbcollection).insert({
       title: req.body.title,
       desc: req.body.desc,
       type: req.body.type,
       location: req.body.location,
       lat: req.body.lat,
       long: req.body.long,
       userDetails: result,
       postDate: date
 }, function (err, result){
      res.json({result: result, message:"New post request successful"});
  });
  });
  }
     
});

router.post('/:collection/:id', upload.any(), function(req, res) {
    let id = req.params.id;
    let dbcollection = req.params.collection;
    let date = new Date();
    let comment = {"commentdesc":req.body.desc, "commentFile":req.files, "user":req.cookies.currentUser, "commentdate":date };
    
      database.get().collection(dbcollection).update({_id: new mongodb.ObjectId(id)},
    {$push: {comment: comment}}, function (err, result) {
      res.json({result: result, message: "New comment request successful"});
    }
  );
    
    });
   


router.put('/:collection/:id', function(req, res) {
  let id = req.params.id;
  let username = req.cookies.currentUser;
  let updatedTitle = req.body.title;
  let updatedDesc = req.body.desc;
  let updatedType = req.body.type;
  let updatedLocation = req.body.location;
  let newLat = req.body.lat;
  let newLong = req.body.long;
  let dbcollection = req.params.collection;     
    
    if(username == null){
       res.json({message: "Put request failed, authentication required"})
   }else{
 

     database.get().collection(dbcollection).update({_id: new mongodb.ObjectId(id)},
    {$set: {title: updatedTitle, desc: updatedDesc, type: updatedType, location: updatedLocation, lat: newLat, long:newLong }}, function (err, result) {
      res.send({result: result, message: "Update request successful"});
    }
  );
   }
  
});

router.delete('/:collection/:id', function(req, res) {
  let id = req.params.id;
  let dbcollection = req.params.collection;
  let username = req.cookies.currentUser;
  if(username == null){
       res.json({message: "Delete failed, authentication required"})
   }else{    
    database.get().collection(dbcollection).remove({_id: new mongodb.ObjectId(id)}, function(err, result){
        console.log(result)
        res.json({result: result, message: "Delete request successful"})
    });
   }
  
});




module.exports = router;
