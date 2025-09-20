const express = require('express');
const router = express.Router();
const { mockServices, mockProducts } = require('../data/mockData');
const Service = require('../models/Service');
const Product = require('../models/Product');

// Seed Products Endpoint
router.post('/products', async (req, res) => {
  try {
    console.log('🌱 Starting products seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Transform mockProducts to match your Product schema
    const transformedProducts = mockProducts.map(product => ({
      name: product.name,
      nameHi: product.nameHi,
      description: product.description,
      descriptionHi: product.descriptionHi,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      images: product.images || [],
      inStock: product.inStock !== false,
      stock: product.stock || 10,
      benefits: product.benefits || [],
      benefitsHi: product.benefitsHi || [],
      weight: product.weight,
      material: product.material,
      origin: product.origin,
      certification: product.certification,
      isActive: product.isActive !== false,
      featured: product.featured === true
    }));

    // Insert products
    const createdProducts = await Product.insertMany(transformedProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${createdProducts.length} products`,
      data: {
        productsCreated: createdProducts.length,
        products: createdProducts
      }
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  }
});

// Seed Services Endpoint
router.post('/services', async (req, res) => {
  try {
    console.log('🌱 Starting services seeding...');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🧹 Cleared existing services');

    // Transform mockServices to match your Service schema
    const transformedServices = mockServices.map(service => ({
      titleEn: service.titleEn,
      titleHi: service.titleHi,
      description: service.description,
      hindiDesc: service.hindiDesc,
      price: service.price,
      duration: service.duration,
      category: service.category,
      icon: service.icon,
      features: service.features || [],
      hindiFeatures: service.hindiFeatures || [],
      isActive: service.isActive !== false
    }));

    // Insert services
    const createdServices = await Service.insertMany(transformedServices);
    console.log(`✅ Created ${createdServices.length} services`);

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${createdServices.length} services`,
      data: {
        servicesCreated: createdServices.length,
        services: createdServices
      }
    });

  } catch (error) {
    console.error('❌ Error seeding services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed services',
      error: error.message
    });
  }
});

// Seed Both Products and Services
router.post('/all', async (req, res) => {
  try {
    console.log('🌱 Starting complete database seeding...');

    // Clear existing data
    await Service.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Transform and insert services
    const transformedServices = mockServices.map(service => ({
      titleEn: service.titleEn,
      titleHi: service.titleHi,
      description: service.description,
      hindiDesc: service.hindiDesc,
      price: service.price,
      duration: service.duration,
      category: service.category,
      icon: service.icon,
      features: service.features || [],
      hindiFeatures: service.hindiFeatures || [],
      isActive: service.isActive !== false
    }));

    const createdServices = await Service.insertMany(transformedServices);
    console.log(`✅ Created ${createdServices.length} services`);

    // Transform and insert products
    const transformedProducts = mockProducts.map(product => ({
      name: product.name,
      nameHi: product.nameHi,
      description: product.description,
      descriptionHi: product.descriptionHi,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      images: product.images || [],
      inStock: product.inStock !== false,
      stock: product.stock || 10,
      benefits: product.benefits || [],
      benefitsHi: product.benefitsHi || [],
      weight: product.weight,
      material: product.material,
      origin: product.origin,
      certification: product.certification,
      isActive: product.isActive !== false,
      featured: product.featured === true
    }));

    const createdProducts = await Product.insertMany(transformedProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    res.status(200).json({
      success: true,
      message: `Successfully seeded database with ${createdServices.length} services and ${createdProducts.length} products`,
      data: {
        servicesCreated: createdServices.length,
        productsCreated: createdProducts.length,
        total: createdServices.length + createdProducts.length
      }
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Get seeding status/info
router.get('/status', async (req, res) => {
  try {
    const serviceCount = await Service.countDocuments();
    const productCount = await Product.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Database status',
      data: {
        services: serviceCount,
        products: productCount,
        total: serviceCount + productCount,
        mockDataAvailable: {
          services: mockServices.length,
          products: mockProducts.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get database status',
      error: error.message
    });
  }
});

module.exports = router;