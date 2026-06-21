const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: false,
    maxlength: 2000, // Allow up to 180 words (approx 900-1800 chars)
    default: '',
  },
  author: {
    type: String,
    required: true,
    default: "Admin",
  },
  category: {
    type: String,
    required: true,
    enum: ["astrology", "spirituality", "wellness", "general", "vastu"],
    default: "general",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    type: String, // URL to the featured image
  },
  featuredImageAlt: {
    type: String,
    default: '',
    maxlength: 125, // Standard alt text length limit
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  metaTitle: {
    type: String,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    maxlength: 160,
  },
  publishedAt: {
    type: Date,
  },
  // Auto-save fields
  autoSaved: {
    type: Boolean,
    default: false,
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
  readTime: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;