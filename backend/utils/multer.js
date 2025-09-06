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
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer configuration for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFilter
});

// Multer configuration for services
const serviceUpload = multer({
  storage: serviceStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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