const asyncHandler = require("express-async-handler");
const ReliefRequest = require("../models/ReliefRequestModel");

// Create new relief request (public)
exports.createReliefRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, location, needs, notes, reportId } = req.body;
  if (!name || !email || !phone || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const item = await ReliefRequest.create({
    name,
    email,
    phone,
    location,
    needs: Array.isArray(needs) ? needs : (needs ? [needs] : []),
    notes: notes || "",
    reportId: reportId || null,
    createdByUserId: req.user?.id || null,
  });
  const io = req.app.get("io");
  if (io) io.emit("relief:created", item);
  res.status(201).json(item);
});

// List requests (public)
exports.listReliefRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const items = await ReliefRequest.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

// Get one (public)
exports.getReliefRequest = asyncHandler(async (req, res) => {
  const item = await ReliefRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Update (admin or creator)
exports.updateReliefRequest = asyncHandler(async (req, res) => {
  const item = await ReliefRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  const isOwner = item.createdByUserId?.toString?.() === req.user?.id;
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  const fields = ["name", "email", "phone", "location", "notes", "assignedTo"];
  for (const f of fields) {
    if (req.body[f] != null) item[f] = req.body[f];
  }
  if (req.body.needs) item.needs = Array.isArray(req.body.needs) ? req.body.needs : [req.body.needs];
  if (req.body.status) item.status = req.body.status;

  const saved = await item.save();
  const io = req.app.get("io");
  if (io) io.emit("relief:updated", saved);
  res.json(saved);
});

// Delete (admin or creator)
exports.deleteReliefRequest = asyncHandler(async (req, res) => {
  const item = await ReliefRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  const isOwner = item.createdByUserId?.toString?.() === req.user?.id;
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });
  await item.deleteOne();
  const io = req.app.get("io");
  if (io) io.emit("relief:deleted", { _id: req.params.id });
  res.json({ success: true });
});

