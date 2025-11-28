const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/restaurant/notificationController');

// Send order ready notification
router.post('/order-ready', notificationController.sendOrderReadyNotification);

// Get my notifications
router.get('/my-notifications', notificationController.getMyNotifications);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
