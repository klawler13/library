const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


// All Books route
router.get('/', async (req, res) => {
    res.send('All Books route');
})

// New Book (form) route
router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({});
        const book = new Book();
        res.render('books/new', {
            authors: authors,
            book: book
        });
    } catch {
        res.redirect('/books');
    }
})

// Create Book route
router.post('/', async (req, res) => {
    res.send('Create Book route')  ;  
})

module.exports = router;