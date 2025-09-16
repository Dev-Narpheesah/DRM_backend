const News = require('../models/NewsModel');

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.addNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const news = new News({ title, description });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add news' });
  }
};