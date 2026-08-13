const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Project name is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATEONLY, // sirf date, time nahi (2026-08-13)
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isAfterStartDate(value) {
        if (this.startDate && value < this.startDate) {
          throw new Error('End date must be after start date');
        }
      },
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'on_hold', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'not_started',
  },
  // Kis Project Manager ko assign kiya gaya hai — foreign key
  projectManagerId: {
    type: DataTypes.UUID,
    allowNull: true, // shuru mein admin PM assign na kare toh bhi project ban sake
    references: {
      model: 'users',
      key: 'id',
    },
  },
  // Kis Admin ne project banaya
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

module.exports = Project;