const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true, // Allows null values for Google users, maintains uniqueness
    required: function() {
      return this.authProvider !== 'google'; // Required for local signup, optional for Google
    },
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
  },
  
  // Authentication
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if user signed up with Google
    },
    minlength: 6
  },
  
  // Google OAuth fields
  googleId: {
    type: String,
    sparse: true, // Allows null values and maintains uniqueness
  },
  profilePicture: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  
  // Birth Details for astrology
  dateOfBirth: {
    type: Date,
  },
  birthTime: {
    type: String
  },
  birthPlace: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  
  // Enhanced Addresses for Ecommerce
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'billing', 'shipping', 'other'],
      default: 'home'
    },
    label: {
      type: String,
      trim: true,
      maxlength: 50
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    mobile: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
    },
    alternatePhone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: 200
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 100
    },
    area: {
      type: String,
      trim: true,
      maxlength: 100
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India',
      maxlength: 50
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: 300
    },
    addressTags: [{
      type: String,
      enum: ['safe', 'secure_building', 'no_lift', 'parking_available', 'gated_community', 'apartment', 'independent_house']
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User Role
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  
  // Activity Tracking
  lastActive: {
    type: Date,
    default: Date.now,
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },
  
  // Ecommerce Specific Fields
  // Shopping Preferences
  shoppingPreferences: {
    favoriteCategories: [{
      type: String,
      trim: true
    }],
    priceRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 }
    },
    preferredBrands: [{
      type: String,
      trim: true
    }],
    deliveryPreference: {
      type: String,
      enum: ['standard', 'express', 'scheduled'],
      default: 'standard'
    },
    paymentPreference: {
      type: String,
      enum: ['cod', 'online', 'wallet', 'emi'],
      default: 'online'
    }
  },
  
  // Purchase History & Analytics
  purchaseStats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    avgOrderValue: {
      type: Number,
      default: 0
    },
    firstOrderDate: Date,
    lastOrderDate: Date,
    favoritePaymentMethod: String,
    repeatPurchaseCount: {
      type: Number,
      default: 0
    }
  },
  
  // Customer Tier & Loyalty
  customerTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  
  // Wishlist & Recently Viewed
  wishlist: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recentlyViewed: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Communication & Marketing
  communicationPreferences: {
    promotionalEmails: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    newArrivals: { type: Boolean, default: false },
    personalizedOffers: { type: Boolean, default: true },
    categoryUpdates: { type: Boolean, default: false },
    priceDropAlerts: { type: Boolean, default: true }
  },
  
  // Account Security & Verification
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    count: { type: Number, default: 0 },
    lastAttempt: Date,
    blockedUntil: Date
  },
  
  // Social & Reviews
  socialProfiles: {
    facebook: String,
    google: String,
    instagram: String
  },
  reviewStats: {
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    helpfulVotes: { type: Number, default: 0 }
  },
  
  // Business/Enterprise Fields (for B2B)
  businessInfo: {
    companyName: String,
    gstNumber: {
      type: String,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
    },
    businessType: {
      type: String,
      enum: ['individual', 'proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited', 'trust', 'society']
    },
    industry: String,
    businessRegistrationNumber: String,
    billingContact: {
      name: String,
      email: String,
      mobile: String
    }
  },
  
  // Password Reset
  resetOtp: String,
  otpExpiresAt: Date,
  

},{timestamps:true});

// Indexes for better performance and ecommerce queries
// Note: email and mobile indexes are automatically created by unique: true
// Note: googleId index seems to be automatically created (removing manual index to avoid duplicate)
userSchema.index({ createdAt: -1 });
userSchema.index({ customerTier: 1 });
userSchema.index({ 'purchaseStats.totalSpent': -1 });
userSchema.index({ loyaltyPoints: -1 });
userSchema.index({ referralCode: 1 }, { sparse: true });
userSchema.index({ 'addresses.pincode': 1 });
userSchema.index({ 'addresses.city': 1 });
userSchema.index({ 'addresses.isDefault': 1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ role: 1, isActive: 1 });

// Virtual for user's full profile completeness
userSchema.virtual('profileCompleteness').get(function() {
  let completeness = 0;
  const fields = ['fullName', 'email', 'mobile', 'dateOfBirth', 'birthTime', 'birthPlace.city'];
  
  fields.forEach(field => {
    if (this.get(field)) completeness += 1;
  });
  
  return Math.round((completeness / fields.length) * 100);
});

// Method to check if user profile is complete
userSchema.methods.isProfileComplete = function() {
  return this.fullName && this.email && this.mobile && this.dateOfBirth;
};

// Method to get display name
userSchema.methods.getDisplayName = function() {
  return this.fullName || this.email.split('@')[0];
};

// Ecommerce-specific methods
// Get default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(address => address.isDefault && address.isActive);
};

// Get shipping addresses
userSchema.methods.getShippingAddresses = function() {
  return this.addresses.filter(address => 
    (address.type === 'shipping' || address.type === 'home') && address.isActive
  );
};

// Get billing addresses
userSchema.methods.getBillingAddresses = function() {
  return this.addresses.filter(address => 
    (address.type === 'billing' || address.type === 'home') && address.isActive
  );
};

