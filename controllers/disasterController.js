const Disaster = require("../models/DisasterModel");
const { disasters } = require("../api/disasters.js");

// Create a new disaster
const createDisaster = async (req, res) => {
  try {
    const { country, date, disasterType, casualties, injured, death } = req.body;

    if (!country || !date || !disasterType || !casualties || !injured || !death) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const disaster = new Disaster({
      country,
      date: new Date(date),
      disasterType,
      casualties,
      injured,
      death,
    });

    await disaster.save();

    res.status(201).json(disaster);
  } catch (error) {
    console.error("Error creating disaster:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all disasters
const getAllDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find().sort({ date: -1 });
    res.status(200).json(disasters);
  } catch (error) {
    console.error("Error fetching disasters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a disaster by ID
const getDisasterById = async (req, res) => {
  try {
    const { id } = req.params;

    const disaster = await Disaster.findById(id);

    if (!disaster) {
      return res.status(404).json({ message: "Disaster not found" });
    }

    res.status(200).json(disaster);
  } catch (error) {
    console.error("Error fetching disaster by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a disaster
const updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { country, date, disasterType, casualties, injured, death } = req.body;

    const updatedDisaster = await Disaster.findByIdAndUpdate(
      id,
      {
        country,
        date: new Date(date),
        disasterType,
        casualties,
        injured,
        death,
      },
      { new: true }
    );

    if (!updatedDisaster) {
      return res.status(404).json({ message: "Disaster not found" });
    }

    res.status(200).json(updatedDisaster);
  } catch (error) {
    console.error("Error updating disaster:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a disaster
const deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDisaster = await Disaster.findByIdAndDelete(id);

    if (!deletedDisaster) {
      return res.status(404).json({ message: "Disaster not found" });
    }

    res.status(200).json({ message: "Disaster deleted successfully" });
  } catch (error) {
    console.error("Error deleting disaster:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createDisaster,
  getAllDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
};