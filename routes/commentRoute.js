const express = require("express");
const { authenticate } = require("../Middleware/authMiddleware");
const {
  getComments,
  postComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// ================= COMMENTS =================
router.get("/:reportId", getComments);
router.post("/:reportId", authenticate, postComment);
router.delete("/:commentId", authenticate, deleteComment);

module.exports = router;
