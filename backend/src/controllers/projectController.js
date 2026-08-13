const { Project, User, Task, ProjectMember } = require('../models/index');
const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Admin only
const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate, priority, projectManagerId } = req.body;

  // Agar PM assign kiya ja raha hai, check karo wo actually PM role ka hai
  if (projectManagerId) {
    const pm = await User.findByPk(projectManagerId);
    if (!pm || pm.role !== 'project_manager') {
      res.status(400);
      throw new Error('Assigned user must be a valid Project Manager');
    }
  }

  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    priority,
    projectManagerId: projectManagerId || null,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project,
  });
});

// @desc    Get all projects (role-based visibility + search/filter/sort)
// @route   GET /api/projects
// @access  All logged-in users (but filtered by role)
const getAllProjects = asyncHandler(async (req, res) => {
  const { search, status, priority, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;

  const where = {};

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;

  // Role-based visibility:
  // Admin -> sab projects dekh sakta hai
  // PM -> sirf apne assigned projects
  // Team Member -> sirf wo projects jinme wo member hai
  let include = [
    { model: User, as: 'projectManager', attributes: ['id', 'name', 'email'] },
    { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
  ];

  if (req.user.role === 'project_manager') {
    where.projectManagerId = req.user.id;
  } else if (req.user.role === 'team_member') {
    // Team member sirf un projects ko dekhega jahan wo member hai
    const memberships = await ProjectMember.findAll({ where: { userId: req.user.id } });
    const projectIds = memberships.map((m) => m.projectId);
    where.id = { [Op.in]: projectIds.length ? projectIds : [null] };
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Project.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order]],
    distinct: true, // count sahi aaye isliye (join ki wajah se duplicate ho sakta hai)
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

// @desc    Get single project with full details
// @route   GET /api/projects/:id
// @access  Admin, assigned PM, or assigned team members
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: [
      { model: User, as: 'projectManager', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      { model: Task, as: 'tasks' },
    ],
  });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Access check: PM sirf apna project dekh sake, Team Member sirf jisme member ho
  if (req.user.role === 'project_manager' && project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You do not have access to this project');
  }

  if (req.user.role === 'team_member') {
    const isMember = await ProjectMember.findOne({
      where: { projectId: project.id, userId: req.user.id },
    });
    if (!isMember) {
      res.status(403);
      throw new Error('You do not have access to this project');
    }
  }

  res.status(200).json({ success: true, data: project });
});

// @desc    Update project info
// @route   PUT /api/projects/:id
// @access  Admin only
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { name, description, startDate, endDate, priority, status, projectManagerId } = req.body;

  if (projectManagerId) {
    const pm = await User.findByPk(projectManagerId);
    if (!pm || pm.role !== 'project_manager') {
      res.status(400);
      throw new Error('Assigned user must be a valid Project Manager');
    }
  }

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (startDate !== undefined) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;
  if (priority !== undefined) project.priority = priority;
  if (status !== undefined) project.status = status;
  if (projectManagerId !== undefined) project.projectManagerId = projectManagerId;

  await project.save();

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project,
  });
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Admin only
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.destroy();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
});

// @desc    Add a team member to a project
// @route   POST /api/projects/:id/members
// @access  Admin or assigned PM
const addTeamMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findByPk(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // PM sirf apne project mein member add kar sake
  if (req.user.role === 'project_manager' && project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You can only manage your own projects');
  }

  const user = await User.findByPk(userId);
  if (!user || user.role !== 'team_member') {
    res.status(400);
    throw new Error('User must be a valid Team Member');
  }

  const existing = await ProjectMember.findOne({
    where: { projectId: project.id, userId },
  });
  if (existing) {
    res.status(400);
    throw new Error('User is already a member of this project');
  }

  await ProjectMember.create({ projectId: project.id, userId });

  res.status(201).json({
    success: true,
    message: 'Team member added successfully',
  });
});

// @desc    Remove a team member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Admin or assigned PM
const removeTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (req.user.role === 'project_manager' && project.projectManagerId !== req.user.id) {
    res.status(403);
    throw new Error('You can only manage your own projects');
  }

  const membership = await ProjectMember.findOne({
    where: { projectId: project.id, userId: req.params.userId },
  });

  if (!membership) {
    res.status(404);
    throw new Error('This user is not a member of the project');
  }

  await membership.destroy();

  res.status(200).json({
    success: true,
    message: 'Team member removed successfully',
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
};
