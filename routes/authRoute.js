const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/authController');

// ================= AUTH ROUTES =================

// Register a new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

module.exports = router;
