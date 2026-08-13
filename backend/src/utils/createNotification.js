const { Notification } = require('../models/index');

/**
 * Notification banane ka helper function
 * @param {Object} params
 * @param {string} params.userId - kisko notification milegi
 * @param {string} params.type - notification type (ENUM se)
 * @param {string} params.message - dikhne wala text
 * @param {string} [params.relatedId] - related task/project ki id
 * @param {string} [params.relatedType] - 'task' | 'project' | 'discussion'
 */
const createNotification = async ({ userId, type, message, relatedId = null, relatedType = null }) => {
  try {
    await Notification.create({ userId, type, message, relatedId, relatedType });
  } catch (error) {
    // Notification fail hone se main operation (jaise task creation) fail nahi honi chahiye
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = createNotification;