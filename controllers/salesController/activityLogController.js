const ActivityLog = require('../../models/salesModel/ActivityLog');

// Create ActivityLog
exports.createActivityLog = async (req, res) => {
  try {
    const activityLog = new ActivityLog(req.body);
    await activityLog.save();
    res.status(201).json(activityLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all ActivityLogs
exports.getAllActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find().populate('salesPersonId');
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get ActivityLog by ID
exports.getActivityLogById = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findById(req.params.id).populate('salesPersonId');
    if (!activityLog) return res.status(404).json({ error: 'Activity log not found' });
    res.json(activityLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update ActivityLog
exports.updateActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activityLog) return res.status(404).json({ error: 'Activity log not found' });
    res.json(activityLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete ActivityLog
exports.deleteActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByIdAndDelete(req.params.id);
    if (!activityLog) return res.status(404).json({ error: 'Activity log not found' });
    res.json({ message: 'Activity log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};