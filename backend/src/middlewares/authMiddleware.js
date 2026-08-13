const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token "Authorization: Bearer <token>" header mein aata hai
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  // Token verify karo (JWT_SECRET se decode hoga)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Us user ko database se nikaalo (password chhod ke)
  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated. Contact admin.');
  }

  // Ab is user ki info aage tamam controllers ko available hai req.user ke through
  req.user = user;
  next();
});

module.exports = { protect };