const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  reportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Ensure a user can only like a report once
likeSchema.index({ reportId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
