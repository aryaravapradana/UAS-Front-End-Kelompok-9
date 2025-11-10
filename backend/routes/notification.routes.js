const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification, // Import deleteNotification
} = require('../controllers/notification.controller.js');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');

// Admin-only route to create notifications
router.route('/')
  .post(auth, admin, createNotification) // Admin can create notifications
  .get(auth, getNotifications); // Users can get their notifications

// User route to mark a notification as read
router.route('/:id/read')
  .put(auth, markNotificationAsRead);

// Admin-only route to delete a notification
router.route('/:id')
  .delete(auth, admin, deleteNotification);

module.exports = router;
