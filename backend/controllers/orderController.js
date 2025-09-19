const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate and populate product details
    for (let item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }
      
      // Check stock availability
      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }
      
      // Populate product details
      item.productName = product.name;
      item.productNameHi = product.nameHi;
      item.price = product.price;
      item.category = product.category;
      item.productImage = product.images && product.images.length > 0 
        ? (product.images.find(img => img.isPrimary) || product.images[0]).filename 
        : null;
    }
    
    // Create order
    const order = new Order(orderData);
    await order.save();
    
    // Populate product references
    await order.populate('items.product', 'name nameHi price images category');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { 'customer.name': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex },
        { 'shippingAddress.city': regex }
      ];
      
      // If search looks like an ObjectId, also search by _id
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('items.product', 'name nameHi images category')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate('items.product', 'name nameHi images category description');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, tracking } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update status using the model method
    if (status) {
      await order.updateStatus(status);
    }
    
    // Update admin notes
    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }
    
    // Update tracking information
    if (tracking) {
      order.tracking = { ...order.tracking, ...tracking };
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized to cancel this order
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if this order belongs to the user
      const isOwner = order.customer.email === user.email || order.customer.phone === user.mobile;
      
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this order'
        });
      }
    }
    
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage. Orders can only be cancelled when status is "pending" or "confirmed".'
      });
    }
    
    // Validate reason
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }
    
    // Update order status and add cancellation details
    order.status = 'cancelled';
    const cancellationNote = `\n--- Order Cancelled ---\nDate: ${new Date().toISOString()}\nReason: ${reason.trim()}\nCancelled by: ${req.user ? 'Customer' : 'Admin'}`;
    order.adminNotes = (order.adminNotes || '') + cancellationNote;
    
    // If payment was made, mark for refund
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully. If payment was made, refund will be processed within 3-5 business days.',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get customer orders by email/phone
const getCustomerOrders = async (req, res) => {
  try {
    const { email, phone } = req.query;
    
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }
    
    let query = {};
    if (email) {
      query['customer.email'] = email.toLowerCase();
    } else if (phone) {
      query['customer.phone'] = phone;
    }
    
    const orders = await Order.find(query)
      .populate('items.product', 'name nameHi images category')
      .sort({ orderDate: -1 });
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer orders',
      error: error.message
    });
  }
};

// Get orders for authenticated user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const User = require('../models/User');
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Debug logging
    console.log('=== DEBUG getUserOrders ===');
    console.log('User ID:', userId);
    console.log('User email:', user.email);
    console.log('User mobile:', user.mobile);
    
    // Check total orders in database
    const totalOrders = await Order.countDocuments();
    console.log('Total orders in database:', totalOrders);
    
    // Sample a few orders to see structure
    const sampleOrders = await Order.find({}).limit(3);
    console.log('Sample orders structure:', JSON.stringify(sampleOrders.map(o => ({
      _id: o._id,
      customer: o.customer
    })), null, 2));
    
    // Find orders by user's email or mobile
    let query = {};
    if (user.email) {
      query['customer.email'] = user.email.toLowerCase();
    }
    
    // Also search by mobile if available
    if (user.mobile) {
      if (query['customer.email']) {
        query = {
          $or: [
            { 'customer.email': user.email.toLowerCase() },
            { 'customer.phone': user.mobile.toString() }
          ]
        };
      } else {
        query['customer.phone'] = user.mobile.toString();
      }
    }
    
    console.log('Query being executed:', JSON.stringify(query, null, 2));
    
    const orders = await Order.find(query)
      .populate('items.product', 'name nameHi images category')
      .sort({ orderDate: -1 });
    
    console.log('Orders found:', orders.length);
    console.log('=== END DEBUG ===');
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

// Get order statistics (Admin)
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getOrderStats();
    
    // Additional stats
    const todayOrders = await Order.countDocuments({
      orderDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    
    const monthlyOrders = await Order.countDocuments({
      orderDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
    });
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    res.json({
      success: true,
      data: {
        ...stats,
        todayOrders,
        monthlyOrders,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

// Send order confirmation (WhatsApp/Email notification)
const sendOrderConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate('items.product', 'name nameHi images category');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Here you would integrate with WhatsApp Business API or email service
    // For now, we'll just return the order details formatted for WhatsApp
    
    const whatsappMessage = `🎉 Order Confirmation - Astro Satya
    
Order ID: ${order._id}
Customer: ${order.customer.name}
Phone: ${order.customer.phone}

Items:
${order.items.map(item => 
  `• ${item.productName} (${item.productNameHi || ''}) - Qty: ${item.quantity} - ₹${item.totalPrice}`
).join('\n')}

Total Amount: ₹${order.pricing.total}
Status: ${order.getStatusDisplay()}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '\n' : ''}${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

Thank you for choosing Astro Satya! 🙏`;

    res.json({
      success: true,
      message: 'Order confirmation prepared',
      data: {
        order,
        whatsappMessage,
        whatsappUrl: `https://wa.me/91${order.customer.whatsapp || order.customer.phone}?text=${encodeURIComponent(whatsappMessage)}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getCustomerOrders,
  getUserOrders,
  getOrderStats,
  sendOrderConfirmation
};