var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});
//redirect to appropriate view 

module.exports = router;
