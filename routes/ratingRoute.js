const express = require('express');
const router = express.Router();
const {
  authenticate,
  addRating,
  getRatingStats,
  getReportRatings,
  deleteRating,
} = require('../controllers/ratingController');

// User routes
router.post('/:reportId', authenticate, addRating);
router.get('/:reportId/stats', authenticate, getRatingStats);
router.delete('/:reportId', authenticate, deleteRating);

// Admin route
router.get('/:reportId/all', authenticate, getReportRatings);

module.exports = router;
