var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('pages/myEvents');
});

//redirect to appropriate view

module.exports = router;
