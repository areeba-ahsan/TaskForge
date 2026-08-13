const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');
const TaskDiscussion = require('./TaskDiscussion');
const Notification = require('./Notification');

// ============ USER <-> PROJECT (via projectManagerId) ============
// Ek User (PM) multiple Projects manage kar sakta hai
User.hasMany(Project, { foreignKey: 'projectManagerId', as: 'managedProjects' });
Project.belongsTo(User, { foreignKey: 'projectManagerId', as: 'projectManager' });

// Ek User (Admin) multiple Projects create kar sakta hai
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// ============ PROJECT <-> USER (via ProjectMember - Many-to-Many) ============
// Ek Project ke multiple Team Members ho sakte hain, aur ek User multiple Projects mein ho sakta hai
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'teamMembers',
});
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'assignedProjects',
});

// Direct access bhi rakhte hain join table ka (audit/debug ke liye kaam aata hai)
Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'memberRecords' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(ProjectMember, { foreignKey: 'userId', as: 'membershipRecords' });
ProjectMember.belongsTo(User, { foreignKey: 'userId' });

// ============ PROJECT <-> TASK ============
// Ek Project ke multiple Tasks hote hain
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// ============ USER <-> TASK ============
// Ek User (Team Member) ko multiple Tasks assign ho sakte hain
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// Ek User (PM) multiple Tasks create/assign kar sakta hai
User.hasMany(Task, { foreignKey: 'assignedBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

// ============ TASK <-> TASK DISCUSSION ============
// Ek Task ki multiple Discussion messages ho sakti hain
Task.hasMany(TaskDiscussion, { foreignKey: 'taskId', as: 'discussions' });
TaskDiscussion.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// ============ USER <-> TASK DISCUSSION ============
// Ek User multiple Discussion messages likh sakta hai
User.hasMany(TaskDiscussion, { foreignKey: 'userId', as: 'discussionMessages' });
TaskDiscussion.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// ============ USER <-> NOTIFICATION ============
// Ek User ki multiple Notifications ho sakti hain
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMember,
  Task,
  TaskDiscussion,
  Notification,
};