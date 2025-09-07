const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Order Details
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    }
  },
  
  // Customer Information
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    whatsapp: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit WhatsApp number']
    }
  },

  // Shipping Address
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, 'Full name is required for shipping'],
      trim: true
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    }
  },

  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productNameHi: {
      type: String
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true
    },
    productImage: {
      type: String
    },
    category: {
      type: String
    },
    specifications: {
      type: String
    }
  }],

  // Order Summary
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    }
  },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'upi', 'bank_transfer', 'whatsapp'],
    default: 'whatsapp'
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Payment Details (for UPI payments, etc.)
  paymentDetails: {
    utrNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{12}$/, 'UTR number must be 12 digits']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    }
  },

  // Special Requirements
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requirements cannot exceed 500 characters']
  },

  // Birth Details for Astrological Products
  birthDetails: {
    dateOfBirth: {
      type: Date
    },
    timeOfBirth: {
      type: String
    },
    placeOfBirth: {
      type: String,
      trim: true
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },

  // Consultation Preference
  consultationRequired: {
    type: Boolean,
    default: false
  },

  // Order Tracking
  tracking: {
    courierPartner: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    estimatedDelivery: {
      type: Date
    }
  },

  // Admin Notes
  adminNotes: {
    type: String,
    trim: true
  },

  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  
  confirmedDate: {
    type: Date
  },
  
  shippedDate: {
    type: Date
  },
  
  deliveredDate: {
    type: Date
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// Note: orderNumber index is automatically created by unique: true
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ 'items.product': 1 });

// Virtual for order age
OrderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.orderDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Method to calculate total items
OrderSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Method to get order status display
OrderSchema.methods.getStatusDisplay = function() {
  const statusMap = {
    'pending': 'Order Placed',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded'
  };
  return statusMap[this.status] || this.status;
};

// Method to check if order can be cancelled
OrderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Method to update order status with timestamp
OrderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  switch(newStatus) {
    case 'confirmed':
      this.confirmedDate = new Date();
      break;
    case 'shipped':
      this.shippedDate = new Date();
      break;
    case 'delivered':
      this.deliveredDate = new Date();
      this.paymentStatus = 'paid'; // Auto-mark as paid when delivered for COD
      break;
  }
  
  return this.save();
};

// Static method to get order statistics
OrderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$pricing.total' }
      }
    }
  ]);
  
  const totalOrders = await this.countDocuments();
  const totalRevenue = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$pricing.total' }
      }
    }
  ]);
  
  return {
    statusBreakdown: stats,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  };
};

// Pre-save middleware to calculate totals
OrderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Calculate total (subtotal + shipping + tax - discount)
  this.pricing.total = this.pricing.subtotal + this.pricing.shipping + this.pricing.tax - this.pricing.discount;
  
  // Ensure total is not negative
  if (this.pricing.total < 0) {
    this.pricing.total = 0;
  }
  
  next();
});

// Pre-save middleware to set item total prices
OrderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.totalPrice = item.quantity * item.price;
  });
  next();
});

module.exports = mongoose.model('Order', OrderSchema);