const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  sessionId: {
    type: String, // for guests
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure uniqueness: one like per userId OR per sessionId
likeSchema.index({ reportId: 1, userId: 1 }, { unique: true, sparse: true });
likeSchema.index({ reportId: 1, sessionId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Like", likeSchema);
