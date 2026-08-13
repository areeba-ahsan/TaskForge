// Usage: authorize('admin') ya authorize('admin', 'project_manager') — jitne roles allow karne hain
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, please login first');
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access denied. This action requires one of these roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

module.exports = { authorize };