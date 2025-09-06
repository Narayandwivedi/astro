const mongoose = require('mongoose');
const Service = require('../models/Service');
const Product = require('../models/Product');
const { connectDB } = require('../config/database');
const { mockServices, mockProducts } = require('../data/mockData');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Service.deleteMany({});
    await Product.deleteMany({});
    
    // Seed services
    console.log('📋 Seeding services...');
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
    
    // Seed products
    console.log('🛍️ Seeding products...');
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
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Total: ${createdServices.length} services, ${createdProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };