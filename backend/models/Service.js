const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // Basic Service Info
  titleEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  titleHi: {
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
  
  // Service Details
  duration: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Personal',
      'Business', 
      'Relationship',
      'Remedial',
      'Health',
      'Education',
      'Property',
      'Travel',
      'Vastu',
      'Timing',
      'Ceremonial'
    ]
  },
  
  // Visual
  icon: {
    type: String,
    required: true,
    maxlength: 10
  },
  
  // Service Status
  isEnabled: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  
  // Service Features
  features: [{
    type: String,
    trim: true
  }],
  
  // Booking Options
  availableOnline: {
    type: Boolean,
    default: true
  },
  availableOffline: {
    type: Boolean,
    default: true
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
  
  // Statistics
  bookingCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from English title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('titleEn') || this.isNew) {
    this.slug = this.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString()}`;
});

// Virtual for formatted original price
serviceSchema.virtual('formattedOriginalPrice').get(function() {
  return `₹${this.originalPrice.toLocaleString()}`;
});

// Virtual for savings amount
serviceSchema.virtual('savings').get(function() {
  return this.originalPrice - this.price;
});

// Virtual for formatted savings
serviceSchema.virtual('formattedSavings').get(function() {
  return `₹${this.savings.toLocaleString()}`;
});

// Static method to get enabled services by category
serviceSchema.statics.getEnabledByCategory = function(category = 'all') {
  const query = { isEnabled: true };
  if (category !== 'all') {
    query.category = category;
  }
  return this.find(query).sort({ sortOrder: 1, createdAt: -1 });
};

// Static method to get popular services
serviceSchema.statics.getPopularServices = function(limit = 6) {
  return this.find({ 
    isEnabled: true, 
    isPopular: true 
  }).sort({ sortOrder: 1, bookingCount: -1 }).limit(limit);
};

// Method to increment booking count
serviceSchema.methods.incrementBookingCount = function() {
  this.bookingCount += 1;
  return this.save();
};

// Method to disable service
serviceSchema.methods.disable = function() {
  this.isEnabled = false;
  return this.save();
};

// Method to enable service
serviceSchema.methods.enable = function() {
  this.isEnabled = true;
  return this.save();
};

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;