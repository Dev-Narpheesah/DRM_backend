const mongoose = require("mongoose");

const resourceCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    geo: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    contactPhone: { type: String, required: false },
    contactEmail: { type: String, required: false },
    supplies: [{ type: String }],
    capacity: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResourceCenter", resourceCenterSchema);

