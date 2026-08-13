const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskDiscussion = sequelize.define('TaskDiscussion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false, // comment kisne likha
    references: {
      model: 'users',
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Message cannot be empty' },
    },
  },
}, {
  tableName: 'task_discussions',
  timestamps: true, // createdAt se pata chalega comment kab hua
});

module.exports = TaskDiscussion;