const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const Book = require('../models/book');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authenticateToken, authorizeRoles('admin'), upload.fields([{ name: 'bookCover', maxCount: 1 }, { name: 'bookFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, author, isbn, publisher, publishedDate, description } = req.body;
    const bookCover = req.files.bookCover ? { data: req.files.bookCover[0].buffer, contentType: req.files.bookCover[0].mimetype } : null;
    const bookFile = req.files.bookFile ? { data: req.files.bookFile[0].buffer, contentType: req.files.bookFile[0].mimetype } : null;

    const newBook = new Book({ title, author, isbn, publisher, publishedDate, description, bookCover, bookFile });
    await newBook.save();

    res.status(201).send('Book added');
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), upload.fields([{ name: 'bookCover', maxCount: 1 }, { name: 'bookFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, author, isbn, publisher, publishedDate, description } = req.body;
    const bookCover = req.files.bookCover ? { data: req.files.bookCover[0].buffer, contentType: req.files.bookCover[0].mimetype } : undefined;
    const bookFile = req.files.bookFile ? { data: req.files.bookFile[0].buffer, contentType: req.files.bookFile[0].mimetype } : undefined;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (publisher !== undefined) updateData.publisher = publisher;
    if (publishedDate !== undefined) updateData.publishedDate = publishedDate;
    if (description !== undefined) updateData.description = description;
    if (bookCover !== undefined) updateData.bookCover = bookCover;
    if (bookFile !== undefined) updateData.bookFile = bookFile;
    
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).send('Server Error');
  }
});



router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send('Book deleted');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
