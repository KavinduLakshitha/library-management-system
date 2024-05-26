const express = require('express');
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

router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const newBook = new Book({ title, author, description });
    await newBook.save();
    res.status(201).send('Book added');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, description }, { new: true });
    res.json(updatedBook);
  } catch (error) {
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
