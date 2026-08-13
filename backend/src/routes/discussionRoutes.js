const express = require('express');
const router = express.Router({ mergeParams: true });

const { addDiscussionMessage, getTaskDiscussions } = require('../controllers/discussionController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { body } = require('express-validator');

const messageValidator = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message cannot be empty'),
];

router.use(protect);

router.post('/', messageValidator, validate, addDiscussionMessage);
router.get('/', getTaskDiscussions);

module.exports = router;