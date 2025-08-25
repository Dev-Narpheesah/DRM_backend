const express = require("express");
const { authenticate } = require("../Middleware/authMiddleware");
const {
  toggleLike,
  getLikeCount,
  getReportLikes,
} = require("../controllers/likeController");

const router = express.Router();

// Toggle like/unlike
router.post("/:reportId/toggle", authenticate, toggleLike);

// Get like count + whether user liked
router.get("/:reportId/count", authenticate, getLikeCount);

// Get all likes for a report (admin)
router.get("/:reportId", authenticate, getReportLikes);

module.exports = router;
