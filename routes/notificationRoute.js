const express = require('express');
const { authenticate } = require('../Middleware/authMiddleware');
const { listNotifications, markRead, markAllRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticate, listNotifications);
router.patch('/:notifId/read', authenticate, markRead);
router.patch('/read-all', authenticate, markAllRead);

module.exports = router;


