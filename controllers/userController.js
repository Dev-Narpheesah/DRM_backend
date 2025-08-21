const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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

// Authentication Middleware
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ id: user._id, email: user.email, isAdmin: user.isAdmin });
});


const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out' });
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { email, phone, password, disasterType, location, report } = req.body;

  if (!email || !phone || !password || !disasterType || !location || !report || !req.file) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let imageUrl = {};
  if (req.file) {
    try {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Image upload failed', error: error.message });
    }
  }

  const user = new User({
    email,
    phone,
    password,
    disasterType,
    location,
    report,
    image: imageUrl,
    hasSubmittedReport: true,
    isAdmin: false,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

// Get All Users (Reports)
const getAllUsers = asyncHandler(async (req, res) => {
  const { email } = req.query;
  const query = email ? { email, hasSubmittedReport: true } : {};
  const users = await User.find(query).sort('-createdAt');

  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'No users found' });
  }
  res.status(200).json(users);
});


const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});

// Get User Report
const getUserReport = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userReport = {
    disasterType: user.disasterType,
    location: user.location,
    report: user.report,
    image: user.image,
  };

  res.status(200).json(userReport);
});



// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
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
        .json({ message: 'Image upload failed', error: error.message });
    }
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.deleteOne();
  res.status(200).json({ message: 'User deleted successfully!' });
});

// Get Comments for a Report
const getComments = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    console.error(`Invalid report ID: ${reportId}`);
    res.status(400);
    throw new Error('Invalid report ID');
  }

  try {
    const comments = await Comment.find({ reportId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(comments);
  } catch (error) {
    console.error(`Error fetching comments for reportId ${reportId}:`, error);
    throw error;
  }
});

// Post a New Comment
const postComment = asyncHandler(async (req, res) => {
  const { reportId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    console.error(`Invalid report ID: ${reportId}`);
    res.status(400);
    throw new Error('Invalid report ID');
  }

  if (!text?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const report = await User.findById(reportId);
  if (!report) {
    console.error(`Report not found for reportId: ${reportId}`);
    res.status(404);
    throw new Error('Report not found');
  }

  const comment = new Comment({
    reportId,
    text: text.trim(),
    author: req.user.name || 'Anonymous',
  });

  const savedComment = await comment.save();
  res.status(201).json(savedComment);
});

module.exports = {
  getCurrentUser,
  // loginUser,
  // adminLogin,
  logoutUser,
  registerUser,
  getAllUsers,
  getUser,
  getUserReport,
  updateUserProfile,
  deleteUser,
  getComments,
  postComment,
  authenticate,
};