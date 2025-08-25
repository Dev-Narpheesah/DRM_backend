// const express = require('express');
// const { registerUser, loginUser, getUser, getAllUsers, logoutUser } = require('../controllers/adminController');

// const router = express.Router();


// router.post('/register', registerUser)
// router.get('/user/:id', getUser); // Get user by ID
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);
// router.get('/total-users', getAllUsers);  

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");

// // Admin routes
// router.post("/register", async (req, res, next) => {
//   req.body.role = "admin"; // force role to admin
//   next();
// }, registerUser);

// router.post("/login", async (req, res, next) => {
//   req.body.role = "admin"; // optional: validate role if needed
//   next();
// }, loginUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;

