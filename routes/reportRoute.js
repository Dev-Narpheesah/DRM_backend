// routes/reportRoute.js
const express = require("express");
const multer = require("multer");
const {
  createReport,
  getUserReports,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { authenticate } = require("../Middleware/authMiddleware");

const router = express.Router();
const upload = multer(); // handle multipart/form-data

router.post("/", authenticate, upload.single("image"), createReport);
router.get("/my", authenticate, getUserReports);
router.get("/", getAllReports);
router.get("/:id", getReport);
router.put("/:id", authenticate, upload.single("image"), updateReport);
router.delete("/:id", authenticate, deleteReport);

module.exports = router;
