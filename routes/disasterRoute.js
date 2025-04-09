const express = require("express");
const router = express.Router();
const {
  createDisaster,
  getAllDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
} = require("../controllers/disasterController");

// Routes
router.post("/create", createDisaster);
router.get("/", getAllDisasters);
router.get("/:id", getDisasterById);
router.put("/:id", updateDisaster);
router.delete("/:id", deleteDisaster);

module.exports = router;