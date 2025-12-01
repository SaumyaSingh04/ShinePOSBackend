const express = require('express');
const router = express.Router();
const commissionLogController = require('../../controllers/salesController/commissionLogController');

// Basic CRUD
router.post('/', commissionLogController.createCommissionLog);
router.get('/', commissionLogController.getAllCommissionLogs);
router.get('/:id', commissionLogController.getCommissionLogById);
router.put('/:id', commissionLogController.updateCommissionLog);
router.delete('/:id', commissionLogController.deleteCommissionLog);

// Sales person specific routes
router.get('/salesperson/:salesPersonId', commissionLogController.getSalesPersonCommissions);
router.patch('/:id/mark-paid', commissionLogController.markCommissionPaid);
router.post('/subscribe-restaurant', commissionLogController.subscribeRestaurant);

module.exports = router;