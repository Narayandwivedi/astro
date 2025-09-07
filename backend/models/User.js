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
  
  // Communication Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    language: { type: String, enum: ['english', 'hindi'], default: 'english' }
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
  
  // Password Reset
  resetOtp: String,
  otpExpiresAt: Date,
  
  // Account creation metadata
  registrationSource: {
    type: String,
    enum: ['website', 'mobile_app', 'referral'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String
},{timestamps:true});

// Indexes for better performance
// Note: email and mobile indexes are automatically created by unique: true
// Note: googleId index seems to be automatically created (removing manual index to avoid duplicate)
userSchema.index({ createdAt: -1 });

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

const User = mongoose.model("User", userSchema);
module.exports = User;