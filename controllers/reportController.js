// controllers/reportController.js
const asyncHandler = require("express-async-handler");
const Report = require("../models/ReportModel");
const Comment = require("../models/CommentModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) reject(err);
      else resolve({ url: result.secure_url, public_id: result.public_id });
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

// ====== REPORTS ======
const createReport = asyncHandler(async (req, res) => {
  const { email, phone, disasterType, location, report } = req.body;
  if (!email || !phone || !disasterType || !location || !report || !req.file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const image = await uploadImageToCloudinary(req.file.buffer);
  const newReport = new Report({
    user: req.user.id,
    email,
    phone,
    disasterType,
    location,
    report,
    image,
  });

  const savedReport = await newReport.save();
  const io = req.app.get("io");
  if (io) io.emit("report:created", savedReport);

  res.status(201).json(savedReport);
});

const getUserReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user.id }).populate("user", "username email");
  res.json(reports);
});

const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort("-createdAt").populate("user", "username email");
  res.json(reports);
});

const getReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate("user", "username email");
  if (!report) return res.status(404).json({ message: "Report not found" });
  res.json(report);
});

const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  // allow owner or admin
  const isOwner = report.user.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }

  report.email = req.body.email || report.email;
  report.phone = req.body.phone || report.phone;
  report.disasterType = req.body.disasterType || report.disasterType;
  report.location = req.body.location || report.location;
  report.report = req.body.report || report.report;

  if (req.file) report.image = await uploadImageToCloudinary(req.file.buffer);

  const updatedReport = await report.save();
  const io = req.app.get("io");
  if (io) io.emit("report:updated", updatedReport);

  res.json(updatedReport);
});

const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  // allow owner or admin
  const isOwner = report.user.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await report.deleteOne();
  const io = req.app.get("io");
  if (io) io.emit("report:deleted", { _id: req.params.id });

  res.json({ message: "Report deleted successfully!" });
});

module.exports = {
  createReport,
  getUserReports,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
};
