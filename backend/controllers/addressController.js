const User = require('../models/User');

// Get all addresses for authenticated user
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Filter out inactive addresses
    const activeAddresses = user.addresses.filter(addr => addr.isActive !== false);
    
    res.json({
      success: true,
      data: activeAddresses
    });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

// Get specific address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const address = user.addresses.id(id);
    
    if (!address || address.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch address',
      error: error.message
    });
  }
};

// Create new address
const createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }
    
    // Add address to user's addresses array
    user.addresses.push(addressData);
    await user.save();
    
    // Get the newly created address
    const newAddress = user.addresses[user.addresses.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    });
  } catch (error) {
    console.error('Error creating address:', error);
    console.error('Request body:', req.body);
    console.error('User ID:', req.user.userId);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const address = user.addresses.id(id);
    
    if (!address || address.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Update the address
    Object.assign(address, updateData);
    await user.save();
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete address (soft delete)
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const address = user.addresses.id(id);
    
    if (!address || address.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Soft delete the address
    address.isActive = false;
    
    // If this was the default address, set another one as default
    if (address.isDefault) {
      const activeAddresses = user.addresses.filter(addr => addr._id.toString() !== id && addr.isActive !== false);
      if (activeAddresses.length > 0) {
        activeAddresses[0].isDefault = true;
      }
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

// Set address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const address = user.addresses.id(id);
    
    if (!address || address.isActive === false) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Unset all other addresses as default
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set this address as default
    address.isDefault = true;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Address set as default successfully',
      data: address
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    });
  }
};

// Get default address
const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const defaultAddress = user.addresses.find(addr => addr.isDefault && addr.isActive !== false);
    
    if (!defaultAddress) {
      return res.status(404).json({
        success: false,
        message: 'No default address found'
      });
    }
    
    res.json({
      success: true,
      data: defaultAddress
    });
  } catch (error) {
    console.error('Error fetching default address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch default address',
      error: error.message
    });
  }
};

module.exports = {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress
};