const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/blogController");

// Public routes (no authentication required)
router.get("/published", getPublishedBlogs); // Get published blogs for frontend
router.get("/published/:slug", getPublishedBlogBySlug); // Get single published blog by slug
router.post("/:id/like", toggleBlogLike); // Like/Unlike blog

// Admin routes (require admin authentication)
router.get("/", getAllBlogs); // Get all blogs with admin filters
router.get("/stats", getBlogStats); // Get blog statistics
router.get("/:id", getBlogById); // Get single blog by ID (admin)
router.post("/", createBlog); // Create new blog
router.post("/auto-save", autoSaveBlog); // Auto-save blog draft
router.put("/:id", updateBlog); // Update blog
router.delete("/:id", deleteBlog); // Delete blog

module.exports = router;