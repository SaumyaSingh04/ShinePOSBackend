const ActivityLog = require('../models/salesModel/ActivityLog');

const activeTracking = new Map();
const trackingData = new Map();

const startTracking = (salesPersonId) => {
  if (activeTracking.has(salesPersonId)) {
    clearInterval(activeTracking.get(salesPersonId));
  }

  const intervalId = setInterval(async () => {
    try {
      const lastLocation = trackingData.get(salesPersonId);
      if (lastLocation) {
        await logLocation(salesPersonId, lastLocation);
        console.log(`Auto-tracked location for sales person: ${salesPersonId}`);
      } else {
        console.log(`No location data available for sales person: ${salesPersonId}`);
      }
    } catch (error) {
      console.error(`Location tracking error for ${salesPersonId}:`, error);
    }
  }, 5 * 60 * 1000);

  activeTracking.set(salesPersonId, intervalId);
};

const stopTracking = (salesPersonId) => {
  const intervalId = activeTracking.get(salesPersonId);
  if (intervalId) {
    clearInterval(intervalId);
    activeTracking.delete(salesPersonId);
  }
};

const updateLocation = (salesPersonId, location) => {
  trackingData.set(salesPersonId, location);
};

const logLocation = async (salesPersonId, location) => {
  const activityLog = new ActivityLog({
    salesPersonId,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || 'Unknown'
    }
  });
  
  await activityLog.save();
  return activityLog;
};

const removeUnusableApiLogs = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await ActivityLog.deleteMany({
      $or: [
        { 'location.latitude': { $exists: false } },
        { 'location.longitude': { $exists: false } },
        { 'location.latitude': null },
        { 'location.longitude': null },
        { timestamp: { $lt: cutoffDate } }
      ]
    });
    
    console.log(`Removed ${result.deletedCount} unusable activity logs`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error removing unusable API logs:', error);
    throw error;
  }
};

module.exports = { 
  startTracking, 
  stopTracking, 
  logLocation, 
  updateLocation,
  removeUnusableApiLogs,
  activeTracking 
};