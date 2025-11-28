const express = require('express');
const restaurantOrderController = require('../../controllers/restaurant/restaurantOrderController');

const router = express.Router();

router.get('/details/:id', restaurantOrderController.getOrderDetails);
router.get('/table/:tableNo', restaurantOrderController.getOrdersByTable);
router.get('/invoice/:id', restaurantOrderController.generateInvoice);
router.get('/all', restaurantOrderController.getAllOrders);
router.post('/create', restaurantOrderController.createOrder);
router.patch('/:id/add-items', restaurantOrderController.addItemsToOrder);
router.patch('/:id/transfer-table', restaurantOrderController.transferTable);
router.patch('/:id/add-transaction', restaurantOrderController.addTransaction);
router.patch('/:id/status', restaurantOrderController.updateOrderStatus);


module.exports = router;
