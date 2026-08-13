const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3 }).withMessage('Task title must be at least 3 characters'),

  body('description')
    .optional()
    .trim(),

  body('projectId')
    .notEmpty().withMessage('Project ID is required')
    .isUUID().withMessage('Invalid project ID'),

  body('assignedTo')
    .optional()
    .isUUID().withMessage('Invalid assigned user ID'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

  body('dueDate')
    .optional()
    .isDate().withMessage('Due date must be a valid date'),
];

const updateTaskValidator = [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Task title must be at least 3 characters'),
  body('assignedTo').optional().isUUID().withMessage('Invalid assigned user ID'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),
  body('dueDate').optional().isDate().withMessage('Due date must be a valid date'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['todo', 'in_progress', 'review', 'completed']).withMessage('Invalid status value'),
];

module.exports = { createTaskValidator, updateTaskValidator, updateStatusValidator };