const asyncHandler = require("express-async-handler");
const Like = require("../models/LikeModel");

// Toggle like/unlike
const toggleLike = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { sessionId } = req.body; // comes from frontend localStorage
  const userId = req.user ? req.user.id || req.user._id : null;

  if (!userId && !sessionId) {
    return res.status(400).json({ message: "User or sessionId required" });
  }

  // Check if user or session already liked
  const existingLike = await Like.findOne({
    reportId,
    ...(userId ? { userId } : { sessionId }),
  });

  if (existingLike) {
    // Unlike
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    // Like
    const newLike = new Like({ reportId, userId, sessionId });
    await newLike.save();
  }

  const likeCount = await Like.countDocuments({ reportId });
  res.status(200).json({ likeCount });
});

// Get like count (no login required)
const getLikeCount = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { sessionId } = req.query;
  const userId = req.user ? req.user.id || req.user._id : null;

  const likeCount = await Like.countDocuments({ reportId });
  const userLiked = await Like.findOne({
    reportId,
    ...(userId ? { userId } : { sessionId }),
  });

  res.status(200).json({ likeCount, userLiked: !!userLiked });
});

// Get all likes for a report (admin only, still protected)
const getReportLikes = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const likes = await Like.find({ reportId }).populate("userId", "name email");
  res.status(200).json(likes);
});

module.exports = { toggleLike, getLikeCount, getReportLikes };
