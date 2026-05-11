import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { logActivity } from '../utils/logger.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    await logActivity({
      user: user.name,
      action: 'LOGIN',
      module: 'Authentication',
      description: `User ${user.name} logged in`,
      ip: req.ip
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  console.log('📝 Registration attempt:', req.body);
  const { name, email, password, whatsappNumber } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Missing required fields: name, email, and password are required' });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: `Registration failed: User with email ${email} already exists` });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    whatsappNumber,
  });

  if (user) {
    await logActivity({
      user: user.name,
      action: 'CREATE',
      module: 'Authentication',
      description: `New user account created: ${user.name} (${user.email})`
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsappNumber: user.whatsappNumber,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Verify email exists
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.json({ message: 'Email verified' });
  } else {
    res.status(404).json({ message: 'No account found with this email' });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    user.password = password;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Logout user & clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
  const { name } = req.body;
  
  await logActivity({
    user: name || 'Admin',
    action: 'LOGOUT',
    module: 'Authentication',
    description: `User ${name || 'Admin'} logged out`,
    ip: req.ip
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export { authUser, registerUser, getUserProfile, verifyEmail, resetPassword, logoutUser };
