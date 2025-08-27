const Comment = require("../models/CommentModel");
const Report = require("../models/ReportModel");

// Get all comments for a report
const getComments = async (req, res) => {
  try {
    const { reportId } = req.params;
    const comments = await Comment.find({ reportId })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Post a new comment (no login required)
const postComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { name, text, parentId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const comment = await Comment.create({
      reportId,
      name: name || "Anonymous", // fallback if no name
      text,
      parentId: parentId || null,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Post comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment (admin-only in your routes)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getComments, postComment, deleteComment };
