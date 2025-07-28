const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Email already registered', 400);
  }

  // Validate role input
  const validRoles = ['member', 'admin'];
  const assignedRole = validRoles.includes(role) ? role : 'member';

  // Hash password with configurable rounds
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    role: assignedRole,
  });

  logger.info('User registered successfully', { 
    userId: user._id, 
    email: user.email, 
    role: user.role 
  });

  res.status(201).json({ 
    success: true,
    message: 'User registered successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    logger.error('Login failed: user not found', { email });
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (user.status !== 'active') {
    logger.error('Login failed: user not active', { email, status: user.status });
    throw new AppError('Account is deactivated', 401);
  }

  // Compare password hashes
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    logger.error('Login failed: password mismatch', { email });
    throw new AppError('Invalid credentials', 401);
  }

  // Create JWT token
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const token = jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  logger.info('User logged in successfully', { 
    userId: user._id, 
    email: user.email 
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        membershipStatus: user.membershipStatus
      }
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the logout event
  logger.info('User logged out', { 
    userId: req.user?.id 
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

module.exports = { 
  register, 
  login, 
  logout, 
  getProfile 
};


