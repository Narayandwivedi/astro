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
  format: 'webp',    // Modern format with better compression
  enableProcessing: false  // Set to false to skip Sharp processing
};

// Helper function to process and convert image to WebP
const processImage = async (inputPath, outputPath) => {
  console.log('Processing image:');
  console.log('- Input path:', inputPath);
  console.log('- Output path:', outputPath);
  
  try {
    // Ensure input and output paths are different
    if (path.resolve(inputPath) === path.resolve(outputPath)) {
      console.error('Path conflict: Input and output paths are the same');
      throw new Error('Input and output paths cannot be the same');
    }

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file does not exist:', inputPath);
      throw new Error('Input file does not exist');
    }

    // Get file stats for logging
    const inputStats = fs.statSync(inputPath);
    console.log('- Input file size:', inputStats.size, 'bytes');

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      console.log('Creating output directory:', outputDir);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Starting Sharp processing...');
    
    // First, let's get image info to see if Sharp can read the file
    const metadata = await sharp(inputPath).metadata();
    console.log('Input image metadata:', metadata);

    await sharp(inputPath)
      .resize(PRODUCT_IMAGE_CONFIG.width, PRODUCT_IMAGE_CONFIG.height, {
        fit: 'cover',        // Crop to fit dimensions
        position: 'center'   // Center the crop
      })
      .webp({ 
        quality: PRODUCT_IMAGE_CONFIG.quality,
        effort: 3           // Reduced effort for faster processing
      })
      .toFile(outputPath);
    
    console.log('Sharp processing completed successfully');

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const outputStats = fs.statSync(outputPath);
    console.log('- Output file size:', outputStats.size, 'bytes');
    
    // Delete the original file after successful processing
    if (fs.existsSync(inputPath)) {
      console.log('Removing original file:', inputPath);
      fs.unlinkSync(inputPath);
    }
    
    console.log('Image processing completed successfully');
    return true;
  } catch (error) {
    console.error('Image processing error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      inputPath,
      outputPath
    });
    
    // Clean up output file if it was created but processing failed
    if (fs.existsSync(outputPath)) {
      try {
        console.log('Cleaning up failed output file:', outputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error('Error cleaning up failed output file:', cleanupError);
      }
    }
    
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
      console.log('Upload processing started for file:', req.file);
      console.log('File details:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Create output filename - use original name but ensure it's different from input
      const inputFilename = req.file.filename;
      const baseName = path.parse(inputFilename).name;
      const finalWebpFilename = `${baseName}.webp`; // This will be our final filename
      const inputPath = req.file.path;
      
      // If input is already .webp, we need a different temp name during processing
      let outputPath;
      if (inputFilename.endsWith('.webp')) {
        // Input is webp, use temp name then rename
        const tempFilename = `${baseName}-temp.webp`;
        outputPath = path.join(productImagesDir, tempFilename);
      } else {
        // Input is not webp, can use final name directly
        outputPath = path.join(productImagesDir, finalWebpFilename);
      }

      console.log('Path generation:');
      console.log('- Input filename:', inputFilename);
      console.log('- Base name:', baseName);
      console.log('- Final WebP filename:', finalWebpFilename);
      console.log('- Input path:', inputPath);
      console.log('- Output path:', outputPath);
      console.log('- Product images dir:', productImagesDir);

      // Ensure the paths are different (extra safety check)
      if (path.resolve(inputPath) === path.resolve(outputPath)) {
        console.error('Path conflict detected!');
        const uniqueWebpFilename = `${originalName}-${timestamp}.webp`;
        const uniqueOutputPath = path.join(productImagesDir, uniqueWebpFilename);
        console.log('Would use unique path:', uniqueOutputPath);
        return res.status(500).json({
          success: false,
          message: 'Internal error: Input and output paths conflict. Please try again.'
        });
      }

      // Check if processing is enabled
      if (!PRODUCT_IMAGE_CONFIG.enableProcessing) {
        console.log('Sharp processing disabled, using original file');
        const stats = fs.statSync(inputPath);
        const imageUrl = `images/products/${inputFilename}`;
        
        return res.json({
          success: true,
          message: 'Image uploaded successfully (processing disabled)',
          data: {
            url: imageUrl,
            filename: inputFilename,
            originalName: req.file.originalname,
            size: stats.size,
            dimensions: 'original',
            format: path.extname(inputFilename).substring(1),
            uploadedAt: new Date()
          }
        });
      }

      // Process and convert image to WebP
      console.log('About to process image with Sharp...');
      const processed = await processImage(inputPath, outputPath);
      console.log('Sharp processing result:', processed);
      
      if (!processed) {
        console.error('Sharp processing failed, but upload was successful');
        // Check if original file exists and use it as fallback
        if (fs.existsSync(inputPath)) {
          console.log('Using original file as fallback');
          const stats = fs.statSync(inputPath);
          const imageUrl = `images/products/${inputFilename}`;
          
          return res.json({
            success: true,
            message: 'Image uploaded successfully (original format preserved)',
            data: {
              url: imageUrl,
              filename: inputFilename,
              originalName: req.file.originalname,
              size: stats.size,
              dimensions: 'original',
              format: path.extname(inputFilename).substring(1),
              uploadedAt: new Date()
            }
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'Failed to process image. Please try again.'
        });
      }

      // If we used a temp file, rename it to the final filename
      let finalPath = outputPath;
      if (inputFilename.endsWith('.webp') && outputPath.includes('-temp.webp')) {
        const finalOutputPath = path.join(productImagesDir, finalWebpFilename);
        fs.renameSync(outputPath, finalOutputPath);
        finalPath = finalOutputPath;
        console.log('Renamed temp file to final path:', finalOutputPath);
      }

      // Get file stats for the processed image
      const stats = fs.statSync(finalPath);

      // Generate reference path for the uploaded file (store relative path only)
      const imageUrl = `images/products/${finalWebpFilename}`;

      res.json({
        success: true,
        message: 'Image uploaded and processed successfully',
        data: {
          url: imageUrl,
          filename: finalWebpFilename,
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
        const timestamp = Date.now() + Math.random(); // Add randomness for uniqueness
        const webpFilename = `${originalName}-processed.webp`; // Add suffix to ensure different name
        const inputPath = file.path;
        const outputPath = path.join(productImagesDir, webpFilename);

        // Skip if paths are the same (safety check)
        if (path.resolve(inputPath) === path.resolve(outputPath)) {
          console.warn('Skipping file due to path conflict:', file.filename);
          continue;
        }

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