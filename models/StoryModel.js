const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Story', StorySchema);