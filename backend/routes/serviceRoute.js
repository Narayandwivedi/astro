const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/serviceController');

// Public routes (no authentication required)
router.get('/', getAllServices);
router.get('/popular', getPopularServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);
router.post('/:id/book', incrementBookingCount); // When someone books a service

// Admin routes (authentication would be added here in production)
// For now, these are open but in production you'd add middleware like:
// router.use('/admin', authenticateAdmin);

// Admin CRUD operations
router.post('/admin/create', createService);
router.put('/admin/:id', updateService);
router.delete('/admin/:id', deleteService);
router.patch('/admin/:id/status', toggleServiceStatus);
router.patch('/admin/sort-order', updateSortOrder);

module.exports = router;