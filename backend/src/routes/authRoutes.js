const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/auth/register
router.post('/register', registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, login);

// GET /api/auth/me  (protected — token chahiye)
router.get('/me', protect, getMe);

module.exports = router;