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
const { getAllUsers, getUserById, updateUserByAdmin, deleteUserByAdmin } = require("../controllers/userController");
const { deleteReport, updateReport, getAllReports, getReport } = require("../controllers/reportController");
const { authenticate, authorize } = require("../Middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin-only: Users
router.get("/users", authenticate, authorize(["admin"]), getAllUsers);
router.get("/users/:id", authenticate, authorize(["admin"]), getUserById);
router.put("/users/:id", authenticate, authorize(["admin"]), updateUserByAdmin);
router.delete("/users/:id", authenticate, authorize(["admin"]), deleteUserByAdmin);

// Admin-only: Reports
router.get("/reports", authenticate, authorize(["admin"]), getAllReports);
router.get("/reports/:id", authenticate, authorize(["admin"]), getReport);
router.put("/reports/:id", authenticate, authorize(["admin"]), updateReport);
router.delete("/reports/:id", authenticate, authorize(["admin"]), deleteReport);

module.exports = router;

