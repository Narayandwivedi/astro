const Blog = require("../models/Blog");
const mongoose = require("mongoose");

// ==================== HELPER FUNCTIONS ====================

// Helper function to convert text to title case
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Generate a clean slug from title (uses full title, supports Unicode)
function generateSlug(title) {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Support Unicode characters (Hindi, Arabic, Chinese, etc.) along with English
  // Note: We only lowercase ASCII characters to preserve Hindi/Devanagari script integrity
  let slug = title
    .trim()
    // Only lowercase ASCII characters (a-z, A-Z), preserve Unicode characters as-is
    .replace(/[A-Z]/g, char => char.toLowerCase())
    // Keep Unicode letters, numbers, combining marks (essential for Hindi/Devanagari), spaces, and hyphens
    // \p{L} = Unicode letters, \p{N} = Unicode numbers, \p{M} = Unicode marks (matras, diacritics)
    // Remove only special symbols like !@#$%^&*()+={}[]|\\:;"'<>,.?/
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

  return slug;
}

// Generate excerpt from content (max 180 words)
function generateExcerpt(content, maxWords = 180) {
  if (!content) return '';

  const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const words = plainText.split(' ');

  if (words.length <= maxWords) {
    return plainText;
  }

  return words.slice(0, maxWords).join(' ') + '...';
}

// Generate meta description (max 160 chars)
function generateMetaDescription(text, maxChars = 160) {
  if (!text) return '';

  if (text.length <= maxChars) {
    return text;
  }

  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace > 0 ? lastSpace : maxChars) + '...';
}

// Calculate reading time based on content
function calculateReadTime(content) {
  if (!content) return 1;

  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
}

// ==================== CONTROLLER FUNCTIONS ====================

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      author,
      category,
      tags,
      featuredImage,
      featuredImageAlt,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title must be a valid string",
      });
    }

    if (typeof content !== "string" || content.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 50 characters long",
      });
    }

    // Process title and content
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    // Handle slug - use manual slug if provided, otherwise auto-generate
    let finalSlug;
    if (slug && slug.trim()) {
      // Manual slug provided - clean it
      finalSlug = generateSlug(slug.trim());
    } else {
      // Auto-generate from title
      finalSlug = generateSlug(cleanTitle);
    }

    // Validate slug is not empty
    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug cannot be empty. Please provide a valid title or slug.",
      });
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: finalSlug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: `A blog with slug "${finalSlug}" already exists. Please use a different slug.`,
      });
    }

    // Auto-generate excerpt if not provided
    const finalExcerpt = excerpt && excerpt.trim()
      ? excerpt.trim()
      : generateExcerpt(cleanContent);

    // Validate excerpt length (max 2000 chars for ~180 words)
    if (finalExcerpt.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Excerpt must be less than 2000 characters (approximately 180 words)",
      });
    }

    // Auto-generate metaDescription if not provided (ensure max 160 chars)
    const finalMetaDescription = metaDescription && metaDescription.trim()
      ? generateMetaDescription(metaDescription.trim())
      : generateMetaDescription(finalExcerpt);

    // Calculate reading time
    const readTime = calculateReadTime(cleanContent);

    // Set publishedAt if status is published
    const publishedAt = status === 'published' ? new Date() : null;

    // Create new blog
    const newBlog = new Blog({
      title: cleanTitle,
      slug: finalSlug,
      content: cleanContent,
      excerpt: finalExcerpt,
      author: author || "Admin",
      category: category || "general",
      tags: tags || [],
      featuredImage: featuredImage || "",
      featuredImageAlt: featuredImageAlt || "",
      status: status || "draft",
      metaTitle: metaTitle || cleanTitle,
      metaDescription: finalMetaDescription,
      readTime: readTime,
      publishedAt: publishedAt,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// Get all blogs with pagination and filtering
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      author,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content"); // Exclude content for list view

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBlogs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get published blogs for frontend
const getPublishedBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured = false,
    } = req.query;

    // Build filter object
    const filter = { status: "published" };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // For featured blogs, limit to 5 most recent
    const actualLimit = featured === "true" ? 5 : parseInt(limit);
    const skip = featured === "true" ? 0 : (parseInt(page) - 1) * parseInt(limit);

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(actualLimit)
      .select("title excerpt author category tags featuredImage featuredImageAlt slug publishedAt readTime views likes createdAt updatedAt");

    // Get total count for pagination (only for non-featured)
    let pagination = null;
    if (featured !== "true") {
      const totalBlogs = await Blog.countDocuments(filter);
      const totalPages = Math.ceil(totalBlogs / parseInt(limit));
      
      pagination = {
        currentPage: parseInt(page),
        totalPages,
        totalBlogs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };
    }

    res.status(200).json({
      success: true,
      blogs,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching published blogs",
      error: error.message,
    });
  }
};

