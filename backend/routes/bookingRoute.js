const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  addCommunication,
  getBookingStats,
  cancelBooking
} = require('../controllers/bookingController');

// Public routes (for frontend booking)
router.post('/', createBooking);
router.get('/stats', getBookingStats);

// Admin routes (would typically require authentication)
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/communication', addCommunication);

module.exports = router;