// Update purchase stats
userSchema.methods.updatePurchaseStats = function(orderValue, paymentMethod) {
  this.purchaseStats.totalOrders += 1;
  this.purchaseStats.totalSpent += orderValue;
  this.purchaseStats.avgOrderValue = this.purchaseStats.totalSpent / this.purchaseStats.totalOrders;
  this.purchaseStats.lastOrderDate = new Date();
  this.purchaseStats.favoritePaymentMethod = paymentMethod;
  
  if (!this.purchaseStats.firstOrderDate) {
    this.purchaseStats.firstOrderDate = new Date();
  }
  
  // Update customer tier based on total spent
  this.updateCustomerTier();
  
  return this.save();
};

// Update customer tier
userSchema.methods.updateCustomerTier = function() {
  const totalSpent = this.purchaseStats.totalSpent;
  
  if (totalSpent >= 100000) {
    this.customerTier = 'diamond';
  } else if (totalSpent >= 50000) {
    this.customerTier = 'platinum';
  } else if (totalSpent >= 25000) {
    this.customerTier = 'gold';
  } else if (totalSpent >= 10000) {
    this.customerTier = 'silver';
  } else {
    this.customerTier = 'bronze';
  }
};

// Add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  const existingIndex = this.wishlist.findIndex(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (existingIndex === -1) {
    this.wishlist.push({ productId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Add to recently viewed
userSchema.methods.addToRecentlyViewed = function(productId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  
  // Add to beginning
  this.recentlyViewed.unshift({ productId, viewedAt: new Date() });
  
  // Keep only last 20 items
  if (this.recentlyViewed.length > 20) {
    this.recentlyViewed = this.recentlyViewed.slice(0, 20);
  }
  
  return this.save();
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  if (!this.referralCode) {
    const code = `${this.fullName.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
    this.referralCode = code;
  }
  return this.referralCode;
};

// Check if user is eligible for loyalty rewards
userSchema.methods.isEligibleForRewards = function() {
  return this.loyaltyPoints >= 100 && this.purchaseStats.totalOrders >= 3;
};

// Pre-save middleware to update lastActive
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('lastActive')) {
    this.lastActive = new Date();
  }
  next();
});

// Static method to find user by email or mobile
userSchema.statics.findByEmailOrMobile = function(identifier) {
  const isEmail = identifier.includes('@');
  const isMobile = /^[6-9]\d{9}$/.test(identifier);
  
  if (isEmail) {
    return this.findOne({ email: identifier.toLowerCase() });
  } else if (isMobile) {
    return this.findOne({ mobile: identifier });
  } else {
    return null;
  }
};

// Static method to create user with Google OAuth
userSchema.statics.createGoogleUser = async function(googleData) {
  const { googleId, email, fullName, profilePicture, email_verified } = googleData;
  
  const userData = {
    fullName,
    email: email.toLowerCase(),
    googleId,
    profilePicture,
    authProvider: 'google',
    isEmailVerified: email_verified,
    registrationSource: 'website'
  };
  
  return this.create(userData);
};

// Ecommerce-specific static methods
// Find users by customer tier
userSchema.statics.findByCustomerTier = function(tier) {
  return this.find({ customerTier: tier, isActive: true });
};

// Find users by city for delivery analytics
userSchema.statics.findByCity = function(city) {
  return this.find({ 
    'addresses.city': { $regex: new RegExp(city, 'i') },
    'addresses.isActive': true,
    isActive: true 
  });
};

// Find users with pending loyalty rewards
userSchema.statics.findEligibleForRewards = function() {
  return this.find({
    loyaltyPoints: { $gte: 100 },
    'purchaseStats.totalOrders': { $gte: 3 },
    isActive: true
  });
};

// Get user analytics for dashboard
userSchema.statics.getUserAnalytics = async function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        totalSpent: { $sum: '$purchaseStats.totalSpent' },
        avgOrdersPerUser: { $avg: '$purchaseStats.totalOrders' },
        tierDistribution: {
          $push: '$customerTier'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        totalSpent: 1,
        avgOrdersPerUser: { $round: ['$avgOrdersPerUser', 2] },
        tierCounts: {
          bronze: { $size: { $filter: { input: '$tierDistribution', cond: { $eq: ['$$this', 'bronze'] } } } },
          silver: { $size: { $filter: { input: '$tierDistribution', cond: { $eq: ['$$this', 'silver'] } } } },
          gold: { $size: { $filter: { input: '$tierDistribution', cond: { $eq: ['$$this', 'gold'] } } } },
          platinum: { $size: { $filter: { input: '$tierDistribution', cond: { $eq: ['$$this', 'platinum'] } } } },
          diamond: { $size: { $filter: { input: '$tierDistribution', cond: { $eq: ['$$this', 'diamond'] } } } }
        }
      }
    }
  ]);
};

// Find high-value customers
userSchema.statics.findHighValueCustomers = function(minSpent = 25000) {
  return this.find({
    'purchaseStats.totalSpent': { $gte: minSpent },
    isActive: true
  }).sort({ 'purchaseStats.totalSpent': -1 });
};

// Find users by referral code
userSchema.statics.findByReferralCode = function(code) {
  return this.findOne({ referralCode: code, isActive: true });
};

const User = mongoose.model("User", userSchema);
module.exports = User;