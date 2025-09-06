const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getBookingAnalytics,
  getOrderAnalytics
} = require('../controllers/analyticsController');

// Dashboard overview stats
router.get('/dashboard', getDashboardStats);

// Detailed analytics
router.get('/bookings', getBookingAnalytics);
router.get('/orders', getOrderAnalytics);

module.exports = router;