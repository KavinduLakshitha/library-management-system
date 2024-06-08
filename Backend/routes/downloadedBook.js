const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const DownloadedBook = require('../models/downloadedBook');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const downloadedBooks = await DownloadedBook.find({ user: userId }).populate('book');
    res.json(downloadedBooks);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;