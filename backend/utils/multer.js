const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const productImagesDir = path.join(uploadsDir, 'products');
const serviceImagesDir = path.join(uploadsDir, 'services');

const createDirectories = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  if (!fs.existsSync(productImagesDir)) {
    fs.mkdirSync(productImagesDir, { recursive: true });
  }
  
  if (!fs.existsSync(serviceImagesDir)) {
    fs.mkdirSync(serviceImagesDir, { recursive: true });
  }
};

// Initialize directories
createDirectories();

// Storage configuration for products
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = 'product-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Storage configuration for services
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serviceImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = 'service-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  console.log('File filter check:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  const extname = allowedExtensions.test(file.originalname.toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  console.log('Validation results:', {
    extname: extname,
    mimetype: mimetype,
    actualMimetype: file.mimetype
  });

  if (mimetype && extname) {
    console.log('File validation passed');
    return cb(null, true);
  } else {
    console.log('File validation failed');
    cb(new Error(`Only image files are allowed (jpeg, jpg, png, gif, webp). Received: ${file.mimetype}`));
  }
};

// Multer configuration for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit - better for web performance
  },
  fileFilter: imageFilter
});

// Multer configuration for services
const serviceUpload = multer({
  storage: serviceStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit - better for web performance
  },
  fileFilter: imageFilter
});

// Upload middleware functions
const uploadSingleProduct = productUpload.single('image');
const uploadMultipleProducts = productUpload.array('images', 5);
const uploadSingleService = serviceUpload.single('image');
const uploadMultipleServices = serviceUpload.array('images', 5);

module.exports = {
  uploadSingleProduct,
  uploadMultipleProducts,
  uploadSingleService,
  uploadMultipleServices,
  productImagesDir,
  serviceImagesDir
};