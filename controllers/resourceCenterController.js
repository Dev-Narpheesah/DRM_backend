const asyncHandler = require("express-async-handler");
const ResourceCenter = require("../models/ResourceCenterModel");

// Public list and get
exports.listCenters = asyncHandler(async (_req, res) => {
  const items = await ResourceCenter.find().sort({ createdAt: -1 });
  res.json(items);
});

exports.getCenter = asyncHandler(async (req, res) => {
  const item = await ResourceCenter.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Admin create/update/delete
exports.createCenter = asyncHandler(async (req, res) => {
  const doc = await ResourceCenter.create(req.body || {});
  res.status(201).json(doc);
});

exports.updateCenter = asyncHandler(async (req, res) => {
  const updated = await ResourceCenter.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

exports.deleteCenter = asyncHandler(async (req, res) => {
  const deleted = await ResourceCenter.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

