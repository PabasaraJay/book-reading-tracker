const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate('bookId', 'title totalPages')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quotes for a specific book
router.get('/book/:bookId', async (req, res) => {
  try {
    const quotes = await Quote.find({ bookId: req.params.bookId })
      .populate('bookId', 'title totalPages')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all quotes by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quotes by date range
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const quotes = await Quote.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new quote
router.post('/', async (req, res) => {
  const quote = new Quote(req.body);
  try {
    const newQuote = await quote.save();
    const populatedQuote = await Quote.findById(newQuote._id)
      .populate('bookId', 'title totalPages');
    res.status(201).json(populatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a quote
router.put('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    Object.assign(quote, req.body);
    const updatedQuote = await quote.save();
    const populatedQuote = await Quote.findById(updatedQuote._id)
      .populate('bookId', 'title totalPages');
    res.json(populatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 