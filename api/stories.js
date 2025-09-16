const express = require('express');
const router = express.Router();
const Story = require('../models/StoryModel');

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Add story (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const story = new Story({ title, content, author });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add story' });
  }
});

module.exports = router;