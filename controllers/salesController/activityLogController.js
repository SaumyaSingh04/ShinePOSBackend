const ActivityLog = require('../../models/salesModel/ActivityLog');
const SalesPerson = require('../../models/salesModel/SalesPerson');
const locationTracker = require('../../services/locationTracker');

// Sales Person - Log Location (Every 5 minutes)
exports.logLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    
    // Find sales person by user ID
    const salesPerson = await SalesPerson.findOne({ userId: req.user._id });
    if (!salesPerson) {
      return res.status(404).json({ error: 'SalesPerson profile not found' });
    }
    
    const activityLog = new ActivityLog({
      salesPersonId: salesPerson._id,
      location: {
        latitude,
        longitude,
        address
      }
    });
    
    await activityLog.save();
    res.status(201).json({ message: 'Location logged successfully', activityLog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin - Get All Activity Logs
exports.getAllActivityLogs = async (req, res) => {
  try {
    const { salesPersonId, date, limit = 50 } = req.query;
    const filter = {};
    
    if (salesPersonId) filter.salesPersonId = salesPersonId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.timestamp = { $gte: startDate, $lt: endDate };
    }
    
    const activityLogs = await ActivityLog.find(filter)
      .populate('salesPersonId', 'name employeeId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
      
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin - Get Sales Person Activity Logs
exports.getSalesPersonActivityLogs = async (req, res) => {
  try {
    const { salesPersonId } = req.params;
    const { date, limit = 50 } = req.query;
    const filter = { salesPersonId };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.timestamp = { $gte: startDate, $lt: endDate };
    }
    
    const activityLogs = await ActivityLog.find(filter)
      .populate('salesPersonId', 'name employeeId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
      
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sales Person - Get My Activity Logs
exports.getMyActivityLogs = async (req, res) => {
  try {
    const { date, limit = 50 } = req.query;
    
    // Find sales person by user ID
    const salesPerson = await SalesPerson.findOne({ userId: req.user._id });
    if (!salesPerson) {
      return res.status(404).json({ error: 'SalesPerson profile not found' });
    }
    
    const filter = { salesPersonId: salesPerson._id };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.timestamp = { $gte: startDate, $lt: endDate };
    }
    
    const activityLogs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
      
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin - Get Latest Locations of All Sales Persons
exports.getLatestLocations = async (req, res) => {
  try {
    const latestLogs = await ActivityLog.aggregate([
      {
        $sort: { salesPersonId: 1, timestamp: -1 }
      },
      {
        $group: {
          _id: '$salesPersonId',
          latestLog: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestLog' }
      },
      {
        $lookup: {
          from: 'salespersons',
          localField: 'salesPersonId',
          foreignField: '_id',
          as: 'salesPerson'
        }
      },
      {
        $unwind: '$salesPerson'
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);
    
    res.json(latestLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.startLocationTracking = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findOne({ userId: req.user._id });
    if (!salesPerson) return res.status(404).json({ error: 'SalesPerson not found' });
    
    locationTracker.startTracking(salesPerson._id.toString());
    res.json({ message: 'Location tracking started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.stopLocationTracking = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.findOne({ userId: req.user._id });
    if (!salesPerson) return res.status(404).json({ error: 'SalesPerson not found' });
    
    locationTracker.stopTracking(salesPerson._id.toString());
    res.json({ message: 'Location tracking stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};