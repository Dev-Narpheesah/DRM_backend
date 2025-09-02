const mongoose = require("mongoose");

const reliefRequestSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: false },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    needs: { type: [String], default: [] },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Fulfilled", "Rejected"],
      default: "Pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReliefRequest", reliefRequestSchema);

