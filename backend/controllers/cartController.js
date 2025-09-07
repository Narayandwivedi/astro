const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    
    const cart = await Cart.getOrCreateCart(userId);
    
    res.status(200).json({
      success: true,
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1, specifications = '' } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get or create cart
    const cart = await Cart.getOrCreateCart(userId);
    
    // Add item to cart
    await cart.addItem(product, quantity, specifications);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.updateQuantity(itemId, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(itemId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// Merge local cart with server cart (when user logs in)
const mergeCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { localCartItems = [] } = req.body;

    if (!Array.isArray(localCartItems)) {
      return res.status(400).json({
        success: false,
        message: 'Local cart items must be an array'
      });
    }

    const cart = await Cart.mergeLocalCart(userId, localCartItems);

    res.status(200).json({
      success: true,
      message: 'Cart merged successfully',
      data: cart.getCartSummary()
    });

  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart',
      error: error.message
    });
  }
};

// Get cart count (for navbar badge)
const getCartCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ user: userId });
    const totalItems = cart ? cart.totalItems : 0;

    res.status(200).json({
      success: true,
      data: { totalItems }
    });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  getCartCount
};