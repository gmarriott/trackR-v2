var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('pages/register');
});
//redirect to appropriate view

module.exports = router;
