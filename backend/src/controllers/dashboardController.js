const { Project, Task, User, ProjectMember } = require('../models/index');
const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard stats based on logged-in user's role
// @route   GET /api/dashboard/stats
// @access  Any logged-in user
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  // Aane wale 7 din ke andar deadline wale tasks/projects "upcoming" mane jayenge
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  if (role === 'admin') {
    const [totalProjects, activeProjects, completedProjects, totalTasks, pendingTasks, completedTasks, totalUsers, upcomingDeadlines] =
      await Promise.all([
        Project.count(),
        Project.count({ where: { status: 'in_progress' } }),
        Project.count({ where: { status: 'completed' } }),
        Task.count(),
        Task.count({ where: { status: { [Op.ne]: 'completed' } } }),
        Task.count({ where: { status: 'completed' } }),
        User.count(),
        Project.count({ where: { endDate: { [Op.between]: [today, nextWeek] } } }),
      ]);

    return res.status(200).json({
      success: true,
      role: 'admin',
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        pendingTasks,
        completedTasks,
        totalUsers,
        upcomingDeadlines,
      },
    });
  }

  if (role === 'project_manager') {
    const myProjects = await Project.findAll({ where: { projectManagerId: userId } });
    const projectIds = myProjects.map((p) => p.id);

    const [activeProjects, completedProjects, totalTasks, pendingTasks, completedTasks, upcomingDeadlines] =
      await Promise.all([
        Project.count({ where: { projectManagerId: userId, status: 'in_progress' } }),
        Project.count({ where: { projectManagerId: userId, status: 'completed' } }),
        Task.count({ where: { projectId: { [Op.in]: projectIds.length ? projectIds : [null] } } }),
        Task.count({ where: { projectId: { [Op.in]: projectIds.length ? projectIds : [null] }, status: { [Op.ne]: 'completed' } } }),
        Task.count({ where: { projectId: { [Op.in]: projectIds.length ? projectIds : [null] }, status: 'completed' } }),
        Task.count({
          where: {
            projectId: { [Op.in]: projectIds.length ? projectIds : [null] },
            dueDate: { [Op.between]: [today, nextWeek] },
            status: { [Op.ne]: 'completed' },
          },
        }),
      ]);

    return res.status(200).json({
      success: true,
      role: 'project_manager',
      data: {
        assignedProjects: myProjects.length,
        activeProjects,
        completedProjects,
        totalTasks,
        pendingTasks,
        completedTasks,
        upcomingDeadlines,
      },
    });
  }

  // team_member
  const [assignedProjectsCount, totalTasks, todoTasks, inProgressTasks, reviewTasks, completedTasks, upcomingDeadlines] =
    await Promise.all([
      ProjectMember.count({ where: { userId } }),
      Task.count({ where: { assignedTo: userId } }),
      Task.count({ where: { assignedTo: userId, status: 'todo' } }),
      Task.count({ where: { assignedTo: userId, status: 'in_progress' } }),
      Task.count({ where: { assignedTo: userId, status: 'review' } }),
      Task.count({ where: { assignedTo: userId, status: 'completed' } }),
      Task.count({
        where: {
          assignedTo: userId,
          dueDate: { [Op.between]: [today, nextWeek] },
          status: { [Op.ne]: 'completed' },
        },
      }),
    ]);

  res.status(200).json({
    success: true,
    role: 'team_member',
    data: {
      assignedProjects: assignedProjectsCount,
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      upcomingDeadlines,
    },
  });
});

module.exports = { getDashboardStats };