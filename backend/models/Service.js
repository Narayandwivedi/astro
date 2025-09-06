const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // Basic Service Info
  titleEn: {
    type: String,
    required: true,
    trim: true
  },
  titleHi: {
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
  hindiDesc: {
    type: String,
    required: true,
    trim: true
  },
  
  // Pricing & Details
  price: {
    type: Number,
    required: true,
    min: 0
  },
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
    required: true
  },
  
  // Optional Features
  features: [{
    type: String,
    trim: true
  }],
  hindiFeatures: [{
    type: String,
    trim: true
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get services by category
serviceSchema.statics.getByCategory = function(category = 'all') {
  const query = { isActive: true };
  if (category !== 'all') {
    query.category = category;
  }
  return this.find(query).sort({ createdAt: -1 });
};

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;