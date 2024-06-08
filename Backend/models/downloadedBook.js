const mongoose = require('mongoose');

const downloadedBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
});

const DownloadedBook = mongoose.model('DownloadedBook', downloadedBookSchema);

module.exports = DownloadedBook;