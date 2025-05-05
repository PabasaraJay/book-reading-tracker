const express = require('express');
const router = express.Router();
const ReadingProgress = require('../models/ReadingProgress');

// Get all reading progress entries
router.get('/', async (req, res) => {
  try {
    const entries = await ReadingProgress.find()
      .populate('bookId', 'title totalPages')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reading progress for a specific book
router.get('/book/:bookId', async (req, res) => {
  try {
    const entries = await ReadingProgress.find({ bookId: req.params.bookId })
      .populate('bookId', 'title totalPages')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reading progress entries for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest reading progress for a book
router.get('/latest/book/:bookId', async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({ bookId: req.params.bookId })
      .sort({ createdAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reading progress entry
router.post('/', async (req, res) => {
  const entry = new ReadingProgress(req.body);
  try {
    const newEntry = await entry.save();
    const populatedEntry = await ReadingProgress.findById(newEntry._id)
      .populate('bookId', 'title totalPages');
    res.status(201).json(populatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a reading progress entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await ReadingProgress.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    Object.assign(entry, req.body);
    const updatedEntry = await entry.save();
    const populatedEntry = await ReadingProgress.findById(updatedEntry._id)
      .populate('bookId', 'title totalPages');
    res.json(populatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reading progress entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await ReadingProgress.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    await ReadingProgress.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 