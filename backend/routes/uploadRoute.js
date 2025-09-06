const express = require('express');
const router = express.Router();
const {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  getImageInfo
} = require('../controllers/uploadController');

// Upload single product image
router.post('/product/image', uploadProductImage);

// Upload multiple product images
router.post('/product/images', uploadProductImages);

// Delete product image
router.delete('/product/image/:filename', deleteProductImage);

// Get image info
router.get('/product/image/:filename', getImageInfo);

module.exports = router;