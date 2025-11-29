const express = require('express');
const router = express.Router();
const activityLogController = require('../../controllers/salesController/activityLogController');
const { auth, authorize } = require('../../middleware/auth');

// Sales Person APIs
router.post('/log-location', auth, authorize('SALES'), activityLogController.logLocation);
router.get('/my-logs', auth, authorize('SALES'), activityLogController.getMyActivityLogs);

// Admin APIs
router.get('/all', auth, authorize('ADMIN'), activityLogController.getAllActivityLogs);
router.get('/latest-locations', auth, authorize('ADMIN'), activityLogController.getLatestLocations);
router.get('/sales-person/:salesPersonId', auth, authorize('ADMIN'), activityLogController.getSalesPersonActivityLogs);

module.exports = router;