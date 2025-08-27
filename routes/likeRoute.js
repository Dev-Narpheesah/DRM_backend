const express = require("express");
const { authenticate } = require("../Middleware/authMiddleware");
const {
  toggleLike,
  getLikeCount,
  getReportLikes,
} = require("../controllers/likeController");

const router = express.Router();

// Public: Toggle like/unlike
router.post("/:reportId/toggle", toggleLike);

// Public: Get like count + whether current session/user liked
router.get("/:reportId/count", getLikeCount);

// Admin only: Get all likes for a report
router.get("/:reportId", authenticate, getReportLikes);

module.exports = router;
