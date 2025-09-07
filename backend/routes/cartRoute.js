const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  getCartCount
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authMiddleware);

// Get user's cart
router.get('/', getCart);

// Get cart count for navbar badge
router.get('/count', getCartCount);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/update/:itemId', updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

// Merge local cart with server cart (when user logs in)
router.post('/merge', mergeCart);

module.exports = router;