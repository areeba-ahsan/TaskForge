const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // hashed password store hoga, plain text kabhi nahi
  },
  role: {
    type: DataTypes.ENUM('admin', 'project_manager', 'team_member'),
    allowNull: false,
    defaultValue: 'team_member',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // admin kisi user ko deactivate bhi kar sakta hai
  },
}, {
  tableName: 'users',
  timestamps: true, // createdAt, updatedAt automatically add ho jayenge
});

module.exports = User;