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
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.email': regex },
        { 'customer.phone': regex },
        { 'shippingAddress.city': regex }
      ];
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

// Get order by order number
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({ orderNumber }).populate('items.product', 'name nameHi images category description');
    
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
    
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    order.status = 'cancelled';
    if (reason) {
      order.adminNotes = (order.adminNotes || '') + `\nCancellation reason: ${reason}`;
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
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
    
Order Number: ${order.orderNumber}
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
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  getCustomerOrders,
  getOrderStats,
  sendOrderConfirmation
};