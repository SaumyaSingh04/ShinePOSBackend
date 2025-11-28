const express = require('express');
const router = express.Router();
const {
  createRestaurantRegistration,
  getAllRestaurantRegistrations,
  getRestaurantRegistrationById,
  updateRestaurantRegistration,
  submitRestaurantRegistration,
  getMyRegistrations,
  deleteRestaurantRegistration
} = require('../../controllers/salesController/restaurantRegistrationController');

// A. Create Restaurant (status = pending)
router.post('/', createRestaurantRegistration);

// B. Update Restaurant (ONLY pending status)
router.put('/:id', updateRestaurantRegistration);

// C. Submit Registration (pending → submitted)
router.patch('/:id/submit', submitRestaurantRegistration);

// D. View My Registrations (pending + submitted)
router.get('/sales/:salesPersonId', getMyRegistrations);

// Admin routes
router.get('/', getAllRestaurantRegistrations);
router.get('/:id', getRestaurantRegistrationById);
router.delete('/:id', deleteRestaurantRegistration);

module.exports = router;