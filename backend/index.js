const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://api.astrosatyaprakash.com', 'https://astrosatyaprakash.com', 'https://astro-admin-nu.vercel.app','http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically with images prefix
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
connectDB();

// Routes
const authRoutes = require('./routes/authRoute');
const blogRoutes = require('./routes/blogRoute');
const serviceRoutes = require('./routes/serviceRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const uploadRoutes = require('./routes/uploadRoute');
const bookingRoutes = require('./routes/bookingRoute');
const analyticsRoutes = require('./routes/analyticsRoute');
const cartRoutes = require('./routes/cartRoute');
const userRoutes = require('./routes/userRoute');
const addressRoutes = require('./routes/addressRoute');
const seedRoutes = require('./routes/seedRoute');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/seed', seedRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Astro Satya Backend Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Astro Satya API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      blogs: '/api/blogs',
      services: '/api/services',
      products: '/api/products',
      orders: '/api/orders',
      bookings: '/api/bookings',
      analytics: '/api/analytics',
      cart: '/api/cart',
      user: '/api/user',
      addresses: '/api/addresses',
      seed: '/api/seed',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Astro Satya server is running on port ${PORT}`);
});

module.exports = app;