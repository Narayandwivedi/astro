const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
  getBookingStats,
  deleteBooking
} = require('../../controllers/admin/adminBookingController');

// Admin authentication middleware would go here in production
// router.use(authenticateAdmin);

// Get all bookings with pagination and filters
router.get('/', getAllBookings);

// Get booking statistics
router.get('/stats', getBookingStats);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

// Cancel booking
router.patch('/:id/cancel', cancelBooking);

// Reschedule booking
router.patch('/:id/reschedule', rescheduleBooking);

// Delete booking
router.delete('/:id', deleteBooking);

module.exports = router;