// Get single blog by ID or slug
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    } else {
      // Treat as slug
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Get single published blog by slug (for frontend)
const getPublishedBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: "published" });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching published blog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Validate update data
    if (updateData.title && typeof updateData.title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Title must be a valid string",
      });
    }

    if (updateData.content && typeof updateData.content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content must be a valid string",
      });
    }

    if (updateData.excerpt && updateData.excerpt.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Excerpt must be less than 2000 characters",
      });
    }

    // Handle title update
    if (updateData.title) {
      updateData.title = updateData.title.trim();
    }

    // Handle slug update
    if (updateData.slug !== undefined) {
      // Manual slug update or modification
      if (updateData.slug && updateData.slug.trim()) {
        const newSlug = generateSlug(updateData.slug.trim());

        // Check if slug already exists (excluding current blog)
        const duplicateSlug = await Blog.findOne({
          slug: newSlug,
          _id: { $ne: id }
        });

        if (duplicateSlug) {
          return res.status(400).json({
            success: false,
            message: `A blog with slug "${newSlug}" already exists. Please use a different slug.`,
          });
        }

        updateData.slug = newSlug;
      } else {
        return res.status(400).json({
          success: false,
          message: "Slug cannot be empty.",
        });
      }
    } else if (updateData.title && !updateData.slug) {
      // Title updated but slug not provided - auto-generate from new title
      const newSlug = generateSlug(updateData.title);

      // Check if slug already exists (excluding current blog)
      const duplicateSlug = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: id }
      });

      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: `A blog with slug "${newSlug}" (auto-generated from title) already exists. Please manually set a different slug.`,
        });
      }

      updateData.slug = newSlug;
    }

    // Update content
    if (updateData.content) {
      updateData.content = updateData.content.trim();

      // Auto-generate excerpt if not provided
      if (!updateData.excerpt || updateData.excerpt.trim() === '') {
        updateData.excerpt = generateExcerpt(updateData.content);
      }

      // Calculate reading time
      updateData.readTime = calculateReadTime(updateData.content);
    }

    // Handle excerpt
    if (updateData.excerpt) {
      updateData.excerpt = updateData.excerpt.trim();

      // Auto-generate metaDescription if not provided
      if (!updateData.metaDescription || updateData.metaDescription.trim() === '') {
        updateData.metaDescription = generateMetaDescription(updateData.excerpt);
      }
    }

    // Handle metaDescription
    if (updateData.metaDescription) {
      updateData.metaDescription = generateMetaDescription(updateData.metaDescription.trim());
    }

    // Set publishedAt when status changes to published
    if (updateData.status === 'published' && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Like/Unlike blog
const toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    let updateOperation;
    if (action === "like") {
      updateOperation = { $inc: { likes: 1 } };
    } else if (action === "unlike") {
      updateOperation = { $inc: { likes: -1 } };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'like' or 'unlike'",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Blog ${action}d successfully`,
      likes: updatedBlog.likes,
    });
  } catch (error) {
    console.error("Error toggling blog like:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog likes",
      error: error.message,
    });
  }
};

// Get blog statistics
const getBlogStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] }
          },
          draftBlogs: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] }
          },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
        }
      }
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
      },
      categoryStats,
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
      error: error.message,
    });
  }
};

