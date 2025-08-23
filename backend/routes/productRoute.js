const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getFeaturedProducts,
  getProductCategories,
  trackPurchase,
  updateStock,
  updateSortOrder,
  searchProducts
} = require('../controllers/productController');

// Public routes (no authentication required)
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.post('/:id/purchase', trackPurchase); // When someone buys via WhatsApp

// Admin routes (authentication would be added here in production)
// For now, these are open but in production you'd add middleware like:
// router.use('/admin', authenticateAdmin);

// Admin CRUD operations
router.post('/admin/create', createProduct);
router.put('/admin/:id', updateProduct);
router.delete('/admin/:id', deleteProduct);
router.patch('/admin/:id/status', toggleProductStatus);
router.patch('/admin/:id/stock', updateStock);
router.patch('/admin/sort-order', updateSortOrder);

module.exports = router;