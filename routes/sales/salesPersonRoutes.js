const express = require('express');
const router = express.Router();
const salesPersonController = require('../../controllers/salesController/salesPersonController');

// Create SalesPerson
router.post('/', salesPersonController.createSalesPerson);

// Get all SalesPersons
router.get('/', salesPersonController.getAllSalesPersons);

// Get SalesPerson by ID
router.get('/:id', salesPersonController.getSalesPersonById);

// Update SalesPerson
router.put('/:id', salesPersonController.updateSalesPerson);

// Delete SalesPerson
router.delete('/:id', salesPersonController.deleteSalesPerson);

module.exports = router;