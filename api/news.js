const express = require('express');
const router = express.Router();
const News = require('../models/NewsModel');

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Add news (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const news = new News({ title, description });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add news' });
  }
});

module.exports = router;