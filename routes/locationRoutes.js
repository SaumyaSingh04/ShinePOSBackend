const express = require('express');
const { startTracking, stopTracking, updateLocation, removeUnusableApiLogs } = require('../services/locationTracker');
const router = express.Router();

router.post('/start/:salesPersonId', (req, res) => {
  const { salesPersonId } = req.params;
  startTracking(salesPersonId);
  res.json({ message: 'Location tracking started', salesPersonId });
});

router.post('/stop/:salesPersonId', (req, res) => {
  const { salesPersonId } = req.params;
  stopTracking(salesPersonId);
  res.json({ message: 'Location tracking stopped', salesPersonId });
});

router.post('/update/:salesPersonId', (req, res) => {
  const { salesPersonId } = req.params;
  const { latitude, longitude, address } = req.body;
  
  updateLocation(salesPersonId, { latitude, longitude, address });
  res.json({ message: 'Location updated', salesPersonId });
});

router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const deletedCount = await removeUnusableApiLogs(parseInt(days));
    res.json({ message: 'Cleanup completed', deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;