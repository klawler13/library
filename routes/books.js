const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const fs = require('fs');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', Book.coverImageBasePath);
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
});

// All Books route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex( 'title', new RegExp( req.query.title, 'i'));
    }
    if (req.query.publishedBeforeDate != null && req.query.publishedBeforeDate !== '') {
        query = query.lte( 'publishDate', new RegExp( req.query.publishedBeforeDate ));
    }
    if (req.query.publishedAfterDate != null && req.query.publishedAfterDate !== '') {
        query = query.gte( 'publishDate', new RegExp( req.query.publishedAfterDate ));
    }
    try {
        const books = await query.exec();
        res.render('books/index',{ books: books, searchOptions: req.query });    
    } catch {
        res.redirect('/');
    }
})

// New Book (form) route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
})

// Create Book route
router.post('/', upload.single('cover'), async (req, res) => {
    // consider creating a hashed-route table where we create a hash of the ?id and ?name
    // that are posted and then when someone does a GET later on, we check for a valid
    // hash before we do anything else, return 4xx if not found?? Does this solve the issue
    // of users entering odd paths and regex data in input fields??

    // can we also use the above to keep dups out??
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageFileName: fileName,
        description: req.body.description
    });

    try{
        const newBook = await book.save();
        res.redirect(`books?title=${newBook.title}`);
    } catch (err) {
        console.log(err);
        if (book.coverImageFileName!= null) {
            removeBookCover(book.coverImageFileName);
        }
        renderNewPage(res, book, true);
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err);
    });    
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (hasError) params.errorMessage = 'Error creating book';
        res.render('books/new', params);
    } catch {
        console.error('renderNewPage error')
        res.redirect('/books');
    }
}

module.exports = router;