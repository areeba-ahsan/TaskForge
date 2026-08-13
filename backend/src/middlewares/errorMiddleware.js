// Route na milne par ye chalega (404 handler)
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // aage errorHandler ko bhej do
};

// Ye main error handler hai — poori app ke errors yahan handle honge
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Something went wrong';

  // Sequelize validation errors ko clean format mein convert karo
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  // Invalid UUID format (jaise koi galat id bhej de URL mein)
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 400;
    message = 'Invalid data format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token, please login again';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please login again';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Development mein error ki puri detail dikhao, production mein chupao (security ke liye)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };