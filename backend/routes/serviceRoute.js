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
  getServiceCategories
} = require('../controllers/serviceController');

// Public routes (no authentication required)
router.get('/', getAllServices);
router.get('/popular', getPopularServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);

// Admin routes (simplified for development)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.put('/:id/toggle', toggleServiceStatus);

module.exports = router;