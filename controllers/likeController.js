const asyncHandler = require("express-async-handler");
const Like = require("../models/LikeModel");

// Toggle reaction (Facebook-like reactions)
const toggleLike = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { sessionId, reactionType } = req.body; // comes from frontend localStorage
  const userId = req.user ? req.user.id || req.user._id : null;

  if (!userId && !sessionId) {
    return res.status(400).json({ message: "User or sessionId required" });
  }

  // Check if user or session already reacted
  const existingLike = await Like.findOne({
    reportId,
    ...(userId ? { userId } : { sessionId }),
  });

  if (existingLike) {
    // If same reaction, remove (toggle off). If different, update reaction type
    if (!reactionType || existingLike.reactionType === reactionType) {
      await Like.findByIdAndDelete(existingLike._id);
    } else {
      existingLike.reactionType = reactionType;
      await existingLike.save();
    }
  } else {
    // Create new reaction
    const newLike = new Like({ reportId, userId, sessionId, reactionType: reactionType || 'like' });
    await newLike.save();
  }

  const likeCount = await Like.countDocuments({ reportId });
  // Build reaction distribution
  const reactions = await Like.aggregate([
    { $match: { reportId: Like.db.castObjectId(reportId) } },
    { $group: { _id: '$reactionType', count: { $sum: 1 } } },
  ]);
  const distribution = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
  reactions.forEach(r => { distribution[r._id] = r.count; });

  res.status(200).json({ likeCount, distribution, reaction: reactionType || (existingLike ? existingLike.reactionType : null) });
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

  // Reaction distribution
  const reactions = await Like.aggregate([
    { $match: { reportId: Like.db.castObjectId(reportId) } },
    { $group: { _id: '$reactionType', count: { $sum: 1 } } },
  ]);
  const distribution = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
  reactions.forEach(r => { distribution[r._id] = r.count; });

  res.status(200).json({ likeCount, userLiked: !!userLiked, userReaction: userLiked ? userLiked.reactionType : null, distribution });
});

// Get all likes for a report (admin only, still protected)
const getReportLikes = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const likes = await Like.find({ reportId }).populate("userId", "name email");
  res.status(200).json(likes);
});

module.exports = { toggleLike, getLikeCount, getReportLikes };
