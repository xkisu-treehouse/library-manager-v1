var express = require('express');
var router = express.Router();

var Book = require('../models').Book
var Loan = require('../models').Loan
var Patron = require('../models').Patron

router.get('/books', function(req, res, next) {
  Book.findAll().then(books => {
    res.render('books/books', {
      title: 'Books',
      books
    })
  })
})

router.get('/books/overdue', function(req, res, next) {
  Book.findAll({
    include: [{
      model: Loan,
      as: 'loan',
      where: {
        return_by: {
          $lt: new Date()
        },
        returned_on: null
      }
    }]
  }).then(books => {
    res.render('books/books', {
      title: 'Overdue Books',
      books
    })
  })
})

router.get('/books/checked', function(req, res, next) {
  Book.findAll({
    include: [{
      model: Loan,
      as: 'loan',
      where: {
        return_by: {
          $gte: new Date()
        },
        returned_on: null
      }
    }]
  }).then(books => {
    res.render('books/books', {
      title: 'Overdue Books',
      books
    })
  })
})

router.get('/books/new', function(req, res, next) {
  Book.findAll().then(books => {
    res.render('books/new', {
      title: 'New Book',
      books
    })
  })
})

router.post('/books/new', function(req, res, next) {
  Book.create({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    first_published: req.body.first_published
  }).then(book => {
    res.redirect('/books')
  })
})

router.get('/books/:bookid', function(req, res, next) {
  Book.findOne({
    where: {
      id: req.params.bookid
    }
  }).then(book => {
    Loan.findAll({
      where: {
        book_id: book.id
      },
      include: [{
        model: Patron,
        as: 'patron',
        required: true
      }]
    }).then(loans => {
      if (!book) {
        res.render('404')
      } else {
        res.render('books/book', {
          title: book.title,
          book,
          loans
        }) 
      }
    })
  })
})

router.post('/books/:bookid', function(req, res, next) {
  Book.findOne({
    where: {
      id: req.params.bookid
    }
  }).then(book => {
    if (!book) {
      res.render('404')
    } else {
      book.updateAttributes({
        ...req.body
      }).then(() => {
        res.redirect('/books')
      }).catch(err => {
        console.error(err)
      })
    }
  })
})

module.exports = router;
