const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const Book = require('../models/book');
const User = require('../models/user');
const DownloadedBook = require('../models/downloadedBook');

// Get all books
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add a new book
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

// Update an existing book
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

// Delete a book
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send('Book deleted');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Save downloaded book to user's collection
router.post('/download/:bookId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bookId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!user.downloadedBooks.includes(bookId)) {
      user.downloadedBooks.push(bookId);
      await user.save();
    }

    res.send('Book added to your collection');
  } catch (error) {
    console.error('Error downloading book:', error);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/download', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookId = req.params.id;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    // Save the downloaded book entry
    const downloadedBook = new DownloadedBook({
      user: userId,
      book: bookId
    });
    await downloadedBook.save();

    res.send('Book downloaded successfully');
  } catch (error) {
    console.error('Error downloading book:', error);
    res.status(500).send('Server Error');
  }
});

// Fetch user's downloaded books
router.get('/my-books', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate('downloadedBooks');
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user.downloadedBooks);
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).send('Server Error');
  }
});

// router.get('/search', authenticateToken, async (req, res) => {
//   const { title } = req.query;
//   try {
//     const books = await Book.find({ title: { $regex: title, $options: 'i' } });
//     res.json(books);
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
