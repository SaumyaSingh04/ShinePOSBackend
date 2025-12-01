const CommissionLog = require('../../models/salesModel/CommissionLog');
const SalesPerson = require('../../models/salesModel/SalesPerson');
const RestaurantRegistration = require('../../models/salesModel/RestaurantRegistration');

// Create CommissionLog
exports.createCommissionLog = async (req, res) => {
  try {
    const { salesPersonId, restaurantId, commissionAmount, status } = req.body;
    if (!salesPersonId || !restaurantId || !commissionAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const commissionLog = new CommissionLog({ salesPersonId, restaurantId, commissionAmount, status: status || 'pending' });
    await commissionLog.save();
    res.status(201).json(commissionLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all CommissionLogs
exports.getAllCommissionLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const commissionLogs = await CommissionLog.find()
      .populate('salesPersonId', 'name')
      .populate('restaurantId', 'restaurantName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await CommissionLog.countDocuments();
    res.json({ commissionLogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get CommissionLog by ID
exports.getCommissionLogById = async (req, res) => {
  try {
    const commissionLog = await CommissionLog.findById(req.params.id).populate('salesPersonId restaurantId');
    if (!commissionLog) return res.status(404).json({ error: 'Commission log not found' });
    res.json(commissionLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update CommissionLog
exports.updateCommissionLog = async (req, res) => {
  try {
    const allowedUpdates = ['commissionAmount', 'status'];
    const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
    const updateData = {};
    updates.forEach(key => updateData[key] = req.body[key]);
    
    const commissionLog = await CommissionLog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!commissionLog) return res.status(404).json({ error: 'Commission log not found' });
    res.json(commissionLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete CommissionLog
exports.deleteCommissionLog = async (req, res) => {
  try {
    const commissionLog = await CommissionLog.findByIdAndDelete(req.params.id);
    if (!commissionLog) return res.status(404).json({ error: 'Commission log not found' });
    res.json({ message: 'Commission log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get commissions for specific sales person
exports.getSalesPersonCommissions = async (req, res) => {
  try {
    const { salesPersonId } = req.params;
    const commissions = await CommissionLog.find({ salesPersonId })
      .populate('restaurantId', 'restaurantName')
      .sort({ createdAt: -1 });
    
    const [paidResult, pendingResult] = await Promise.all([
      CommissionLog.aggregate([{ $match: { salesPersonId, status: 'paid' } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]),
      CommissionLog.aggregate([{ $match: { salesPersonId, status: 'pending' } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }])
    ]);
    
    const totalEarned = paidResult[0]?.total || 0;
    const totalPending = pendingResult[0]?.total || 0;

    res.json({
      commissions,
      summary: {
        totalEarned,
        totalPending,
        totalCommissions: commissions.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark commission as paid
exports.markCommissionPaid = async (req, res) => {
  try {
    const existing = await CommissionLog.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Commission log not found' });
    }
    if (existing.status === 'paid') {
      return res.status(400).json({ error: 'Commission already paid' });
    }
    
    const commissionLog = await CommissionLog.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidAt: new Date() },
      { new: true }
    ).populate('salesPersonId restaurantId');

    res.json({ message: 'Commission marked as paid', commissionLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.subscribeRestaurant = async (req, res) => {
  try {
    const { restaurantId, planAmount } = req.body;

    const restaurant = await RestaurantRegistration.findById(restaurantId).populate('salesPersonId');
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    restaurant.status = 'subscribed';
    restaurant.subscriptionDate = new Date();
    await restaurant.save();

    const currentDate = new Date();
    const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const commissionRate = restaurant.salesPersonId.commissionRate;
    const commissionAmount = (planAmount * commissionRate) / 100;

    const commissionLog = new CommissionLog({
      salesPersonId: restaurant.salesPersonId._id,
      restaurantId: restaurant._id,
      month,
      subscriptionAmount: planAmount,
      commissionRate,
      commissionAmount,
      status: 'pending'
    });

    await commissionLog.save();
    res.json({ restaurant, commission: { amount: commissionAmount, rate: commissionRate, month } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};