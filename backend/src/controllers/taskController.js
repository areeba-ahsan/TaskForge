const { Task, Project, User, ProjectMember } = require('../models/index');
const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

// @desc    Create a new task in a project
// @route   POST /api/tasks
// @access  Admin or assigned PM
const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // PM sirf apne assigned project mein task bana sake
  if (req.user.role === 'project_manager' && project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You can only create tasks in your own projects');
  }

  // Agar assign kiya ja raha hai, check karo wo user us project ka member hai
  if (assignedTo) {
    const member = await ProjectMember.findOne({
      where: { projectId, userId: assignedTo },
    });
    if (!member) {
      res.status(400);
      throw new Error('Assigned user must be a member of this project');
    }
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: assignedTo || null,
    assignedBy: req.user.id,
    priority,
    dueDate,
  });

  // Agar task kisi ko assign hua, usko notify karo
  if (assignedTo) {
    await createNotification({
      userId: assignedTo,
      type: 'task_assigned',
      message: `You have been assigned a new task: "${task.title}"`,
      relatedId: task.id,
      relatedType: 'task',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

// @desc    Get all tasks (role-based visibility + search/filter/sort)
// @route   GET /api/tasks
// @access  All logged-in users
const getAllTasks = asyncHandler(async (req, res) => {
  const {
    search, status, priority, projectId,
    sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10,
  } = req.query;

  const where = {};

  if (search) where.title = { [Op.iLike]: `%${search}%` };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (projectId) where.projectId = projectId;

  // Role-based visibility:
  // Admin -> sab tasks
  // PM -> sirf apne projects ke tasks
  // Team Member -> sirf khud ko assigned tasks
  if (req.user.role === 'project_manager') {
    const myProjects = await Project.findAll({ where: { projectManagerId: req.user.id } });
    const projectIds = myProjects.map((p) => p.id);
    where.projectId = projectId ? projectId : { [Op.in]: projectIds.length ? projectIds : [null] };
  } else if (req.user.role === 'team_member') {
    where.assignedTo = req.user.id;
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'name'] },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order]],
  });

  res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    },
  });
});

// @desc    Get single task with full details
// @route   GET /api/tasks/:id
// @access  Admin, project's PM, or assigned team member
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'name', 'projectManagerId'] },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'assigner', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Access check
  if (req.user.role === 'project_manager' && task.project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You do not have access to this task');
  }
  if (req.user.role === 'team_member' && task.assignedTo !== req.user.id) {
    res.status(403);
    throw new Error('You do not have access to this task');
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Update task details (title, description, assignedTo, priority, dueDate)
// @route   PUT /api/tasks/:id
// @access  Admin or project's PM
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [{ model: Project, as: 'project' }],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'project_manager' && task.project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You can only update tasks in your own projects');
  }

  const { title, description, assignedTo, priority, dueDate } = req.body;

  if (assignedTo) {
    const member = await ProjectMember.findOne({
      where: { projectId: task.projectId, userId: assignedTo },
    });
    if (!member) {
      res.status(400);
      throw new Error('Assigned user must be a member of this project');
    }
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  // Agar assignedTo change hua, naye assignee ko notify karo
  if (assignedTo) {
    await createNotification({
      userId: assignedTo,
      type: 'task_assigned',
      message: `You have been assigned to task: "${task.title}"`,
      relatedId: task.id,
      relatedType: 'task',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

// @desc    Update ONLY task status (used by team members to move task through stages)
// @route   PATCH /api/tasks/:id/status
// @access  Admin, project's PM, or assigned team member
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByPk(req.params.id, {
    include: [{ model: Project, as: 'project' }],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const isOwner = req.user.role === 'project_manager' && task.project.projectManagerId === req.user.id;
  const isAssignee = req.user.role === 'team_member' && task.assignedTo === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin && !isOwner && !isAssignee) {
    res.status(403);
    throw new Error('You do not have permission to update this task status');
  }

  task.status = status;
  await task.save();

  // Agar PM assigned hai us project ka, usko notify karo (khud PM ne update kiya toh nahi)
  if (task.project.projectManagerId && task.project.projectManagerId !== req.user.id) {
    await createNotification({
      userId: task.project.projectManagerId,
      type: 'task_status_updated',
      message: `Task "${task.title}" status changed to "${status}"`,
      relatedId: task.id,
      relatedType: 'task',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: { id: task.id, status: task.status },
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Admin or project's PM
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [{ model: Project, as: 'project' }],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'project_manager' && task.project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You can only delete tasks in your own projects');
  }

  await task.destroy();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};