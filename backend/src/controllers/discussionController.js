const { TaskDiscussion, Task, Project, User } = require('../models/index');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

// Helper: check karo ke user is task ki discussion access kar sakta hai ya nahi
const checkTaskAccess = async (task, user) => {
  if (user.role === 'admin') return true;
  if (user.role === 'project_manager') return task.project.projectManagerId === user.id;
  if (user.role === 'team_member') return task.assignedTo === user.id;
  return false;
};

// @desc    Add a message to task discussion
// @route   POST /api/tasks/:taskId/discussions
// @access  Admin, project's PM, or assigned team member
const addDiscussionMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { taskId } = req.params;

  const task = await Task.findByPk(taskId, {
    include: [{ model: Project, as: 'project' }],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const hasAccess = await checkTaskAccess(task, req.user);
  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have access to this task discussion');
  }

  const discussion = await TaskDiscussion.create({
    taskId,
    userId: req.user.id,
    message,
  });

  const fullDiscussion = await TaskDiscussion.findByPk(discussion.id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'role'] }],
  });

  // Notify: assignee aur PM ko batao (jo bhi message likhne wale se different ho)
  const notifyUserIds = new Set();
  if (task.assignedTo && task.assignedTo !== req.user.id) {
    notifyUserIds.add(task.assignedTo);
  }
  if (task.project.projectManagerId && task.project.projectManagerId !== req.user.id) {
    notifyUserIds.add(task.project.projectManagerId);
  }

  for (const uid of notifyUserIds) {
    await createNotification({
      userId: uid,
      type: 'discussion_added',
      message: `New comment on task "${task.title}"`,
      relatedId: task.id,
      relatedType: 'task',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Message added successfully',
    data: fullDiscussion,
  });
});

// @desc    Get all discussion messages for a task
// @route   GET /api/tasks/:taskId/discussions
// @access  Admin, project's PM, or assigned team member
const getTaskDiscussions = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByPk(taskId, {
    include: [{ model: Project, as: 'project' }],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const hasAccess = await checkTaskAccess(task, req.user);
  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have access to this task discussion');
  }

  const discussions = await TaskDiscussion.findAll({
    where: { taskId },
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'role'] }],
    order: [['createdAt', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: discussions,
  });
});

module.exports = { addDiscussionMessage, getTaskDiscussions };