const Comment = require("../models/CommentModel");
const Report = require("../models/ReportModel");

// Get all comments for a report
const getComments = async (req, res) => {
  try {
    const { reportId } = req.params;
    const comments = await Comment.find({ report: reportId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Get comments error:", err);
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

    const comment = await Comment.create({
      user: req.user.id,
      report: reportId,
      text,
    });

    // repopulate so frontend gets user info
    const populatedComment = await comment.populate("user", "username email");

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Post comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // only owner or admin can delete
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, postComment, deleteComment };
