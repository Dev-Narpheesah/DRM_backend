const mongoose = require("mongoose");

const DisasterSchema = new mongoose.Schema(
    {
        country: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        disasterType: {
            type: String,
            required: true
        },
        casualities: {
            type: Number,
            required: true
        },
        injured: {
            type: Number,
            required: true
        },
        death: {
            type: Number,
            required: true
        },
    },

    { timestamps: true }

)

module.exports = mongoose.model("Disaters", DisasterSchema);