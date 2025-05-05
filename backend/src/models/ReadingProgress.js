const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  currentPage: {
    type: Number,
    required: true,
    min: 0
  },
  readingDevice: {
    type: String,
    required: true,
    enum: ['paper', 'ebook', 'audiobook', 'tablet', 'phone']
  },
  comment: {
    type: String,
    maxLength: 250
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReadingProgress', readingProgressSchema); 