const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  addCommunication,
  getBookingStats,
  cancelBooking,
  getUserBookings
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes (for frontend booking)
router.post('/', createBooking);
router.get('/stats', getBookingStats);

// Protected routes
router.get('/user/my-bookings', authMiddleware, getUserBookings); // Get bookings for authenticated user

// Admin routes (would typically require authentication)
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/communication', addCommunication);

module.exports = router;