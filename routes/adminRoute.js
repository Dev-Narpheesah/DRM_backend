const express = require('express');
const { registerUser, loginUser, getUser, getAllUsers, logoutUser } = require('../controllers/adminController');

const router = express.Router();


router.post('/register', registerUser)
router.get('/user/:id', getUser); // Get user by ID
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/total-users', getAllUsers);  

module.exports = router;
