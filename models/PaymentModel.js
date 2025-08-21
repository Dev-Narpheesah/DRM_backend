const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  transactionId: { type: String, required: true, unique: true },
  status: { type: String, required: true }, // "successful"
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
