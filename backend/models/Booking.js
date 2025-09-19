const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Service Information
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false // Allow null for general consultations
  },
  serviceName: {
    type: String,
    required: true
  },
  servicePrice: {
    type: Number,
    required: true
  },
  
  // User Association (for authenticated users)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for guest bookings
  },
  
  // Customer Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  
  // Birth Details (for astrology)
  birthDate: {
    type: Date
  },
  birthTime: {
    type: String
  },
  birthState: {
    type: String,
    trim: true
  },
  birthCity: {
    type: String,
    trim: true
  },
  
  // Booking Preferences
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    required: true,
    enum: ['phone', 'video', 'inperson'],
    default: 'phone'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    trim: true
  },
  
  // Confirmation Details
  confirmedDate: {
    type: Date
  },
  confirmedTime: {
    type: String
  },
  meetingLink: {
    type: String
  },
  
  // Communication
  lastContactedAt: {
    type: Date
  },
  communicationHistory: [{
    type: {
      type: String,
      enum: ['call', 'email', 'sms', 'whatsapp'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: String,
      default: 'system'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ status: 1, preferredDate: 1 });
bookingSchema.index({ mobile: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for booking ID display
bookingSchema.virtual('bookingId').get(function() {
  return `BK${this._id.toString().slice(-6).toUpperCase()}`;
});

// Static method to get bookings by status
bookingSchema.statics.getByStatus = function(status = 'pending') {
  return this.find({ status })
    .populate('serviceId', 'titleEn titleHi category icon')
    .sort({ preferredDate: 1, preferredTime: 1 });
};

// Static method to get bookings for today
bookingSchema.statics.getTodayBookings = function() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  return this.find({
    preferredDate: {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: { $ne: 'cancelled' }
  }).populate('serviceId', 'titleEn titleHi category icon')
    .sort({ preferredTime: 1 });
};

// Instance method to add communication history
bookingSchema.methods.addCommunication = function(type, message, sentBy = 'system') {
  this.communicationHistory.push({
    type,
    message,
    sentBy
  });
  this.lastContactedAt = new Date();
  return this.save();
};

// Instance method to confirm booking
bookingSchema.methods.confirmBooking = function(confirmedDate, confirmedTime, meetingLink = null) {
  this.status = 'confirmed';
  this.confirmedDate = confirmedDate;
  this.confirmedTime = confirmedTime;
  if (meetingLink) {
    this.meetingLink = meetingLink;
  }
  return this.save();
};

// Pre-save middleware to format mobile number
bookingSchema.pre('save', function(next) {
  if (this.mobile) {
    // Remove any non-digit characters and ensure 10 digits
    this.mobile = this.mobile.replace(/\D/g, '').slice(-10);
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;