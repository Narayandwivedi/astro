const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  getCustomerOrders,
  getUserOrders,
  getOrderStats,
  sendOrderConfirmation
} = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createOrder);
router.get('/customer', getCustomerOrders); // Get orders by email/phone
router.get('/number/:orderNumber', getOrderByNumber); // Track order by number
router.get('/:id', getOrderById); // Get order by ID

// Protected routes
router.get('/user/my-orders', authMiddleware, getUserOrders); // Get orders for authenticated user

// Admin routes (in production, add authentication middleware)
router.get('/admin/all', getAllOrders);
router.get('/admin/stats', getOrderStats);
router.patch('/admin/:id/status', updateOrderStatus);
router.patch('/admin/:id/cancel', cancelOrder);
router.post('/admin/:id/confirmation', sendOrderConfirmation);

module.exports = router;