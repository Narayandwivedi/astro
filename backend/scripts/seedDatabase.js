const mongoose = require('mongoose');
const Service = require('../models/Service');
const Product = require('../models/Product');
const { mockServices, mockProducts } = require('../data/mockData');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/astro-satya', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Transform mock service data to match Service model
const transformServiceData = (mockService) => {
  return {
    titleEn: mockService.titleEn,
    titleHi: mockService.titleHi,
    description: mockService.description,
    hindiDesc: mockService.hindiDesc,
    icon: mockService.icon,
    price: mockService.price,
    duration: mockService.duration,
    category: mockService.category,
    features: mockService.features || [],
    hindiFeatures: mockService.hindiFeatures || [],
    isActive: mockService.isActive !== undefined ? mockService.isActive : true,
    popular: Math.random() > 0.7, // Mark some as popular randomly
    featured: Math.random() > 0.6, // Mark some as featured randomly
    createdAt: mockService.createdAt || new Date(),
    updatedAt: mockService.updatedAt || new Date()
  };
};

// Transform mock product data to match Product model
const transformProductData = (mockProduct) => {
  return {
    name: mockProduct.name,
    nameHi: mockProduct.nameHi,
    description: mockProduct.description,
    descriptionHi: mockProduct.descriptionHi,
    price: mockProduct.price,
    originalPrice: mockProduct.originalPrice || mockProduct.price,
    category: mockProduct.category,
    images: mockProduct.images,
    inStock: mockProduct.inStock !== undefined ? mockProduct.inStock : true,
    stock: mockProduct.stock || 10,
    benefits: mockProduct.benefits || [],
    benefitsHi: mockProduct.benefitsHi || [],
    specifications: {
      weight: mockProduct.weight || '',
      material: mockProduct.material || '',
      origin: mockProduct.origin || '',
      certification: mockProduct.certification || '',
      beadCount: mockProduct.beadCount || null,
      size: mockProduct.size || '',
      quantity: mockProduct.quantity || ''
    },
    isActive: mockProduct.isActive !== undefined ? mockProduct.isActive : true,
    featured: mockProduct.featured !== undefined ? mockProduct.featured : false,
    sortOrder: Math.floor(Math.random() * 100),
    createdAt: mockProduct.createdAt || new Date(),
    updatedAt: mockProduct.updatedAt || new Date()
  };
};

// Seed services
const seedServices = async () => {
  try {
    console.log('🌱 Seeding Services...');
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('✅ Cleared existing services');

    // Transform and insert services
    const transformedServices = mockServices.map(transformServiceData);
    const insertedServices = await Service.insertMany(transformedServices);
    
    console.log(`✅ Successfully inserted ${insertedServices.length} services`);
    
    // Log some sample services
    const sampleServices = insertedServices.slice(0, 3);
    console.log('📋 Sample services:', sampleServices.map(s => ({ 
      title: s.titleEn, 
      price: s.price,
      category: s.category 
    })));

  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
};

// Seed products
const seedProducts = async () => {
  try {
    console.log('🌱 Seeding Products...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Transform and insert products
    const transformedProducts = mockProducts.map(transformProductData);
    const insertedProducts = await Product.insertMany(transformedProducts);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);
    
    // Log some sample products
    const sampleProducts = insertedProducts.slice(0, 3);
    console.log('📋 Sample products:', sampleProducts.map(p => ({ 
      name: p.name, 
      price: p.price,
      category: p.category,
      stock: p.stock
    })));

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    await connectDB();
    
    // Seed services
    await seedServices();
    
    // Seed products
    await seedProducts();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Services: ${mockServices.length} records`);
    console.log(`   - Products: ${mockProducts.length} records`);
    
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Handle script execution
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedServices, seedProducts };