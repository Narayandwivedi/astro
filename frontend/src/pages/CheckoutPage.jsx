import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import QRCODE from '../components/QRCODE';
import { useCart } from '../context/CartContext';
import { useApi } from '../context/ApiContext';
import { AppContext } from '../context/AppContext';
import { getAddresses, addAddress } from '../services/addressService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartSummary } = useCart();
  const api = useApi();
  const { user } = useContext(AppContext);
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: user?.email || '', // Use actual user email
      phone: '',
      whatsapp: ''
    },
    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    specialRequirements: '',
    consultationRequired: false,
    paymentMethod: 'cod',
    utrNumber: ''
  });

  const [errors, setErrors] = useState({});

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const cartSummary = getCartSummary();

  // Update email when user data is available
  useEffect(() => {
    if (user?.email && formData.customer.email !== user.email) {
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          email: user.email
        }
      }));
    }
  }, [user?.email, formData.customer.email]);

  // Load saved addresses
  useEffect(() => {
    const loadSavedAddresses = async () => {
      try {
        const response = await getAddresses();
        setSavedAddresses(response.data || []);
        
        // Auto-select default address if exists
        const defaultAddress = response.data?.find(addr => addr.isDefault);
        if (defaultAddress && !selectedSavedAddress) {
          setSelectedSavedAddress(defaultAddress);
          // Pre-fill form with default address
          setFormData(prev => ({
            ...prev,
            customer: {
              ...prev.customer,
              name: defaultAddress.fullName,
              phone: defaultAddress.mobile
            },
            shippingAddress: {
              addressLine1: defaultAddress.addressLine1,
              addressLine2: defaultAddress.addressLine2 || '',
              city: defaultAddress.city,
              state: defaultAddress.state,
              pincode: defaultAddress.pincode,
              country: defaultAddress.country || 'India'
            }
          }));
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    };

    loadSavedAddresses();
  }, [selectedSavedAddress]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart.items.length, navigate, orderPlaced]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section === '') {
      // Handle top-level fields like paymentMethod, utrNumber, specialRequirements
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    } else {
      // Handle nested fields like customer.name, shippingAddress.city
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
      
      // Clear error when user starts typing
      if (errors[`${section}.${field}`]) {
        setErrors(prev => ({
          ...prev,
          [`${section}.${field}`]: ''
        }));
      }
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedSavedAddress(address);
    setShowNewAddressForm(false);
    
    // Pre-fill form with selected address
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        name: address.fullName,
        phone: address.mobile
      },
      shippingAddress: {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || 'India'
      }
    }));
  };

  const handleNewAddressClick = () => {
    setSelectedSavedAddress(null);
    setShowNewAddressForm(true);
    // Clear form data
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        name: '',
        phone: ''
      },
      shippingAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    }));
    // Clear any existing errors
    setErrors({});
  };

  // Function to check if address form is complete
  const isAddressFormComplete = () => {
    if (selectedSavedAddress) {
      // If a saved address is selected, form is complete
      return true;
    }
    
    if (showNewAddressForm) {
      // If showing new address form, check if all required fields are filled
      return (
        formData.customer.name.trim() &&
        formData.customer.phone.trim() &&
        /^[6-9]\d{9}$/.test(formData.customer.phone) &&
        formData.shippingAddress.addressLine1.trim() &&
        formData.shippingAddress.city.trim() &&
        formData.shippingAddress.state.trim() &&
        formData.shippingAddress.pincode.trim() &&
        /^[1-9][0-9]{5}$/.test(formData.shippingAddress.pincode)
      );
    }
    
    // If no address is selected and form is not shown, not complete
    return false;
  };


  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      // Customer info validation
      if (!formData.customer.name.trim()) {
        newErrors['customer.name'] = 'Name is required';
      }
      if (!formData.customer.phone.trim()) {
        newErrors['customer.phone'] = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.customer.phone)) {
        newErrors['customer.phone'] = 'Please enter a valid 10-digit phone number';
      }
      // Address validation
      if (!formData.shippingAddress.addressLine1.trim()) {
        newErrors['shippingAddress.addressLine1'] = 'Address line 1 is required';
      }
      if (!formData.shippingAddress.city.trim()) {
        newErrors['shippingAddress.city'] = 'City is required';
      }
      if (!formData.shippingAddress.state.trim()) {
        newErrors['shippingAddress.state'] = 'State is required';
      }
      if (!formData.shippingAddress.pincode.trim()) {
        newErrors['shippingAddress.pincode'] = 'Pincode is required';
      } else if (!/^[1-9][0-9]{5}$/.test(formData.shippingAddress.pincode)) {
        newErrors['shippingAddress.pincode'] = 'Please enter a valid 6-digit pincode';
      }
    }
    
    // Payment validation for UPI
    if (stepNumber === 2 && formData.paymentMethod === 'upi') {
      if (!formData.utrNumber.trim()) {
        newErrors['utrNumber'] = 'UTR number is required for UPI payments';
      } else if (!/^[0-9]{12}$/.test(formData.utrNumber)) {
        newErrors['utrNumber'] = 'Please enter a valid 12-digit UTR number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Save address automatically if user entered a new address manually
      if (showNewAddressForm && !selectedSavedAddress) {
        try {
          const newAddressData = {
            fullName: formData.customer.name,
            mobile: formData.customer.phone,
            addressLine1: formData.shippingAddress.addressLine1,
            addressLine2: formData.shippingAddress.addressLine2 || '',
            city: formData.shippingAddress.city,
            state: formData.shippingAddress.state,
            pincode: formData.shippingAddress.pincode,
            isDefault: savedAddresses.length === 0 // Make it default if it's the first address
          };

          await addAddress(newAddressData);
          console.log('New address saved automatically during checkout');
        } catch (addressError) {
          console.error('Failed to save address during checkout:', addressError);
          // Continue with order placement even if address save fails
        }
      }

      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        specifications: item.specifications || '',
        totalPrice: item.product.price * item.quantity
      }));

      const orderData = {
        ...formData,
        // Use customer name for shipping since we removed the separate fullName field
        shippingAddress: {
          ...formData.shippingAddress,
          fullName: formData.customer.name
        },
        items: orderItems,
        pricing: {
          subtotal: cartSummary.subtotal,
          shipping: cartSummary.shipping,
          tax: 0,
          discount: 0,
          total: cartSummary.total
        },
        // Include payment details
        paymentDetails: formData.paymentMethod === 'upi' ? {
          utrNumber: formData.utrNumber,
          paymentStatus: 'paid'
        } : {
          paymentStatus: 'pending'
        }
      };

      const response = await fetch(`${api.baseURL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.data);
        setOrderPlaced(true);
        setCurrentStep(3);
        clearCart();
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="pt-28 pb-6 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {orderPlaced ? 'Order Confirmation' : 'Checkout'}
              </h1>
              {!orderPlaced && (
                <p className="text-gray-600 mt-1">
                  Complete your purchase securely
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(orderPlaced ? '/' : '/cart')}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">{orderPlaced ? 'Home' : 'Back to Cart'}</span>
            </button>
          </div>
          
          {/* Progress Indicator */}
          {!orderPlaced && (
            <div className="flex items-center mt-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > num ? 'bg-orange-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {orderPlaced ? (
          /* Order Confirmation */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">Order Number: {orderDetails?.orderNumber}</p>
                  <p className="text-green-700 text-sm mt-1">
                    We'll contact you shortly on {formData.customer.phone} to confirm your order.
                  </p>
                </div>
                
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{cartSummary.totalItems} products</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">{cartSummary.shipping === 0 ? 'FREE' : `₹${cartSummary.shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-orange-600">₹{cartSummary.total.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => {
                      const message = `Hi! My order ${orderDetails?.orderNumber} has been placed. Please confirm the details.`;
                      window.open(`https://wa.me/918839454313?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    💬 Contact on WhatsApp
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-1">
              
              {/* Step 1: Address Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">📋 Shipping & Contact Information</h2>
                  
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Select Address</h3>
                      <div className="space-y-3">
                        {savedAddresses.map((address) => (
                          <div
                            key={address._id}
                            onClick={() => handleAddressSelect(address)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedSavedAddress?._id === address._id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                                  {address.isDefault && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm">{address.addressLine1}</p>
                                {address.addressLine2 && (
                                  <p className="text-gray-600 text-sm">{address.addressLine2}</p>
                                )}
                                <p className="text-gray-600 text-sm">
                                  {address.city}, {address.state} {address.pincode}
                                </p>
                                <p className="text-gray-600 text-sm">📱 {address.mobile}</p>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedSavedAddress?._id === address._id
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedSavedAddress?._id === address._id && (
                                  <div className="w-full h-full rounded-full bg-white border-2 border-orange-500"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add New Address Option */}
                        <div>
                          <div
                            onClick={handleNewAddressClick}
                            className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              showNewAddressForm
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl mb-2">📝</div>
                                <p className="text-sm font-medium text-gray-900">Use a new address</p>
                                <p className="text-xs text-gray-600 mt-1">Will be automatically saved</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Manual Address Form - Show when no saved addresses or "new address" selected */}
                  {(savedAddresses.length === 0 || showNewAddressForm) && (
                    <>
                      {/* Address Auto-Save Notice */}
                      {showNewAddressForm && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-green-800">
                              ✅ This address will be automatically saved to your account for future orders.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Customer Information */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={formData.customer.name}
                          onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors['customer.name'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors['customer.name'] && (
                          <p className="text-red-500 text-xs mt-1">{errors['customer.name']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={formData.customer.phone}
                          onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors['customer.phone'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                        />
                        {errors['customer.phone'] && (
                          <p className="text-red-500 text-xs mt-1">{errors['customer.phone']}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input
                          type="text"
                          value={formData.shippingAddress.addressLine1}
                          onChange={(e) => handleInputChange('shippingAddress', 'addressLine1', e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors['shippingAddress.addressLine1'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="House/Flat no., Building, Street"
                        />
                        {errors['shippingAddress.addressLine1'] && (
                          <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.addressLine1']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={formData.shippingAddress.addressLine2}
                          onChange={(e) => handleInputChange('shippingAddress', 'addressLine2', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Area, Landmark (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={formData.shippingAddress.city}
                            onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['shippingAddress.city'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="City"
                          />
                          {errors['shippingAddress.city'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.city']}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={formData.shippingAddress.pincode}
                            onChange={(e) => handleInputChange('shippingAddress', 'pincode', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['shippingAddress.pincode'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="000000"
                            maxLength="6"
                          />
                          {errors['shippingAddress.pincode'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.pincode']}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                        <select
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors['shippingAddress.state'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors['shippingAddress.state'] && (
                          <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.state']}</p>
                        )}
                      </div>
                    </div>
                  </div>
                    </>
                  )}

                  {/* Special Requirements */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('', 'specialRequirements', e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Any specific requirements or instructions..."
                      maxLength="500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">💳 Payment</h2>
                  
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={(e) => handleInputChange('', 'paymentMethod', e.target.value)}
                            className="mr-3 text-orange-500"
                          />
                          <div>
                            <span className="text-2xl mr-3">💰</span>
                            <span className="font-medium">Cash on Delivery</span>
                            <p className="text-xs text-gray-600 mt-1">Pay on delivery</p>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={(e) => handleInputChange('', 'paymentMethod', e.target.value)}
                            className="mr-3 text-orange-500"
                          />
                          <div>
                            <span className="text-2xl mr-3">📱</span>
                            <span className="font-medium">UPI Payment</span>
                            <p className="text-xs text-gray-600 mt-1">Scan QR Code & Submit UTR</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* UPI Payment QR Code */}
                    {formData.paymentMethod === 'upi' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Scan QR Code to Pay</h4>
                        <div className="flex justify-center mb-4">
                          <QRCODE 
                            upiId="astrosatya@paytm"
                            name="Astro Satya"
                            amount={cartSummary.total}
                            size={200}
                          />
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Amount: ₹{cartSummary.total.toLocaleString()}</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                        </p>
                        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            💡 After making the payment, please enter your UTR number below and click "Place Order"
                          </p>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">UTR Number *</label>
                          <input
                            type="text"
                            value={formData.utrNumber}
                            onChange={(e) => handleInputChange('', 'utrNumber', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['utrNumber'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter 12-digit UTR number"
                            maxLength="12"
                          />
                          {errors['utrNumber'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['utrNumber']}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            You can find the UTR number in your payment confirmation message
                          </p>
                        </div>
                      </div>
                    )}


                    {/* Cash on Delivery */}
                    {formData.paymentMethod === 'cod' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Cash on Delivery</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          You will pay ₹{cartSummary.total.toLocaleString()} when your order is delivered
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-green-600 mt-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">No advance payment required</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={currentStep === 1 ? () => navigate('/cart') : handleBack}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {currentStep === 1 ? 'Back to Cart' : 'Back'}
                </button>

                {currentStep === 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isAddressFormComplete()}
                    className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                      isAddressFormComplete()
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue to Payment
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Only validate payment details for UPI, COD can go through directly
                      if (formData.paymentMethod === 'upi') {
                        if (!validateStep(2)) {
                          return;
                        }
                      }
                      handlePlaceOrder();
                    }}
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Placing Order...' : (formData.paymentMethod === 'cod' ? '🛒 Place Order' : '✅ Place Order')}
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={api.getImageURL(item.product.images.find(img => img.isPrimary) || item.product.images[0])}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-lg">{item.product.icon || '🔮'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                        <p className="text-orange-600 text-xs">{item.product.nameHi}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.product.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartSummary.totalItems} items):</span>
                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className={`font-medium ${cartSummary.shipping === 0 ? 'text-green-600' : ''}`}>
                      {cartSummary.shipping === 0 ? 'FREE' : `₹${cartSummary.shipping}`}
                    </span>
                  </div>
                  
                  <hr className="border-gray-300" />
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-orange-600">₹{cartSummary.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default CheckoutPage;