const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 500
  },
  pageNumber: {
    type: Number,
    required: true,
    min: 1
  },
  note: {
    type: String,
    maxLength: 200
  },
  date: {
    type: Date,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema); 