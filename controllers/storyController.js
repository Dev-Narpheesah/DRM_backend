const Story = require('../models/StoryModel');

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

exports.addStory = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const story = new Story({ title, content, author });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add story' });
  }
};