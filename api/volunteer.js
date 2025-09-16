const express = require('express');
const router = express.Router();
const Volunteer = require('../models/VolunteerModel');

// Volunteer signup
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const volunteer = new Volunteer({ name, email });
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to sign up volunteer' });
  }
});

// Get all volunteers (admin only)
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ date: -1 });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

module.exports = router;