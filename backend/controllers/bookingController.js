const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      name,
      mobile,
      email,
      birthDate,
      birthTime,
      birthState,
      birthCity,
      preferredDate,
      preferredTime,
      consultationType,
      specialRequests,
      serviceName,
      servicePrice
    } = req.body;

    // Validate required fields
    if (!name || !mobile || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, mobile, preferredDate, preferredTime'
      });
    }

    // Verify service exists (only if serviceId is provided)
    let service = null;
    if (serviceId) {
      service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }
    }

    // Check if the preferred date is not in the past
    const preferredDateTime = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (preferredDateTime < today) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date cannot be in the past'
      });
    }

    // Create the booking
    const booking = new Booking({
      serviceId: serviceId || null,
      serviceName: serviceName || (service ? service.titleEn : 'General Consultation'),
      servicePrice: servicePrice || (service ? service.price : 0),
      name,
      mobile,
      email,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      birthTime,
      birthState,
      birthCity,
      preferredDate: new Date(preferredDate),
      preferredTime,
      consultationType: consultationType || 'phone',
      specialRequests
    });

    const savedBooking = await booking.save();

    // Populate service details for response (only if serviceId exists)
    const populatedBooking = serviceId 
      ? await Booking.findById(savedBooking._id).populate('serviceId', 'titleEn titleHi category icon duration')
      : await Booking.findById(savedBooking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get all bookings with filters
const getBookings = async (req, res) => {
  try {
    const { 
      status, 
      date, 
      mobile, 
      serviceId,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (serviceId) filter.serviceId = serviceId;
    if (mobile) filter.mobile = { $regex: mobile, $options: 'i' };
    
    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
      const endOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1);
      filter.preferredDate = { $gte: startOfDay, $lt: endOfDay };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const bookings = await Booking.find(filter)
      .populate('serviceId', 'titleEn titleHi category icon duration')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('serviceId', 'titleEn titleHi category icon duration description');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: error.message
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      confirmedDate, 
      confirmedTime, 
      meetingLink, 
      adminNotes,
      paymentStatus 
    } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    if (status) booking.status = status;
    if (confirmedDate) booking.confirmedDate = new Date(confirmedDate);
    if (confirmedTime) booking.confirmedTime = confirmedTime;
    if (meetingLink) booking.meetingLink = meetingLink;
    if (adminNotes) booking.adminNotes = adminNotes;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    const updatedBooking = await booking.save();

    // Populate for response
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('serviceId', 'titleEn titleHi category icon duration');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: populatedBooking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

// Add communication to booking
const addCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, message, sentBy = 'admin' } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.addCommunication(type, message, sentBy);

    res.status(200).json({
      success: true,
      message: 'Communication added successfully',
      data: booking
    });

  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication',
      error: error.message
    });
  }
};

// Get bookings dashboard stats
const getBookingStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Aggregate stats
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      todayBookings,
      monthlyBookings,
      recentBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ 
        preferredDate: { $gte: startOfDay, $lt: endOfDay } 
      }),
      Booking.countDocuments({ 
        createdAt: { $gte: startOfMonth } 
      }),
      Booking.find()
        .populate('serviceId', 'titleEn category')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        todayBookings,
        monthlyBookings,
        recentBookings
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking statistics',
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'cancelled';
    if (reason) {
      booking.adminNotes = reason;
      await booking.addCommunication('system', `Booking cancelled: ${reason}`);
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Get bookings for authenticated user
const getUserBookings = async (req, res) => {
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
    
    // Find bookings by user's email or mobile
    let query = {};
    if (user.email) {
      query.email = user.email.toLowerCase();
    }
    
    // Also search by mobile if available
    if (user.mobile) {
      if (query.email) {
        query = {
          $or: [
            { email: user.email.toLowerCase() },
            { mobile: user.mobile.toString() }
          ]
        };
      } else {
        query.mobile = user.mobile.toString();
      }
    }
    
    const bookings = await Booking.find(query)
      .populate('serviceId', 'titleEn titleHi category icon duration')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  addCommunication,
  getBookingStats,
  cancelBooking,
  getUserBookings
};