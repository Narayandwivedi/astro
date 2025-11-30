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
    enum: ["astrology", "spirituality", "wellness", "general"],
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

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate reading time based on content length
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }

  // Auto-generate excerpt if not provided (max 180 words)
  if ((!this.excerpt || this.excerpt.trim() === '') && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = plainText.split(' ');

    if (words.length <= 180) {
      this.excerpt = plainText;
    } else {
      this.excerpt = words.slice(0, 180).join(' ') + '...';
    }
  }

  // Auto-generate metaDescription if not provided (max 160 chars)
  if ((!this.metaDescription || this.metaDescription.trim() === '') && this.excerpt) {
    if (this.excerpt.length <= 160) {
      this.metaDescription = this.excerpt;
    } else {
      const truncated = this.excerpt.substring(0, 160);
      const lastSpace = truncated.lastIndexOf(' ');
      this.metaDescription = truncated.substring(0, lastSpace > 0 ? lastSpace : 160) + '...';
    }
  } else if (this.metaDescription && this.metaDescription.length > 160) {
    // Truncate if metaDescription exceeds limit
    const truncated = this.metaDescription.substring(0, 160);
    const lastSpace = truncated.lastIndexOf(' ');
    this.metaDescription = truncated.substring(0, lastSpace > 0 ? lastSpace : 160) + '...';
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;