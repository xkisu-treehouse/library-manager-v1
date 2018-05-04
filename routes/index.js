var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan
var Book = require('../models').Book
var Patron = require('../models').Patron

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
