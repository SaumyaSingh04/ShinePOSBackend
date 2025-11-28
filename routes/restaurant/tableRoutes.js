const express = require('express');
const router = express.Router();
const tableController = require('../../controllers/restaurant/tableController');

// Get all tables
router.get('/tables', tableController.getAllTables);

// Create table
router.post('/tables', tableController.createTable);

// Update table
router.put('/tables/:tableId', tableController.updateTable);

// Update table status
router.patch('/tables/:tableId/status', tableController.updateTableStatus);

// Update table status by table number
router.patch('/tables/status', tableController.updateTableStatusByNumber);

// Delete table
router.delete('/tables/:tableId', tableController.deleteTable);

module.exports = router;
