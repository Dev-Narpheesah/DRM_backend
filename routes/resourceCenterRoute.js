const express = require("express");
const { authenticate, authorize } = require("../Middleware/authMiddleware");
const {
  listCenters,
  getCenter,
  createCenter,
  updateCenter,
  deleteCenter,
} = require("../controllers/resourceCenterController");

const router = express.Router();

router.get("/", listCenters);
router.get("/:id", getCenter);

router.post("/", authenticate, authorize(["admin"]), createCenter);
router.put("/:id", authenticate, authorize(["admin"]), updateCenter);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCenter);

module.exports = router;

