const asyncHandler = require('express-async-handler');
const Notification = require('../models/NotificationModel');

// List notifications for current user
exports.listNotifications = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) return res.status(401).json({ message: 'Unauthorized' });
  const items = await Notification.find({ userId: id }).sort({ createdAt: -1 });
  res.json(items);
});

// Mark one as read
exports.markRead = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) return res.status(401).json({ message: 'Unauthorized' });
  const { notifId } = req.params;
  const updated = await Notification.findOneAndUpdate(
    { _id: notifId, userId: id },
    { read: true },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

// Mark all as read
exports.markAllRead = asyncHandler(async (req, res) => {
  const { id } = req.user || {};
  if (!id) return res.status(401).json({ message: 'Unauthorized' });
  await Notification.updateMany({ userId: id, read: false }, { read: true });
  res.json({ success: true });
});


