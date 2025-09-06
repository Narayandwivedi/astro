const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHi: {
    type: String,
    required: true,
    trim: true
  },
  
  // Descriptions
  description: {
    type: String,
    required: true,
    trim: true
  },
  descriptionHi: {
    type: String,
    required: true,
    trim: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: false,
    min: 0
  },
  
  // Product Details
  category: {
    type: String,
    required: true,
    enum: [
      'rudraksha',
      'gemstone',
      'spiritual-items',
      'yantra',
      'mala',
      'accessories',
      'puja-items'
    ]
  },
  
  // Images
  images: [{
    type: String
  }],
  
  // Inventory
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  // Benefits
  benefits: [{
    type: String,
    trim: true
  }],
  benefitsHi: [{
    type: String,
    trim: true
  }],
  
  // Simple specifications
  weight: String,
  material: String,
  origin: String,
  certification: String,
  
  // Product Status
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Static method to get products by category
productSchema.statics.getByCategory = function(category = 'all') {
  const query = { isActive: true };
  if (category !== 'all') {
    query.category = category;
  }
  return this.find(query).sort({ createdAt: -1 });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;