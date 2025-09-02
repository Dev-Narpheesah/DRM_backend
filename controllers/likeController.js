const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Like = require("../models/LikeModel");

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (_) {
    return null;
  }
};

const ALLOWED_REACTIONS = new Set(["like", "love", "care", "haha", "wow", "sad", "angry"]);

// Toggle reaction (Facebook-like reactions)
const toggleLike = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const reportObjectId = toObjectId(reportId);
  if (!reportObjectId) {
    return res.status(400).json({ message: "Invalid reportId" });
  }
  let { sessionId, reactionType } = req.body; // comes from frontend localStorage
  const userId = req.user ? req.user.id || req.user._id : null;

  if (!userId && !sessionId) {
    return res.status(400).json({ message: "User or sessionId required" });
  }

  // Normalize reaction input
  if (reactionType != null && !ALLOWED_REACTIONS.has(reactionType)) {
    reactionType = "like"; // default to like on invalid input
  }

  // Check if user or session already reacted
  const existingLike = await Like.findOne({
    reportId: reportObjectId,
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
    // Create new reaction; handle race duplicate key by retrying as update
    try {
      const newLike = new Like({ reportId: reportObjectId, userId, sessionId, reactionType: reactionType || 'like' });
      await newLike.save();
    } catch (err) {
      if (err && err.code === 11000) {
        // Duplicate key: someone created it concurrently; update instead
        await Like.findOneAndUpdate(
          { reportId: reportObjectId, ...(userId ? { userId } : { sessionId }) },
          { $set: { reactionType: reactionType || 'like' } },
          { new: true }
        );
      } else {
        throw err;
      }
    }
  }

  const likeCount = await Like.countDocuments({ reportId: reportObjectId });
  // Build reaction distribution
  const reactions = reportObjectId
    ? await Like.aggregate([
        { $match: { reportId: reportObjectId } },
        { $group: { _id: '$reactionType', count: { $sum: 1 } } },
      ])
    : [];
  const distribution = { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
  reactions.forEach(r => { distribution[r._id] = r.count; });

  res.status(200).json({ likeCount, distribution, reaction: reactionType || null });
});

// Get like count (no login required)
const getLikeCount = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const reportObjectId = toObjectId(reportId);
  if (!reportObjectId) {
    return res.status(400).json({ message: "Invalid reportId" });
  }
  const { sessionId } = req.query;
  const userId = req.user ? req.user.id || req.user._id : null;

  const likeCount = await Like.countDocuments({ reportId: reportObjectId });
  const userLiked = await Like.findOne({
    reportId: reportObjectId,
    ...(userId ? { userId } : { sessionId }),
  });

  // Reaction distribution
  const reactions = reportObjectId
    ? await Like.aggregate([
        { $match: { reportId: reportObjectId } },
        { $group: { _id: '$reactionType', count: { $sum: 1 } } },
      ])
    : [];
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

// Public: Get reactions detail with user names (limited)
const getReactionsDetail = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const reportObjectId = toObjectId(reportId);
  if (!reportObjectId) return res.status(400).json({ message: "Invalid reportId" });

  // Fetch up to 200 likes to limit payload
  const likes = await Like.find({ reportId: reportObjectId })
    .populate("userId", "username email")
    .lean()
    .limit(200);

  const result = {
    like: [], love: [], care: [], haha: [], wow: [], sad: [], angry: [],
  };
  for (const l of likes) {
    const bucket = l.reactionType || 'like';
    const displayName = l.userId?.username || l.userId?.email || (l.sessionId ? 'Guest' : 'Unknown');
    result[bucket].push({
      id: (l.userId?._id || l.sessionId || l._id)?.toString(),
      name: displayName,
      isGuest: !l.userId,
    });
  }
  res.status(200).json(result);
});

module.exports = { toggleLike, getLikeCount, getReportLikes, getReactionsDetail };
