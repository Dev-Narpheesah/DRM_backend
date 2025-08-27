const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  userId: {
    type: String, // ✅ allow anonymous/public users too
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Ensure one rating per userId per report
ratingSchema.index({ reportId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
