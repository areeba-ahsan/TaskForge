const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false, // kisko notification milegi
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM(
      'task_assigned',
      'task_status_updated',
      'discussion_added',
      'deadline_approaching',
      'project_assigned',
      'member_added'
    ),
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Related record ka reference — e.g. kis task ya project ki notification hai
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  relatedType: {
    type: DataTypes.ENUM('task', 'project', 'discussion'),
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;