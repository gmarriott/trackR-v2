"use strict";
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
	res.send("Authentication API Initialised")
});

router.post('/:collection/login', function(req, res, err) {
    let dbcollection = req.params.collection;
    let username = req.body.username
    let password = req.body.password

    
    let query = database.get().collection(dbcollection).findOne({
      username:{ $eq: username }
  });

      query.then(function(result){
        if(result == null){
            res.status(500).send('Account Not Found!')
        }
        bcrypt.compare(password, result.password, function(err, response){
           if(response == true){
            var token = jwt.encode(result, jwt_secret);
            var currentUser = username;
            res.send({token: token, currentUser: currentUser})
           }else{
                 res.status(500).send('Password Does not match!')
            }
        });
          //uses node package bcrypt to check the password provided matches the hased password in the db
    })

  });

router.post('/:collection/register', function(req, res) {
    let dbcollection = req.params.collection;
    var saltRounds = 10;
	  var salt = bcrypt.genSaltSync(saltRounds);
    var securePassword = bcrypt.hashSync(req.body.password, salt);
	 database.get().collection(dbcollection).insert({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:securePassword
  });
	 	res.send("User Added")
  //on register the bycrypt password hashes the password provided by the user before inserting into mongo
});


router.get('/getCurrentUser', function(req, res) {
  if(req.cookies.token && req.cookies.currentUser){
       database.get().collection('user').find({username: req.cookies.currentUser}).toArray(function(err, result){
         res.send({currentUser: req.cookies.currentUser, user: result });
    });
     
  }
}); //gets the current user name and token from the cookie on the browser

router.get('/logout',function(req,res){
    res.cookie("token", "", { expires: new Date() });
    res.cookie("currentUser", "", { expires: new Date() });
    res.redirect('/');
}); //sets the cookie attributes to null on logout click 


module.exports = router;
