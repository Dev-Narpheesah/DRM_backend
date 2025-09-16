const axios = require("axios");
const Payment = require("../models/PaymentModel");

// Get total donation amount
exports.getTotalDonations = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const total = result.length > 0 ? result[0].total : 0;
    res.json({ success: true, total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching total donations" });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { transaction_id, fullName, email, amount, message } = req.body;

    // Verify payment via Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const payment = response.data;

    if (payment.status === "success" && payment.data.status === "successful") {
      // Optional: validate amount
      if (Number(amount) !== payment.data.amount) {
        return res.status(400).json({
          success: false,
          message: "Amount mismatch. Payment not verified.",
        });
      }

      // Save donation
      const donation = await Payment.create({
        fullName,
        email,
        amount,
        message,
        transactionId: transaction_id,
        status: "successful",
      });

      return res.json({
        success: true,
        message: "Donation verified & saved successfully!",
        donation,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not verified",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all donations (Admin)
exports.getDonations = async (req, res) => {
  try {
    const donations = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching donations" });
  }
};
