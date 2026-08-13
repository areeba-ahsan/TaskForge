const { body } = require('express-validator');

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 3 }).withMessage('Project name must be at least 3 characters'),

  body('description')
    .optional()
    .trim(),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isDate().withMessage('Start date must be a valid date'),

  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isDate().withMessage('End date must be a valid date'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

  body('projectManagerId')
    .optional()
    .isUUID().withMessage('Invalid project manager ID'),
];

const updateProjectValidator = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Project name must be at least 3 characters'),
  body('startDate').optional().isDate().withMessage('Start date must be a valid date'),
  body('endDate').optional().isDate().withMessage('End date must be a valid date'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),
  body('status').optional().isIn(['not_started', 'in_progress', 'on_hold', 'completed', 'cancelled']).withMessage('Invalid status value'),
  body('projectManagerId').optional().isUUID().withMessage('Invalid project manager ID'),
];

const addMemberValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isUUID().withMessage('Invalid user ID'),
];

module.exports = { createProjectValidator, updateProjectValidator, addMemberValidator };