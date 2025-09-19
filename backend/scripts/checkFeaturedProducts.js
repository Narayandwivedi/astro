const mongoose = require('mongoose');
const Product = require('../models/Product');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/astro-satya');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Check featured products
const checkFeaturedProducts = async () => {
  try {
    console.log('🔍 Checking featured products in database...\n');
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`📦 Total products in database: ${allProducts.length}\n`);
    
    // Get featured products
    const featuredProducts = await Product.find({ featured: true });
    console.log(`⭐ Featured products: ${featuredProducts.length}\n`);
    
    if (featuredProducts.length > 0) {
      console.log('📋 Featured products list:');
      featuredProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock})`);
      });
    } else {
      console.log('❌ No featured products found!');
      console.log('\n📋 All products (showing featured status):');
      allProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Featured: ${product.featured || false}`);
      });
    }
    
    // Test the API query that homepage uses
    const apiTestQuery = await Product.find({ featured: true }).limit(6);
    console.log(`\n🔗 API query test (featured=true, limit=6): ${apiTestQuery.length} products`);
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the check
connectDB().then(() => {
  checkFeaturedProducts();
});