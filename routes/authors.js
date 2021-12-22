const express = require('express');
const router = express.Router();


// All Authors route
router.get('/', (req, res) => {
    res.render('authors/index');
})

// New Author (form) route
router.get('/new', (req, res) => {
    res.render('authors/new');
})

// Create Author route
router.post('/new', (req, res) => {
    res.send('Create Author Route');
})

module.exports = router;