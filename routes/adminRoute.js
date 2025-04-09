const express = require('express');
const { registerUser, loginUser, getAllUsers, logoutUser } = require('../controllers/adminController');

const router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/total-users', getAllUsers);  

module.exports = router;
