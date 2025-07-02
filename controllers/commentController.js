const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a report
router.get('/:reportId', async (req, res) => {
  try {
    const comments = await Comment.find({ reportId: req.params.reportId });
   
    const nestedComments = buildNestedComments(comments);
    res.json(nestedComments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/', async (req, res) => {
  const { reportId, parentId, name } = req.body;
  if (!reportId || !name) {
    return res.status(400).json({ message: 'Report ID and comment text are required' });
  }

  try {
    const comment = new Comment({ reportId, parentId: parentId || null, name });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
});


router.put('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { name, updatedAt: Date.now() },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit comment' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
   
    const deleteCommentAndChildren = async (commentId) => {
      const children = await Comment.find({ parentId: commentId });
      for (const child of children) {
        await deleteCommentAndChildren(child._id);
      }
      await Comment.findByIdAndDelete(commentId);
    };

    await deleteCommentAndChildren(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});


const buildNestedComments = (comments) => {
  const commentMap = {};
  const nestedComments = [];

  
  comments.forEach((comment) => {
    commentMap[comment._id] = { ...comment._doc, items: [], id: comment._id.toString() };
  });

 
  comments.forEach((comment) => {
    if (comment.parentId) {
      if (commentMap[comment.parentId]) {
        commentMap[comment.parentId].items.push(commentMap[comment._id]);
      }
    } else {
      nestedComments.push(commentMap[comment._id]);
    }
  });

  return nestedComments;
};

module.exports = router;