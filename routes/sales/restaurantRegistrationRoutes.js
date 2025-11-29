const express = require('express');
const router = express.Router();
const controller = require('../../controllers/salesController/restaurantRegistrationController');
const { auth, authorize } = require('../../middleware/auth');

// Sales Person APIs - Require Authentication + Sales Role
router.post('/create', auth, authorize('SALES', 'ADMIN'), controller.createRestaurantRegistration);
router.get('/my-registrations', auth, authorize('SALES', 'ADMIN'), controller.getMyRegistrations);
router.put('/update/:id', auth, authorize('SALES', 'ADMIN'), controller.updateRestaurantRegistration);
router.put('/submit/:id', auth, authorize('SALES', 'ADMIN'), controller.submitRestaurantRegistration);
router.delete('/delete/:id', auth, authorize('SALES', 'ADMIN'), controller.deleteRestaurantRegistration);

// Admin/Support APIs - Require Admin/Support Role
router.get('/all', auth, authorize('ADMIN', 'SUPPORT'), controller.getAllRestaurantRegistrations);
router.get('/:id', auth, authorize('SALES', 'ADMIN', 'SUPPORT'), controller.getRestaurantRegistrationById);

module.exports = router;