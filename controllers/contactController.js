const nodemailer = require('nodemailer');

const Contact = require('../models/ContactModel');

exports.sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    // Save message to DB
    const contactMsg = await Contact.create({ name, email, message });

    // Send notification email to admin
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
    res.status(200).json({ success: true, message: 'Message sent successfully', contactMsg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Admin: Get all contact messages
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Admin: Reply to a contact message
exports.replyToContactMessage = async (req, res) => {
  const { email, reply } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reply from Relief Admin',
      text: reply,
    });
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};