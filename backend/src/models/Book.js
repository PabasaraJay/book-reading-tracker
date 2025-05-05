const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Short Story',
      'Novel',
      'Adventure',
      'Horror',
      'Mystery',
      'Science Fiction',
      'Fantasy',
      'Romance',
      'Biography',
      'History'
    ]
  },
  language: {
    type: String,
    required: true,
    enum: ['English', 'Sinhala']
  },
  seriesName: {
    type: String,
    trim: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  edition: {
    type: String,
    required: true,
    enum: [
      '1st Edition',
      '2nd Edition',
      '3rd Edition',
      '4th Edition',
      'Revised Edition',
      'Special Edition'
    ]
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema); 