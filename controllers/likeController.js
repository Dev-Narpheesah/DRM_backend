const asyncHandler = require("express-async-handler");
const Like = require("../models/LikeModel");

// Toggle like/unlike
const toggleLike = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.id || req.user._id;

  // Check if user already liked the report
  const existingLike = await Like.findOne({ reportId, userId });

  if (existingLike) {
    // Unlike
    await Like.findByIdAndDelete(existingLike._id);
    const likeCount = await Like.countDocuments({ reportId });

    const io = req.app.get("io");
    if (io) io.emit("like:updated", { reportId, userId, liked: false, likeCount });

    res.status(200).json({
      message: "Report unliked successfully",
      liked: false,
      likeCount,
    });
  } else {
    // Like
    const newLike = new Like({ reportId, userId });
    await newLike.save();
    const likeCount = await Like.countDocuments({ reportId });

    const io = req.app.get("io");
    if (io) io.emit("like:updated", { reportId, userId, liked: true, likeCount });

    res.status(201).json({
      message: "Report liked successfully",
      liked: true,
      likeCount,
    });
  }
});

// Get like count + if current user liked
const getLikeCount = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.id || req.user._id;

  const likeCount = await Like.countDocuments({ reportId });
  const userLiked = await Like.findOne({ reportId, userId });

  res.status(200).json({
    likeCount,
    userLiked: !!userLiked,
  });
});

// Get all likes for a report (admin)
const getReportLikes = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const likes = await Like.find({ reportId }).populate("userId", "name email");
  res.status(200).json(likes);
});

module.exports = { toggleLike, getLikeCount, getReportLikes };
