const express = require("express");
const router = express.Router();
const { getComments, postComment, deleteComment } = require("../controllers/commentController");
const { authenticate } = require("../Middleware/authMiddleware");

// Public routes
router.get("/:reportId", getComments);     // anyone can view comments
router.post("/:reportId", postComment);    // anyone can add comment

// Protected route (only admin can delete)
router.delete("/:id", authenticate, deleteComment);

module.exports = router;
