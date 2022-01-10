const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    bookAddedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageFileName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageFileName != null) {
        return path.join('/',coverImageBasePath, this.coverImageFileName);
    }
});

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;