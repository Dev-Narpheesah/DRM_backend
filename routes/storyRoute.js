const express = require('express');
const router = express.Router();
const { getStories, addStory } = require('../controllers/storyController');

router.get('/', getStories);
router.post('/', addStory); // Admin only

module.exports = router;