const express = require('express');
const router = express.Router();
const { sendContactEmail, getAllContactMessages, replyToContactMessage } = require('../controllers/contactController');


// User submits contact form
router.post('/', sendContactEmail);

// Admin fetches all contact messages
router.get('/messages', getAllContactMessages);

// Admin replies to a contact message
router.post('/reply', replyToContactMessage);

module.exports = router;