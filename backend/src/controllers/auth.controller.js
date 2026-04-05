// controllers/auth.controller.js

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (!username || !fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check existing user
  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password
  });

  const createdUser = await User.findById(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = await user.generateAccessToken();
  res.cookie('neurafetch_token', token)
  const loggedInUser = await User.findById(user._id).select('-_id -username -createdAt -updatedAt -__v');
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: loggedInUser, token }, "Login successful")
    );
});


export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const get_me = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "fetched successfully"));
});


export const ChangePasssword = asyncHandler(async (req, res) => {
  const userid = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const existuser = await User.findById(userid).select('+password');
  if (!existuser) {
    throw new ApiError(400, "User not found");
  }
  const isPasswordValid = await existuser.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  existuser.password = newPassword;
  await existuser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});


export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("neurafetch_token", {
      httpOnly: true,
      secure: false
    })
    .json(new ApiResponse(200, null, "Logout successful"));
});