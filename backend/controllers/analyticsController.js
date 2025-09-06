const Booking = require('../models/Booking');
const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const Product = require('../models/Product');

// Get dashboard overview stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBookings,
      totalOrders,
      totalUsers,
      totalServices,
      totalProducts,
      pendingBookings,
      pendingOrders,
      completedBookings,
      completedOrders,
      cancelledBookings,
      cancelledOrders,
      recentBookings,
      recentOrders,
      monthlyBookings,
      monthlyOrders,
      topServices,
      topProducts
    ] = await Promise.all([
      // Basic counts
      Booking.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Service.countDocuments(),
      Product.countDocuments(),
      
      // Status-based counts
      Booking.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'delivered' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ status: 'cancelled' }),
      
      // Recent items (last 5)
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('serviceId', 'titleEn'),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('items.product', 'name'),
      
      // Monthly data (last 12 months)
      getMonthlyBookings(),
      getMonthlyOrders(),
      
      // Top performers
      getTopServices(),
      getTopProducts()
    ]);

    // Calculate revenue
    const totalRevenue = await calculateTotalRevenue();
    const monthlyRevenue = await getMonthlyRevenue();

    const stats = {
      overview: {
        totalBookings,
        totalOrders,
        totalUsers,
        totalServices,
        totalProducts,
        totalRevenue
      },
      status: {
        bookings: {
          pending: pendingBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        orders: {
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders
        }
      },
      recent: {
        bookings: recentBookings,
        orders: recentOrders
      },
      trends: {
        monthlyBookings,
        monthlyOrders,
        monthlyRevenue
      },
      topPerformers: {
        services: topServices,
        products: topProducts
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get monthly bookings for the last 12 months
const getMonthlyBookings = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyData = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$servicePrice' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  return monthlyData.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    bookings: item.count,
    revenue: item.revenue || 0
  }));
};

// Get monthly orders for the last 12 months
const getMonthlyOrders = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  return monthlyData.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    orders: item.count,
    revenue: item.revenue || 0
  }));
};

// Get monthly revenue
const getMonthlyRevenue = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [bookingRevenue, orderRevenue] = await Promise.all([
    Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$servicePrice' }
        }
      }
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' }
        }
      }
    ])
  ]);

  // Combine and format revenue data
  const revenueMap = new Map();
  
  [...bookingRevenue, ...orderRevenue].forEach(item => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    revenueMap.set(key, (revenueMap.get(key) || 0) + item.revenue);
  });

  return Array.from(revenueMap.entries()).map(([month, revenue]) => ({
    month,
    revenue
  })).sort((a, b) => a.month.localeCompare(b.month));
};

// Calculate total revenue
const calculateTotalRevenue = async () => {
  const [bookingRevenue, orderRevenue] = await Promise.all([
    Booking.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$servicePrice' }
        }
      }
    ]),
    Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ])
  ]);

  const bookingTotal = bookingRevenue[0]?.total || 0;
  const orderTotal = orderRevenue[0]?.total || 0;
  
  return bookingTotal + orderTotal;
};

// Get top performing services
const getTopServices = async () => {
  try {
    const topServices = await Booking.aggregate([
      {
        $match: { serviceId: { $ne: null } }
      },
      {
        $group: {
          _id: '$serviceId',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$servicePrice' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $project: {
          serviceName: '$service.titleEn',
          bookingCount: 1,
          totalRevenue: 1
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return topServices;
  } catch (error) {
    console.error('Error getting top services:', error);
    return [];
  }
};

// Get top performing products
const getTopProducts = async () => {
  try {
    const topProducts = await Order.aggregate([
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product',
          orderCount: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          productName: '$product.name',
          orderCount: 1,
          totalRevenue: 1
        }
      },
      {
        $sort: { orderCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return topProducts;
  } catch (error) {
    console.error('Error getting top products:', error);
    return [];
  }
};

// Get detailed booking analytics
const getBookingAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const analytics = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $facet: {
          dailyBookings: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$servicePrice' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ],
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          methodBreakdown: [
            {
              $group: {
                _id: '$consultationType',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: analytics[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking analytics',
      error: error.message
    });
  }
};

// Get detailed order analytics
const getOrderAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $facet: {
          dailyOrders: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$pricing.total' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ],
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          paymentBreakdown: [
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                revenue: { $sum: '$pricing.total' }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: analytics[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getBookingAnalytics,
  getOrderAnalytics
};