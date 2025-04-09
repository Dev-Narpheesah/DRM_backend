const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const errorHandler = require('../utils/error');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(errorHandler(550, "Already Registered"));
  }
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, "User not found"));

    const isValidPassword = await bcrypt.compare(password, validUser.password);
    if (!isValidPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = generateToken(validUser._id);

    res.status(200).json({
      user: {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

const signOut = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
});

module.exports = { signup, signin, signOut };





