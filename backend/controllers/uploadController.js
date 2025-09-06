const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {
  uploadSingleProduct,
  uploadMultipleProducts,
  uploadSingleService,
  uploadMultipleServices,
  productImagesDir,
  serviceImagesDir
} = require('../utils/multer');

// Image processing configuration for ecommerce products
const PRODUCT_IMAGE_CONFIG = {
  width: 800,        // Standard ecommerce product image width
  height: 800,       // Square aspect ratio for consistency
  quality: 85,       // Good quality with reasonable file size
  format: 'webp'     // Modern format with better compression
};

// Helper function to process and convert image to WebP
const processImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(PRODUCT_IMAGE_CONFIG.width, PRODUCT_IMAGE_CONFIG.height, {
        fit: 'cover',        // Crop to fit dimensions
        position: 'center'   // Center the crop
      })
      .webp({ 
        quality: PRODUCT_IMAGE_CONFIG.quality,
        effort: 6           // Higher effort for better compression
      })
      .toFile(outputPath);
    
    // Delete the original file after processing
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    return true;
  } catch (error) {
    console.error('Image processing error:', error);
    // If processing fails, keep the original file
    return false;
  }
};

// Upload single product image
const uploadProductImage = (req, res) => {
  uploadSingleProduct(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Upload error: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      // Create WebP filename
      const originalName = path.parse(req.file.filename).name;
      const webpFilename = `${originalName}.webp`;
      const inputPath = req.file.path;
      const outputPath = path.join(productImagesDir, webpFilename);

      // Process and convert image to WebP
      const processed = await processImage(inputPath, outputPath);
      
      if (!processed) {
        return res.status(500).json({
          success: false,
          message: 'Failed to process image. Please try again.'
        });
      }

      // Get file stats for the processed image
      const stats = fs.statSync(outputPath);

      // Generate reference path for the uploaded file (store relative path only)
      const imageUrl = `images/products/${webpFilename}`;

      res.json({
        success: true,
        message: 'Image uploaded and processed successfully',
        data: {
          url: imageUrl,
          filename: webpFilename,
          originalName: req.file.originalname,
          size: stats.size,
          dimensions: `${PRODUCT_IMAGE_CONFIG.width}x${PRODUCT_IMAGE_CONFIG.height}`,
          format: 'webp',
          uploadedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process uploaded image'
      });
    }
  });
};

// Upload multiple product images
const uploadProductImages = (req, res) => {
  uploadMultipleProducts(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB per file.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 images allowed.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Upload error: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    try {
      const processedImages = [];
      
      // Process each uploaded image
      for (const file of req.files) {
        const originalName = path.parse(file.filename).name;
        const webpFilename = `${originalName}.webp`;
        const inputPath = file.path;
        const outputPath = path.join(productImagesDir, webpFilename);

        // Process and convert image to WebP
        const processed = await processImage(inputPath, outputPath);
        
        if (processed) {
          const stats = fs.statSync(outputPath);
          processedImages.push({
            url: `images/products/${webpFilename}`,
            filename: webpFilename,
            originalName: file.originalname,
            size: stats.size,
            dimensions: `${PRODUCT_IMAGE_CONFIG.width}x${PRODUCT_IMAGE_CONFIG.height}`,
            format: 'webp',
            uploadedAt: new Date()
          });
        }
      }

      if (processedImages.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to process any images. Please try again.'
        });
      }

      res.json({
        success: true,
        message: `${processedImages.length} images uploaded and processed successfully`,
        data: processedImages
      });
    } catch (error) {
      console.error('Multiple upload processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process uploaded images'
      });
    }
  });
};

// Delete uploaded image
const deleteProductImage = (req, res) => {
  const { filename } = req.params;
  
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Filename is required'
    });
  }

  const filePath = path.join(productImagesDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  try {
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image: ' + error.message
    });
  }
};

// Get uploaded image info
const getImageInfo = (req, res) => {
  const { filename } = req.params;
  
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Filename is required'
    });
  }

  const filePath = path.join(productImagesDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  try {
    const stats = fs.statSync(filePath);
    const imageUrl = `images/products/${filename}`;
    
    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting image info: ' + error.message
    });
  }
};

module.exports = {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  getImageInfo
};