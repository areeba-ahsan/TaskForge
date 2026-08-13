const bcrypt = require('bcryptjs');
const { User, Project, Task } = require('../models/index');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Admin creates a new user (PM or Team Member)
// @route   POST /api/users
// @access  Admin only
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'team_member',
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// @desc    Get all users (with search, filter, pagination)
// @route   GET /api/users
// @access  Admin only
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, isActive, page = 1, limit = 10 } = req.query;
  const { Op } = require('sequelize');

  const where = {};

  // Search by name or email
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Filter by role
  if (role) {
    where.role = role;
  }

  // Filter by active status
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    },
  });
});

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Admin only
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Update a user's info (name, email, role)
// @route   PUT /api/users/:id
// @access  Admin only
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// @desc    Activate/Deactivate a user
// @route   PATCH /api/users/:id/status
// @access  Admin only
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Admin apne aap ko deactivate na kar sake (safety check)
  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { id: user.id, isActive: user.isActive },
  });
});

// @desc    Delete a user permanently
// @route   DELETE /api/users/:id
// @access  Admin only
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
};