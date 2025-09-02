const express = require('express');
const router = express.Router();
const {
  addRating,
  getRatingStats,
  getReportRatings,
  deleteRating,
} = require('../controllers/ratingController');
const { authenticate, authorize } = require('../Middleware/authMiddleware');

// ⭐ Anyone can rate
router.post('/:reportId', addRating);

// ⭐ Anyone can view stats
router.get('/:reportId/stats', getRatingStats);

// ⭐ Admin only: see all ratings
router.get('/:reportId/all', authenticate, authorize(['admin']), getReportRatings);

// ⭐ Anyone can delete their own rating (kept public for now)
router.delete('/:reportId', deleteRating);

module.exports = router;
