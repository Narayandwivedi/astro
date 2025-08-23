const Service = require('../models/Service');

// Get all services (with optional category filter)
const getAllServices = async (req, res) => {
  try {
    const { 
      category = 'all', 
      enabled = 'true',
      popular,
      page = 1,
      limit = 50,
      sort = 'sortOrder'
    } = req.query;

    let query = {};
    
    // Filter by enabled status
    if (enabled !== 'all') {
      query.isEnabled = enabled === 'true';
    }
    
    // Filter by category
    if (category !== 'all') {
      query.category = category;
    }
    
    // Filter by popular
    if (popular === 'true') {
      query.isPopular = true;
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
        sortOptions = { bookingCount: -1, rating: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { sortOrder: 1, createdAt: -1 };
    }

    const services = await Service.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get service by ID or slug
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ID first, then by slug
    let service = await Service.findById(id);
    if (!service) {
      service = await Service.findOne({ slug: id });
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Create new service (Admin only)
const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
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
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Update service (Admin only)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const service = await Service.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
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
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete service (Admin only)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// Enable/Disable service (Admin only)
const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    service.isEnabled = enabled;
    await service.save();
    
    res.json({
      success: true,
      message: `Service ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service status',
      error: error.message
    });
  }
};

// Get popular services for homepage
const getPopularServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const services = await Service.getPopularServices(parseInt(limit));
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular services',
      error: error.message
    });
  }
};

// Get service categories
const getServiceCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isEnabled: true });
    
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

// Increment booking count (when someone books)
const incrementBookingCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    await service.incrementBookingCount();
    
    res.json({
      success: true,
      message: 'Booking count updated',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking count',
      error: error.message
    });
  }
};

// Bulk update sort order (Admin only)
const updateSortOrder = async (req, res) => {
  try {
    const { services } = req.body; // Array of {id, sortOrder}
    
    const updatePromises = services.map(({ id, sortOrder }) =>
      Service.findByIdAndUpdate(id, { sortOrder })
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

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getPopularServices,
  getServiceCategories,
  incrementBookingCount,
  updateSortOrder
};