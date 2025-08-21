const express = require("express");
const { verifyPayment, getDonations } = require("../controllers/paymentController");

const router = express.Router();

// POST /api/donations/verify
router.post("/verify", verifyPayment);

// GET /api/donations (Admin)
router.get("/", getDonations);

module.exports = router;
