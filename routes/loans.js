var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan
var Book = require('../models').Book
var Patron = require('../models').Patron

/* GET home page. */
router.get('/loans', function(req, res, next) {
  Loan.findAll({
    include: [
      {
        model: Book,
        as: 'book',
        required: true
      },
      {
        model: Patron,
        as: 'patron',
        required: true
      }
    ]
  }).then(loans => {
    res.render('loans/loans', {
      title: 'Loans',
      loans
    })
  })
})

router.get('/loans/overdue', function(req, res, next) {
  Loan.findAll({
    include: [
      {
        model: Book,
        as: 'book',
        required: true
      },
      {
        model: Patron,
        as: 'patron',
        required: true
      }
    ],
    where: {
      return_by: {
        $lt: new Date()
      },
      returned_on: null
    }
  }).then(loans => {
    res.render('loans/loans', {
      title: 'Overdue Loans',
      loans
    })
  })
})

router.get('/loans/checked', function(req, res, next) {
  Loan.findAll({
    include: [
      {
        model: Book,
        as: 'book',
        required: true
      },
      {
        model: Patron,
        as: 'patron',
        required: true
      }
    ],
    where: {
      return_by: {
        $gte: new Date()
      },
      returned_on: null
    }
  }).then(loans => {
    res.render('loans/loans', {
      title: 'Overdue Loans',
      loans
    })
  })
});

router.get('/loans/new', function (req, res) {
  Book.findAll().then(books => {
    Patron.findAll().then(patrons => {
      res.render('loans/new', {
        books,
        patrons
      })
    })
  })
})

router.post('/loans/new', function (req, res) {
  Loan.create({
    ...req.body
  }).then(loan => {
    res.redirect('/loans')
  })
})

router.get('/loans/return/:id', function (req, res) {
  const loanid = req.params.id

  Loan.findOne({
    include: [
      {
        model: Book,
        as: 'book',
        required: true
      },
      {
        model: Patron,
        as: 'patron',
        required: true
      }
    ],
    where: {
      id: loanid
    }
  }).then(loan => {
    res.render('loans/return', {
      title: 'Return Loan',
      loan
    })
  })
})

router.post('/loans/return', function (req, res) {
  const loanid = req.body.loan_id
  Loan.findOne({
    where: {
      id: loanid
    }
  }).then(loan => {
    loan.updateAttributes({
      returned_on: new Date(req.body.returned_on)
    }).then(loan => {
      res.redirect('/loans')
    })
  })
})

module.exports = router;
