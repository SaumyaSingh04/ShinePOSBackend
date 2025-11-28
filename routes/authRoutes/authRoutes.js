const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  toggleUserStatus 
} = require('../../controllers/authControllers/authController');
const { auth, authorize } = require('../../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - User profile
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// Admin only routes - User management
router.get('/users', auth, authorize('ADMIN'), getAllUsers);
router.get('/users/:id', auth, authorize('ADMIN'), getUserById);
router.put('/users/:id', auth, authorize('ADMIN'), updateUser);
router.delete('/users/:id', auth, authorize('ADMIN'), deleteUser);
router.patch('/users/:id/toggle-status', auth, authorize('ADMIN'), toggleUserStatus);

module.exports = router;