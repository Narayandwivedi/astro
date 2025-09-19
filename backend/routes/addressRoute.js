const express = require('express');
const router = express.Router();
const {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
} = require('../controllers/addressController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/addresses - Get all addresses for authenticated user
router.get('/', getUserAddresses);

// GET /api/addresses/default - Get default address
router.get('/default', getDefaultAddress);

// GET /api/addresses/:id - Get specific address by ID
router.get('/:id', getAddressById);

// POST /api/addresses - Create new address
router.post('/', createAddress);

// PUT /api/addresses/:id - Update address
router.put('/:id', updateAddress);

// PUT /api/addresses/:id/default - Set address as default
router.put('/:id/default', setDefaultAddress);

// DELETE /api/addresses/:id - Delete address (soft delete)
router.delete('/:id', deleteAddress);

module.exports = router;