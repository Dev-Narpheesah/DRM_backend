const express = require("express");
const router = express.Router();
const { getComments, postComment, deleteComment } = require("../controllers/commentController");
const { authenticate, authorize } = require("../Middleware/authMiddleware");

// Public routes
router.get("/:reportId", getComments);     // anyone can view comments
router.post("/:reportId", postComment);    // anyone can add comment

// Protected route (only admin can delete)
router.delete("/:id", authenticate, authorize(["admin"]), deleteComment);

module.exports = router;
