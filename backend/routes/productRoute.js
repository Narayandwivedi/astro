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
  getProductsByCategory,
  trackPurchase,
  updateStock,
  updateSortOrder,
  searchProducts
} = require('../controllers/productController');

// Public routes (no authentication required)
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.post('/:id/purchase', trackPurchase); // When someone buys via WhatsApp

// Admin routes have been moved to /api/admin/products
// Legacy admin routes for backward compatibility (can be removed later)
router.post('/admin/create', createProduct);
router.put('/admin/:id', updateProduct);
router.delete('/admin/:id', deleteProduct);
router.patch('/admin/:id/status', toggleProductStatus);
router.patch('/admin/:id/stock', updateStock);
router.patch('/admin/sort-order', updateSortOrder);

module.exports = router;