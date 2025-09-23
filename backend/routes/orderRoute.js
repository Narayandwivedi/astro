const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
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
router.get('/:id', getOrderById); // Get order by ID

// Protected routes
router.get('/user/my-orders', authMiddleware, getUserOrders); // Get orders for authenticated user
router.put('/:id/cancel', authMiddleware, cancelOrder); // User cancel order

// Admin routes have been moved to /api/admin/orders
// Legacy admin routes for backward compatibility (can be removed later)
router.get('/admin/all', getAllOrders);
router.get('/admin/stats', getOrderStats);
router.patch('/admin/:id/status', updateOrderStatus);
router.patch('/admin/:id/cancel', cancelOrder);
router.post('/admin/:id/confirmation', sendOrderConfirmation);

module.exports = router;