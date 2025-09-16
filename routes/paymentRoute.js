const express = require("express");
const { verifyPayment, getDonations, getTotalDonations } = require("../controllers/paymentController");


const router = express.Router();

// GET /api/donations/total
router.get("/total", getTotalDonations);

// POST /api/donations/verify
router.post("/verify", verifyPayment);

// GET /api/donations (Admin)
router.get("/", getDonations);

module.exports = router;
