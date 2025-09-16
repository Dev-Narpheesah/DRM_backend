const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact form endpoint
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: email,
      to: process.env.CONTACT_RECEIVER || 'support@relief.org',
      subject: `Contact Form Submission from ${name}`,
      text: message,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;