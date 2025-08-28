const Comment = require("../models/CommentModel");
const Report = require("../models/ReportModel");

// Get comments for a report (paginated)
const getComments = async (req, res) => {
  try {
    const { reportId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Comment.find({ reportId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Comment.countDocuments({ reportId }),
    ]);

    const hasMore = page * limit < total;

    res.status(200).json({ data: items, page, limit, total, hasMore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Post a new comment (no login required)
const postComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { name, text, parentId } = req.body;

    const trimmed = (text || "").trim();
    if (!trimmed) return res.status(400).json({ message: "Text is required" });
    if (trimmed.length > 500) {
      return res.status(400).json({ message: "Text exceeds 500 characters" });
    }

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const comment = await Comment.create({
      reportId,
      name: name || "Anonymous", // fallback if no name
      text: trimmed,
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
