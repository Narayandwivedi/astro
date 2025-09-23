const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  bulkUpdateOrders,
  deleteOrder
} = require('../../controllers/admin/adminOrderController');

// Admin authentication middleware would go here in production
// router.use(authenticateAdmin);

// Get all orders with pagination and filters
router.get('/', getAllOrders);

// Get order statistics
router.get('/stats', getOrderStats);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', cancelOrder);

// Delete order
router.delete('/:id', deleteOrder);

// Bulk update orders
router.patch('/bulk-update', bulkUpdateOrders);

module.exports = router;