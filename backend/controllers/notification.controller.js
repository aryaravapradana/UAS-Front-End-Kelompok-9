const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new notification (Admin only)
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Notification message is required.' });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        message,
      },
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Fetch all notifications, ordered by creation date (newest first)
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: parseInt(limit),
    });

    // For each notification, determine if the current user has read it
    const notificationsWithReadStatus = notifications.map(notification => ({
      ...notification,
      isRead: notification.readBy.includes(req.member.id), // req.member.id should be available from auth middleware
    }));

    const totalNotifications = await prisma.notification.count();

    res.status(200).json({
      notifications: notificationsWithReadStatus,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalNotifications / parseInt(limit)),
      totalNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Mark a notification as read for the logged-in user
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const memberId = req.member.id; // Assuming req.member.id is available from auth middleware

  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Add memberId to readBy array if not already present
    if (!notification.readBy.includes(memberId)) {
      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: {
          readBy: {
            push: memberId,
          },
        },
      });
      res.status(200).json({ message: 'Notification marked as read.', notification: updatedNotification });
    } else {
      res.status(200).json({ message: 'Notification already marked as read by this user.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// @desc    Delete a notification (Admin only)
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

