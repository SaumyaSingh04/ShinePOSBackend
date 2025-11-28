const CommissionLog = require('../../models/salesModel/CommissionLog');

// Create CommissionLog
exports.createCommissionLog = async (req, res) => {
  try {
    const commissionLog = new CommissionLog(req.body);
    await commissionLog.save();
    res.status(201).json(commissionLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all CommissionLogs
exports.getAllCommissionLogs = async (req, res) => {
  try {
    const commissionLogs = await CommissionLog.find().populate('salesPersonId restaurantId');
    res.json(commissionLogs);
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
    const commissionLog = await CommissionLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
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