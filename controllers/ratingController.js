const asyncHandler = require('express-async-handler');
const Rating = require('../models/RatingModel');

// ⭐ Add or update rating
const addRating = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { rating, userId } = req.body; // ✅ allow userId from body for public users

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
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
  const { userId } = req.query; // ✅ optional: check if current visitor rated

  const ratings = await Rating.find({ reportId });
  const userRating = userId ? await Rating.findOne({ reportId, userId }) : null;

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
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    userRating: userRating ? userRating.rating : null,
  });
});

// ⭐ Admin: get all ratings
const getReportRatings = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const ratings = await Rating.find({ reportId });
  res.status(200).json(ratings);
});

// ⭐ Delete rating
const deleteRating = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { userId } = req.body; // ✅ allow frontend to pass userId

  if (!userId) {
    return res.status(400).json({ message: 'UserId required' });
  }

  const deletedRating = await Rating.findOneAndDelete({ reportId, userId });

  if (!deletedRating) {
    return res.status(404).json({ message: 'Rating not found' });
  }

  res.status(200).json({ message: 'Rating deleted successfully' });
});

module.exports = {
  addRating,
  getRatingStats,
  getReportRatings,
  deleteRating,
};
