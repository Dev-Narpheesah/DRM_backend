const express = require("express");
const router = express.Router();
const { getComments, postComment, deleteComment } = require("../controllers/commentController");
const {authenticate } = require("../Middleware/authMiddleware");

router.get("/:reportId", getComments); // public
router.post("/:reportId", authenticate, postComment); // logged in
router.delete("/:id", authenticate, deleteComment); // owner/admin

module.exports = router;
