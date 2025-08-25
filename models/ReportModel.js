const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to User model
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    disasterType: {
      type: String,
      required: true,
      enum: ["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado", "Other"], // restrict to known disasters
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    report: {
      type: String,
      required: true,
      maxlength: 2000, // limit size
    },
    image: {
      url: { type: String }, // Cloudinary URL
      public_id: { type: String }, // Cloudinary ID for deletion
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
