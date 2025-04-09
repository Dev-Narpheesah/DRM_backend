const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      
    },
    phone: {
      type: String, 
      required: true,
    },
    disasterType: {
      type: String,
      required: true,
      enum: ["Flood", "Earthquake", "Fire", "Hurricane", "Tornado", "Other"],
    },
    location: {
      type: String,
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: false,  
      },
      public_id: {
        type: String,
        required: false, 
      },
    },
    hasSubmittedReport: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
