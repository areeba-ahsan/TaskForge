const { validationResult } = require('express-validator');

// Ye middleware upar wale validators ke baad chalta hai
// Check karta hai ke koi validation error aayi ya nahi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next(); // sab sahi hai toh aage badho controller tak
};

module.exports = validate;