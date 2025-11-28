const express = require('express');
const restaurantReservationController = require('../../controllers/restaurant/reasturantReservationController');

const router = express.Router();

router.post('/create', restaurantReservationController.createReservation);
router.get("/available-slots", restaurantReservationController.getAvailableSlots);
router.get('/all', restaurantReservationController.getAllReservations);
router.get('/:id', restaurantReservationController.getReservationById);
router.put('/:id', restaurantReservationController.updateReservation);
router.patch('/:id/status', restaurantReservationController.updateReservationStatus);
router.patch('/:id/payment', restaurantReservationController.updatePayment);
router.delete('/:id', restaurantReservationController.deleteReservation);

module.exports = router;
