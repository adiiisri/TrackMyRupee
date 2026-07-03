import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const googleCallback = async (req, res, next) => {
  try {
    if (req.user) {
      const token = generateToken(req.user._id);
      // Redirect to frontend with token in URL 
      res.redirect(`${process.env.FRONTEND_URL || 'https://track-my-rupee.vercel.app'}/login?token=${token}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL || 'https://track-my-rupee.vercel.app'}/login?error=auth_failed`);
    }
  } catch (error) {
    console.error("Google Callback Error:", error);
    res.redirect(`${process.env.FRONTEND_URL || 'https://track-my-rupee.vercel.app'}/login?error=server_error`);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      profession: user.profession,
      gender: user.gender,
      phone: user.phone,
      avatar: user.avatar,
      currency: user.currency,
      bio: user.bio,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.name) user.name = req.body.name;
    if (req.body.age !== undefined) user.age = req.body.age === '' ? null : Number(req.body.age);
    if (req.body.profession !== undefined) user.profession = req.body.profession;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.currency !== undefined) user.currency = req.body.currency;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      profession: updatedUser.profession,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      currency: updatedUser.currency,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

