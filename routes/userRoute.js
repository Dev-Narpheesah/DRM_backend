// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");

// // User routes
// router.post("/register", async (req, res, next) => {
//   req.body.role = "user"; // force role to user
//   next();
// }, registerUser);

// router.post("/login", async (req, res, next) => {
//   req.body.role = "user"; // optional: validate role if needed
//   next();
// }, loginUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

