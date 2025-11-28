const Notification = require('../../models/restaurantModels/Notification');
const RestaurantOrder = require('../../models/restaurantModels/RestaurantOrder');

// Send notification when order is ready
exports.sendOrderReadyNotification = async (req, res) => {
  try {
    const { orderId, kotId, tableNo, message } = req.body;

    const [order] = await Promise.all([
      RestaurantOrder.findById(orderId, 'createdBy').lean(),
      Notification.create({
        recipient: req.body.recipient || 'staff',
        message: message || `Order for Table ${tableNo} is ready for serving`,
        type: 'order_ready',
        orderId,
        kotId,
        tableNo
      })
    ]);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for current user
exports.getMyNotifications = async (req, res) => {
  try {
    const recipient = req.user?.id || req.query.recipient || 'staff';
    
    const notifications = await Notification.find({ recipient })
      .select('message type tableNo isRead createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const recipient = req.user?.id || req.body.recipient || 'staff';
    await Notification.updateOne(
      { _id: req.params.id, recipient }, 
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


