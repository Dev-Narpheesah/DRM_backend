const express = require("express");
const { createReport, getUserReports, getAllReports } = require("../controllers/reportController");
const { authenticate, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, createReport);
router.get("/myreports", authenticate, getUserReports);
router.get("/all", authenticate, isAdmin, getAllReports);

module.exports = router;
