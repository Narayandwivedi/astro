const express = require('express');
const router = express.Router();

// Import admin route modules
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const bookingRoutes = require('./bookings');

// Admin authentication middleware would go here in production
// const { authenticateAdmin } = require('../../middleware/adminAuth');
// router.use(authenticateAdmin);

// Mount admin routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/bookings', bookingRoutes);

// Admin dashboard overview route
router.get('/dashboard', async (req, res) => {
  try {
    // This could aggregate stats from multiple controllers
    res.json({
      success: true,
      message: 'Admin dashboard data',
      data: {
        timestamp: new Date(),
        // Add dashboard stats here
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

module.exports = router;