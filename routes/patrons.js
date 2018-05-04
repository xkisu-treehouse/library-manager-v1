var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron
var Loan = require('../models').Loan
var Book = require('../models').Book

router.get('/patrons', function(req, res, next) {
  Patron.findAll().then(patrons => {
    res.render('patrons/patrons', {
      title: 'Patrons',
      patrons
    })
  })
})

router.get('/patrons/new', function(req, res, next) {
  res.render('patrons/new', {
    title: 'New Patron'
  })
})

router.post('/patrons/new', function(req, res, next) {
  Patron.create({
    ...req.body
  }).then(patron => {
    res.redirect('/patrons')
  })
})

router.get('/patrons/:patronid', function(req, res, next) {
  Patron.find({
    where: {
      id: req.params.patronid
    }
  }).then(patron => {
    Loan.findAll({
      where: {
        patron_id: patron.id
      },
      include: [{
        model: Book,
        as: 'book',
        required: true
      }]
    }).then(loans => {
      if (!patron) {
        res.render('404')
      } else {
        res.render('patrons/patron', {
          title: `${patron.first_name} ${patron.last_name}`,
          patron,
          loans
        })
      }
    })
  })
})

router.post('/patrons/:patronid', function(req, res, next) {
  Patron.findOne({
    where: {
      id: req.params.patronid
    }
  }).then(patron => {
    if (!patron) {
      res.render('404')
    } else {
      patron.updateAttributes({
        ...req.body
      }).then(() => {
        res.redirect('/patrons')
      }).catch(err => {
        console.error(err)
      })
    }
  })
})

module.exports = router;
