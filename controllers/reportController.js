const Report = require("../models/Report");

// Create Report
const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports of logged-in user
const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).populate("user", "username email");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "username email");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getUserReports, getAllReports };
