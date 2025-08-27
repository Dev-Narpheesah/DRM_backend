const express = require('express');
const router = express.Router();
const {
  addRating,
  getRatingStats,
  getReportRatings,
  deleteRating,
} = require('../controllers/ratingController');

// ⭐ Anyone can rate
router.post('/:reportId', addRating);

// ⭐ Anyone can view stats
router.get('/:reportId/stats', getRatingStats);

// ⭐ Admin only: see all ratings (optional, can add auth if you want)
router.get('/:reportId/all', getReportRatings);

// ⭐ Anyone can delete their own rating
router.delete('/:reportId', deleteRating);

module.exports = router;
