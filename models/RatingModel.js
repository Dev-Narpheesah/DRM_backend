const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
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
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure user can only rate a report once
ratingSchema.index({ reportId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
