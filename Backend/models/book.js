const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required for new books'],
  },
  author: {
    type: String,
    required: [true, 'Author is required for new books'],
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required for new books'],
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required for new books'],
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published Date is required for new books'],
  },
  description: {
    type: String,
    required: [true, 'Description is required for new books'],
  },
  bookCover: {
    data: Buffer,
    contentType: String,
  },
  bookFile: {
    data: Buffer,
    contentType: String,
  },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
