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
	res.send("API Initialised")
});

router.get('/allUsers', function(req, res) {
   let currentUser = req.cookies.currentUser;
   console.log(currentUser);
   database.get().collection('user').find({username: { $ne: currentUser }}).toArray(function(err, result){
        console.log(result)
        res.json(result)
    });
  
});

router.get('/username/:name', function(req, res) {
	let name = req.params.name;

   database.get().collection('user').find({username: name}).toArray(function(err, result){
        console.log(result)
        res.json(result)
    });
  
});

router.put('/:userID', upload.any(), function(req, res) {
    let userID = req.params.userID;
    let username = req.cookies.currentUser;
    let profileImg = req.files;
    let userposts = null;

    database.get().collection('user').update({_id: new mongodb.ObjectId(userID)},
    {$set: {profileImg: profileImg}}, function (err, result) {
    });

    // database.get().collection('posts').find( {
    //                  userDetails: { $all: [
    //                                 { "$elemMatch" : { username: username } }
    //                               ] }
    //                } ).toArray(function(err, result){
    //     userposts = result
       
    // });
    
    database.get().collection('posts').update({
                     userDetails: { $all: [
                                    { "$elemMatch" : { username: username } }
                                  ] }
                   },
    {$set: {userDetails: [{'_id': userID, 'username':username, 'profileImg':profileImg }] }},{ multi: true }, function (err, result) {
      res.json({result: result, message: "Profile Image Updated"});
    }
  );
  
});


//router.delete('/user/:id', function(req, res) {
//  let id = req.params.id;
//  let dbcollection = req.params.collection;    
//
//    database.get().collection('user').remove({_id: new mongodb.ObjectId(id)}, function(err, result){
//        console.log(result)
//        res.json({result: result, message: "User delete request successful"})
//    });
//  
//});

module.exports = router;
