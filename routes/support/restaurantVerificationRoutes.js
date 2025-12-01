const express = require('express');
const router = express.Router();
const controller = require('../../controllers/supportController/restaurantVerificationController');
const { auth, authorize } = require('../../middleware/auth');

router.get('/pending', auth, authorize('SUPPORT', 'ADMIN'), controller.getPendingRegistrations);
router.post('/verify/:id', auth, authorize('SUPPORT', 'ADMIN'), controller.verifyRegistration);
router.put('/approve/:id', auth, authorize('ADMIN'), controller.approveRestaurant);
router.get('/verified', auth, authorize('SUPPORT', 'ADMIN'), controller.getAllVerifiedRestaurants);

module.exports = router;