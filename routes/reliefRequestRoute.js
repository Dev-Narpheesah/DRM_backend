const express = require("express");
const { authenticate, authorize } = require("../Middleware/authMiddleware");
const {
  createReliefRequest,
  listReliefRequests,
  getReliefRequest,
  updateReliefRequest,
  deleteReliefRequest,
} = require("../controllers/reliefRequestController");

const router = express.Router();

// Public create and list
router.post("/", createReliefRequest);
router.get("/", listReliefRequests);
router.get("/:id", getReliefRequest);

// Update/delete require auth; allow owner or admin is checked in controller
router.put("/:id", authenticate, updateReliefRequest);
router.delete("/:id", authenticate, deleteReliefRequest);

module.exports = router;

