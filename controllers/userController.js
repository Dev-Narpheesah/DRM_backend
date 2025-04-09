const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve({ url: result.secure_url, public_id: result.public_id });
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


const registerUser = asyncHandler(async (req, res) => {
  const { email, phone, disasterType, location, report } = req.body;

 
  if (!email || !phone || !disasterType || !location || !report || !req.file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let imageUrl = "";
  if (req.file) {
    try {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: error.message });
    }
  }

 
  const user = new User({
    email,
    phone,
    disasterType,
    location,
    report,
    image: imageUrl,
    hasSubmittedReport: true, 
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});


const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt");

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

const getUserReport = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userReport = {
    disasterType: user.disasterType,
    location: user.location,
    report: user.report,
    image: user.image,
  };

  res.status(200).json(userReport); 
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.disasterType = req.body.disasterType || user.disasterType;
  user.location = req.body.location || user.location;
  user.report = req.body.report || user.report;

  if (req.file) {
    try {
      user.image = await uploadImageToCloudinary(req.file.buffer);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: error.message });
    }
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully!" });
});

module.exports = {
  registerUser,
  getAllUsers,
  getUser,
  getUserReport,
  updateUserProfile,
  deleteUser,
};
