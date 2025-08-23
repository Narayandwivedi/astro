const Product = require('../models/Product');

// Get all products (with filters)
const getAllProducts = async (req, res) => {
  try {
    const { 
      category = 'all', 
      enabled = 'true',
      inStock = 'true',
      featured,
      search,
      page = 1,
      limit = 20,
      sort = 'sortOrder',
      minPrice,
      maxPrice
    } = req.query;

    let query = {};
    
    // Filter by enabled status
    if (enabled !== 'all') {
      query.isEnabled = enabled === 'true';
    }
    
    // Filter by stock status
    if (inStock !== 'all') {
      query.inStock = inStock === 'true';
    }
    
    // Filter by category
    if (category !== 'all') {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search functionality
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { nameEn: regex },
        { nameHi: regex },
        { descriptionEn: regex },
        { descriptionHi: regex },
        { tags: { $in: [regex] } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    let sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { salesCount: -1, rating: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { sortOrder: 1, createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get product by ID or slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ID first, then by slug
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id });
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViewCount();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Toggle product status (Admin only)
const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    product.isEnabled = enabled;
    await product.save();
    
    res.json({
      success: true,
      message: `Product ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
      error: error.message
    });
  }
};

// Get featured products for homepage
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const products = await Product.getFeaturedProducts(parseInt(limit));
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

// Get product categories
const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isEnabled: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Track product purchase (when someone buys via WhatsApp)
const trackPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment sales count
    await product.incrementSalesCount();
    
    // Update stock if quantity is provided
    if (quantity > 0) {
      await product.updateStock(quantity);
    }
    
    res.json({
      success: true,
      message: 'Purchase tracked successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track purchase',
      error: error.message
    });
  }
};

// Update stock (Admin only)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity, inStock } = req.body;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (stockQuantity !== undefined) {
      product.stockQuantity = stockQuantity;
    }
    
    if (inStock !== undefined) {
      product.inStock = inStock;
    }
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// Bulk update sort order (Admin only)
const updateSortOrder = async (req, res) => {
  try {
    const { products } = req.body; // Array of {id, sortOrder}
    
    const updatePromises = products.map(({ id, sortOrder }) =>
      Product.findByIdAndUpdate(id, { sortOrder })
    );
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Sort order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update sort order',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.searchProducts(q, { 
      category, 
      inStock: true 
    })
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Product.searchProducts(q, { 
      category, 
      inStock: true 
    }).countDocuments();
    
    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getFeaturedProducts,
  getProductCategories,
  trackPurchase,
  updateStock,
  updateSortOrder,
  searchProducts
};