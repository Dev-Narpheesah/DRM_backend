const asyncHandler = require('express-async-handler');
const Rating = require('../models/RatingModel');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Authentication required');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

// ⭐ Add or update rating
const addRating = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id || req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const existingRating = await Rating.findOne({ reportId, userId });

  if (existingRating) {
    existingRating.rating = rating;
    await existingRating.save();
    return res.status(200).json({
      message: 'Rating updated successfully',
      rating: existingRating,
    });
  }

  const newRating = await Rating.create({ reportId, userId, rating });
  res.status(201).json({
    message: 'Rating added successfully',
    rating: newRating,
  });
});

// ⭐ Get stats for a report
const getRatingStats = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.id || req.user._id;

  const ratings = await Rating.find({ reportId });
  const userRating = await Rating.findOne({ reportId, userId });

  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  const ratingDistribution = [1, 2, 3, 4, 5].reduce((acc, num) => {
    acc[num] = ratings.filter((r) => r.rating === num).length;
    return acc;
  }, {});

  res.status(200).json({
    totalRatings,
    averageRating: Math.round(averageRating * 10) / 10, // rounded to 1 decimal
    ratingDistribution,
    userRating: userRating ? userRating.rating : null,
  });
});

// ⭐ Admin: get all ratings
const getReportRatings = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const ratings = await Rating.find({ reportId }).populate('userId', 'name email');
  res.status(200).json(ratings);
});

// ⭐ Delete rating
const deleteRating = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.id || req.user._id;

  const deletedRating = await Rating.findOneAndDelete({ reportId, userId });

  if (!deletedRating) {
    return res.status(404).json({ message: 'Rating not found' });
  }

  res.status(200).json({ message: 'Rating deleted successfully' });
});

module.exports = {
  authenticate,
  addRating,
  getRatingStats,
  getReportRatings,
  deleteRating,
};
