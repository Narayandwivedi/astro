const API_BASE_URL = 'http://localhost:5000/api/user';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  return apiCall('/profile');
};

// Get all user addresses
export const getAddresses = async () => {
  return apiCall('/addresses');
};

// Add new address
export const addAddress = async (addressData) => {
  return apiCall('/address', {
    method: 'POST',
    body: JSON.stringify(addressData),
  });
};

// Update existing address
export const updateAddress = async (addressId, addressData) => {
  return apiCall(`/address/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(addressData),
  });
};

// Delete address
export const deleteAddress = async (addressId) => {
  return apiCall(`/address/${addressId}`, {
    method: 'DELETE',
  });
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  return apiCall(`/address/${addressId}/default`, {
    method: 'PATCH',
  });
};

// Validate address data
export const validateAddress = (addressData) => {
  const errors = {};

  if (!addressData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!addressData.mobile?.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(addressData.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number';
  }

  // Validate alternate phone if provided
  if (addressData.alternatePhone?.trim() && !/^[6-9]\d{9}$/.test(addressData.alternatePhone)) {
    errors.alternatePhone = 'Please enter a valid 10-digit mobile number';
  }

  // Validate email if provided
  if (addressData.email?.trim() && !/^\S+@\S+\.\S+$/.test(addressData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!addressData.addressLine1?.trim()) {
    errors.addressLine1 = 'Address line 1 is required';
  }

  if (!addressData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!addressData.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!addressData.pincode?.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!/^[1-9][0-9]{5}$/.test(addressData.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit pincode';
  }

  // Validate delivery instructions length
  if (addressData.deliveryInstructions?.trim() && addressData.deliveryInstructions.trim().length > 300) {
    errors.deliveryInstructions = 'Delivery instructions must be less than 300 characters';
  }

  // Validate label length
  if (addressData.label?.trim() && addressData.label.trim().length > 50) {
    errors.label = 'Address label must be less than 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};