const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get('/', function(req, res, next) {
  if(req.cookies.token && req.cookies.currentUser){
      res.render('eventLog');
  }
  res.render('index');
//routes to the index page if a cookie is not set otherwise redirect to posts page
});

module.exports = router;
