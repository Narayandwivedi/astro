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
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// Public routes (for frontend booking) - with optional authentication
router.post('/', optionalAuth, createBooking);
router.get('/stats', getBookingStats);

// Protected routes
router.get('/user/my-bookings', authMiddleware, getUserBookings); // Get bookings for authenticated user

// Debug route to see all bookings (temporary)
router.get('/debug/all', authMiddleware, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const allBookings = await Booking.find({}).select('_id name email mobile userId createdAt').sort({ createdAt: -1 });
    res.json({
      success: true,
      total: allBookings.length,
      data: allBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin routes (would typically require authentication)
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/communication', addCommunication);

module.exports = router;