const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
} = require('../validators/taskValidator');

const discussionRoutes = require('./discussionRoutes');

router.use(protect);

router.post('/', authorize('admin', 'project_manager'), createTaskValidator, validate, createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', authorize('admin', 'project_manager'), updateTaskValidator, validate, updateTask);
router.patch('/:id/status', updateStatusValidator, validate, updateTaskStatus);
router.delete('/:id', authorize('admin', 'project_manager'), deleteTask);

router.use('/:taskId/discussions', discussionRoutes);

module.exports = router;