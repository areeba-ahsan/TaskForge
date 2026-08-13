const bcrypt = require('bcryptjs');
const { User } = require('../models/index');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check karo ke email pehle se toh nahi hai
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Password ko hash karo (plain text kabhi save nahi karte)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // User create karo
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'team_member', // agar role nahi diya, default team_member
  });

  // Token generate karo taake user turant login state mein ho
  const token = generateToken(user.id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // User dhoondo email se
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check karo user active hai ya admin ne deactivate kar diya
  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated. Contact admin.');
  }

  // Password match karo (hashed wale se compare)
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

// @desc    Get currently logged-in user's info
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  // req.user hum authMiddleware se set karenge (agla step)
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }, // password kabhi response mein na jaye
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, getMe };