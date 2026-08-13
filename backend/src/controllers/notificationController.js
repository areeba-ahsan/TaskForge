const { Notification } = require('../models/index');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Any logged-in user
const getMyNotifications = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query;

  const where = { userId: req.user.id };
  if (isRead !== undefined) {
    where.isRead = isRead === 'true';
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Notification.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']], // naya notification sabse upar
  });

  // Unread count bhi bhej dete hain — bell icon ke badge ke liye kaam aayega
  const unreadCount = await Notification.count({
    where: { userId: req.user.id, isRead: false },
  });

  res.status(200).json({
    success: true,
    data: rows,
    unreadCount,
    pagination: {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    },
  });
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Owner only
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.userId !== req.user.id) {
    res.status(403);
    throw new Error('You do not have access to this notification');
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Mark ALL of the user's notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Any logged-in user
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.update(
    { isRead: true },
    { where: { userId: req.user.id, isRead: false } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Owner only
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.userId !== req.user.id) {
    res.status(403);
    throw new Error('You do not have access to this notification');
  }

  await notification.destroy();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };