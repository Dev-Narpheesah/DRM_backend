const express = require("express");
const { verifyPayment, getDonations } = require("../controllers/paymentController");
const { authenticate, authorize } = require("../Middleware/authMiddleware");

const router = express.Router();

// POST /api/donations/verify
router.post("/verify", verifyPayment);

// GET /api/donations (Admin)
router.get("/", authenticate, authorize(["admin"]), getDonations);

module.exports = router;
