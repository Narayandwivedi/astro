const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateStock,
  getProductStats,
  bulkUpdateProducts
} = require('../../controllers/admin/adminProductController');

// Admin authentication middleware would go here in production
// router.use(authenticateAdmin);

// Get all products with pagination
router.get('/', getAllProducts);

// Get product statistics
router.get('/stats', getProductStats);

// Get product by ID
router.get('/:id', getProductById);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// Toggle product status (enable/disable)
router.patch('/:id/status', toggleProductStatus);

// Update product stock
router.patch('/:id/stock', updateStock);

// Bulk update products
router.patch('/bulk-update', bulkUpdateProducts);

module.exports = router;