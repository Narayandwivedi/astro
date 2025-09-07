const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productDetails: {
    // Store product snapshot at time of adding to cart
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    category: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  specifications: {
    type: String,
    default: ''
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Cart expiration (optional - remove abandoned carts after 30 days)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Index for efficient queries
// Note: user index is automatically created by unique: true
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.productDetails.price * item.quantity), 0);
  this.lastUpdated = new Date();
  next();
});

// Methods
cartSchema.methods.addItem = function(productData, quantity = 1, specifications = '') {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productData._id.toString() && 
             item.specifications === specifications
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productData._id,
      productDetails: {
        _id: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.images?.[0] || productData.image,
        category: productData.category
      },
      quantity,
      specifications
    });
  }
  
  return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  return this.save();
};

cartSchema.methods.updateQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    } else {
      item.quantity = quantity;
      return this.save();
    }
  }
  throw new Error('Item not found in cart');
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.getCartSummary = function() {
  const subtotal = this.totalPrice;
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return {
    items: this.items,
    totalItems: this.totalItems,
    subtotal,
    shipping,
    total
  };
};

// Static methods
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }
  
  return cart;
};

cartSchema.statics.mergeLocalCart = async function(userId, localCartItems) {
  const cart = await this.getOrCreateCart(userId);
  
  // Merge local cart items with existing cart
  for (const localItem of localCartItems) {
    await cart.addItem(localItem.product, localItem.quantity, localItem.specifications);
  }
  
  return cart;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;