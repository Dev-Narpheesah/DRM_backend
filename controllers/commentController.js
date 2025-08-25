const Comment = require("../models/CommentModel");
const Report = require("../models/ReportModel");

// Get all comments for a report
const getComments = async (req, res) => {
  try {
    const { reportId } = req.params;
    const comments = await Comment.find({ report: reportId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Post a new comment
const postComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { text } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const comment = new Comment({
      user: req.user.id,
      report: reportId,
      text,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, postComment, deleteComment };