// Auto-save blog draft
const autoSaveBlog = async (req, res) => {
  try {
    const {
      blogId,
      title,
      slug,
      content,
      excerpt,
      author,
      category,
      tags,
      featuredImage,
      featuredImageAlt,
      metaTitle,
      metaDescription,
    } = req.body;

    const blogTitle = title && title.trim() ? title.trim() : 'Untitled Draft';
    const blogContent = content && content.trim() ? content.trim() : '';
    const processedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);

    // Auto-generate excerpt if not provided
    const finalExcerpt = excerpt && excerpt.trim()
      ? excerpt.trim()
      : (blogContent ? generateExcerpt(blogContent) : '');

    // Auto-generate metaDescription
    const finalMetaDescription = metaDescription && metaDescription.trim()
      ? generateMetaDescription(metaDescription.trim())
      : (finalExcerpt ? generateMetaDescription(finalExcerpt) : '');

    // Calculate reading time
    const readTime = blogContent ? calculateReadTime(blogContent) : 1;

    // If blogId exists, update existing draft
    if (blogId && mongoose.isValidObjectId(blogId)) {
      const updateFields = {
        title: blogTitle,
        content: blogContent,
        excerpt: finalExcerpt,
        author: author || 'Admin',
        category: category || 'general',
        tags: processedTags,
        featuredImage: featuredImage || '',
        featuredImageAlt: featuredImageAlt || '',
        metaTitle: metaTitle || blogTitle,
        metaDescription: finalMetaDescription,
        readTime: readTime,
        status: 'draft', // Always save as draft for auto-save
        autoSaved: true,
        lastSaved: new Date(),
        isDraft: true,
      };

      // Only update slug if provided
      if (slug && slug.trim()) {
        updateFields.slug = generateSlug(slug.trim());
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        updateFields,
        { new: true, runValidators: false } // Skip validation for auto-save
      );

      if (!updatedBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog auto-saved successfully",
        blogId: updatedBlog._id,
        slug: updatedBlog.slug,
        lastSaved: updatedBlog.lastSaved,
      });
    } else {
      // Create new draft blog with unique slug using timestamp
      const baseSlug = slug && slug.trim()
        ? generateSlug(slug.trim())
        : generateSlug(blogTitle);
      const uniqueSlug = baseSlug ? `${baseSlug}-draft-${Date.now()}` : `draft-${Date.now()}`;

      const newBlog = new Blog({
        title: blogTitle,
        content: blogContent,
        excerpt: finalExcerpt,
        author: author || 'Admin',
        category: category || 'general',
        tags: processedTags,
        featuredImage: featuredImage || '',
        featuredImageAlt: featuredImageAlt || '',
        metaTitle: metaTitle || blogTitle,
        metaDescription: finalMetaDescription,
        slug: uniqueSlug,
        readTime: readTime,
        status: 'draft',
        autoSaved: true,
        lastSaved: new Date(),
        isDraft: true,
      });

      const savedBlog = await newBlog.save();

      return res.status(201).json({
        success: true,
        message: "New blog draft created and auto-saved",
        blogId: savedBlog._id,
        slug: savedBlog.slug,
        lastSaved: savedBlog.lastSaved,
      });
    }
  } catch (error) {
    console.error("Error auto-saving blog:", error);
    res.status(500).json({
      success: false,
      message: "Error auto-saving blog",
      error: error.message,
    });
  }
};

// Generate slug from title (utility endpoint)
const generateSlugFromTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const slug = generateSlug(title.trim());

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });

    res.status(200).json({
      success: true,
      slug: slug,
      exists: !!existingBlog,
      message: existingBlog ? "This slug already exists" : "Slug is available",
    });
  } catch (error) {
    console.error("Error generating slug:", error);
    res.status(500).json({
      success: false,
      message: "Error generating slug",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getPublishedBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleBlogLike,
  getBlogStats,
  autoSaveBlog,
  generateSlugFromTitle,
};