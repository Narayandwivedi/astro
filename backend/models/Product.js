const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Info
  nameEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  nameHi: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  
  // Descriptions
  descriptionEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  descriptionHi: {
    type: String,
    required: true,
    trim: true,
    maxlength: 750
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: function() {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
  },
  
  // Category
  category: {
    type: String,
    required: true,
    enum: [
      'rudraksha',
      'gemstone', 
      'yantra',
      'mala',
      'spiritual-items',
      'books',
      'accessories',
      'puja-items'
    ]
  },
  
  // Visual
  icon: {
    type: String,
    required: true,
    maxlength: 10
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Product Status
  inStock: {
    type: Boolean,
    default: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    default: 1,
    min: 0
  },
  lowStockAlert: {
    type: Number,
    default: 5
  },
  
  // Product Specifications
  specifications: {
    material: String,
    weight: String,
    size: String,
    color: String,
    origin: String,
    certification: String,
    purity: String
  },
  
  // Spiritual Properties
  spiritualBenefits: [{
    type: String,
    trim: true
  }],
  rulingPlanet: String,
  chakra: String,
  mantra: String,
  
  // Usage Instructions
  usageInstructions: {
    en: String,
    hi: String
  },
  careInstructions: {
    en: String,
    hi: String
  },
  
  // SEO & Metadata
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Customer Reviews
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Sales Data
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Shipping
  weight: {
    type: Number, // in grams
    default: 10
  },
  dimensions: {
    length: Number, // in cm
    width: Number,
    height: Number
  },
  shippingClass: {
    type: String,
    enum: ['standard', 'fragile', 'heavy', 'express'],
    default: 'standard'
  },
  
  // WhatsApp Integration
  whatsappMessage: {
    type: String,
    default: function() {
      return `Hi, I want to buy ${this.nameEn} for ${this.formattedPrice}`;
    }
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    maxlength: 500
  },
  
  // Sort Order
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Vendor Info (if applicable)
  vendor: {
    name: String,
    contact: String,
    location: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from English name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('nameEn') || this.isNew) {
    this.slug = this.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString()}`;
});

// Virtual for formatted original price
productSchema.virtual('formattedOriginalPrice').get(function() {
  return `₹${this.originalPrice.toLocaleString()}`;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  return this.originalPrice - this.price;
});

// Virtual for formatted savings
productSchema.virtual('formattedSavings').get(function() {
  return `₹${this.savings.toLocaleString()}`;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'out-of-stock';
  if (this.stockQuantity <= this.lowStockAlert) return 'low-stock';
  return 'in-stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Static method to get products by category
productSchema.statics.getByCategory = function(category = 'all', options = {}) {
  const query = { 
    isEnabled: true,
    inStock: true 
  };
  
  if (category !== 'all') {
    query.category = category;
  }
  
  const { featured, limit, sort } = options;
  
  if (featured) {
    query.isFeatured = true;
  }
  
  let sortOptions = {};
  switch (sort) {
    case 'price-asc':
      sortOptions = { price: 1 };
      break;
    case 'price-desc':
      sortOptions = { price: -1 };
      break;
    case 'popular':
      sortOptions = { salesCount: -1, rating: -1 };
      break;
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    default:
      sortOptions = { sortOrder: 1, createdAt: -1 };
  }
  
  const queryBuilder = this.find(query).sort(sortOptions);
  
  if (limit) {
    queryBuilder.limit(limit);
  }
  
  return queryBuilder;
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 6) {
  return this.find({ 
    isEnabled: true, 
    inStock: true,
    isFeatured: true 
  }).sort({ sortOrder: 1, salesCount: -1 }).limit(limit);
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const regex = new RegExp(searchTerm, 'i');
  const query = {
    isEnabled: true,
    $or: [
      { nameEn: regex },
      { nameHi: regex },
      { descriptionEn: regex },
      { descriptionHi: regex },
      { tags: { $in: [regex] } }
    ]
  };
  
  if (options.category && options.category !== 'all') {
    query.category = options.category;
  }
  
  if (options.inStock) {
    query.inStock = true;
  }
  
  return this.find(query);
};

// Method to increment sales count
productSchema.methods.incrementSalesCount = function() {
  this.salesCount += 1;
  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
  this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
  if (this.stockQuantity === 0) {
    this.inStock = false;
  }
  return this.save();
};

// Method to disable product
productSchema.methods.disable = function() {
  this.isEnabled = false;
  return this.save();
};

// Method to enable product
productSchema.methods.enable = function() {
  this.isEnabled = true;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;