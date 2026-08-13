const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // kab member add hua project mein
  },
}, {
  tableName: 'project_members',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'userId'], // same user ek project mein sirf ek hi baar add ho sake
    },
  ],
});

module.exports = ProjectMember;