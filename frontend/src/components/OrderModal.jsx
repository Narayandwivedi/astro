import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';

const OrderModal = ({ isOpen, onClose, product, cartItems, cartMode = false }) => {
  const { BACKEND_URL, getImageURL } = useContext(AppContext);
  const { clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Customer Info, 2: Address, 3: Review & Submit
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      whatsapp: ''
    },
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    specialRequirements: '',
    birthDetails: {
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      isRequired: false
    },
    consultationRequired: false,
    paymentMethod: 'whatsapp'
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

  const handleInputChange = (section, field, value) => {
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
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      // Customer info validation
      if (!formData.customer.name.trim()) {
        newErrors['customer.name'] = 'Name is required';
      }
      if (!formData.customer.email.trim()) {
        newErrors['customer.email'] = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.customer.email)) {
        newErrors['customer.email'] = 'Please enter a valid email';
      }
      if (!formData.customer.phone.trim()) {
        newErrors['customer.phone'] = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.customer.phone)) {
        newErrors['customer.phone'] = 'Please enter a valid 10-digit phone number';
      }
      if (formData.customer.whatsapp && !/^[6-9]\d{9}$/.test(formData.customer.whatsapp)) {
        newErrors['customer.whatsapp'] = 'Please enter a valid 10-digit WhatsApp number';
      }
    }
    
    if (stepNumber === 2) {
      // Address validation
      if (!formData.shippingAddress.fullName.trim()) {
        newErrors['shippingAddress.fullName'] = 'Full name is required';
      }
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
      
      // Birth details validation if required
      if (formData.birthDetails.isRequired) {
        if (!formData.birthDetails.dateOfBirth) {
          newErrors['birthDetails.dateOfBirth'] = 'Date of birth is required for astrological products';
        }
        if (!formData.birthDetails.timeOfBirth.trim()) {
          newErrors['birthDetails.timeOfBirth'] = 'Time of birth is required';
        }
        if (!formData.birthDetails.placeOfBirth.trim()) {
          newErrors['birthDetails.placeOfBirth'] = 'Place of birth is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    try {
      let orderItems;
      let subtotal = 0;

      if (cartMode && cartItems) {
        // Cart mode: use cart items
        orderItems = cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          specifications: item.specifications || ''
        }));
        subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      } else {
        // Single product mode
        orderItems = [{
          product: product._id,
          quantity: quantity,
          specifications: formData.specialRequirements
        }];
        subtotal = product.price * quantity;
      }

      // Calculate shipping (free for orders above ₹1000)
      const shipping = subtotal >= 1000 ? 0 : 50;

      const orderData = {
        ...formData,
        items: orderItems,
        pricing: {
          shipping: shipping,
          tax: 0,
          discount: 0
        }
      };

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
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
        
        // Clear cart if in cart mode
        if (cartMode) {
          clearCart();
        }
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

  const resetModal = () => {
    setStep(1);
    setOrderPlaced(false);
    setOrderDetails(null);
    setQuantity(1);
    setFormData({
      customer: { name: '', email: '', phone: '', whatsapp: '' },
      shippingAddress: { fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India' },
      specialRequirements: '',
      birthDetails: { dateOfBirth: '', timeOfBirth: '', placeOfBirth: '', isRequired: false },
      consultationRequired: false,
      paymentMethod: 'whatsapp'
    });
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const calculateTotal = () => {
    if (cartMode && cartItems) {
      return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
    return product ? (product.price * quantity) : 0;
  };

  const calculateShipping = () => {
    const subtotal = calculateTotal();
    return subtotal >= 1000 ? 0 : 50;
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateShipping();
  };

  if (!isOpen || (!product && !cartMode)) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {orderPlaced ? '🎉 Order Placed!' : '🛒 Place Order'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Indicator */}
          {!orderPlaced && (
            <div className="flex items-center mt-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > num ? 'bg-orange-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          
          {orderPlaced ? (
            /* Order Success */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">Order ID: {orderDetails?._id}</p>
                <p className="text-green-700 text-sm mt-1">
                  We'll contact you shortly on {formData.customer.whatsapp || formData.customer.phone} to confirm your order.
                </p>
              </div>
              
              <div className="space-y-3 text-left max-w-md mx-auto">
                {cartMode && cartItems ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">{cartItems.length} products</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">{calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping()}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-orange-600">₹{calculateFinalTotal().toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-orange-600">₹{calculateFinalTotal().toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => {
                    const message = `Hi! My order ${orderDetails?._id} has been placed. Please confirm the details.`;
                    window.open(`https://wa.me/91883945431?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  💬 Contact on WhatsApp
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <>
              {/* Order Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                {cartMode && cartItems ? (
                  /* Cart Items Summary */
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Order Items ({cartItems.length})</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img 
                                src={getImageURL(item.product.images.find(img => img.isPrimary) || item.product.images[0])}
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
                    <div className="border-t border-orange-200 mt-4 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Total:</span>
                        <span className="font-bold text-orange-600 text-lg">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600">Shipping:</span>
                        <span className={calculateShipping() === 0 ? "text-green-600" : "text-gray-600"}>
                          {calculateShipping() === 0 ? "FREE" : `₹${calculateShipping()}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg mt-2 pt-2 border-t border-orange-200">
                        <span>Final Total:</span>
                        <span className="text-orange-600">₹{calculateFinalTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single Product Summary */
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={getImageURL(product.images.find(img => img.isPrimary) || product.images[0])}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">{product.icon || '🔮'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{product.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{product.nameHi}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <select 
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            {[1,2,3,4,5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">₹{calculateTotal().toLocaleString()}</p>
                          {quantity > 1 && (
                            <p className="text-xs text-gray-500">₹{product.price.toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 1: Customer Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Customer Information</h3>
                  
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formData.customer.email}
                      onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors['customer.email'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['customer.email']}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.customer.whatsapp}
                      onChange={(e) => handleInputChange('customer', 'whatsapp', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors['customer.whatsapp'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="WhatsApp number if different from phone"
                      maxLength="10"
                    />
                    {errors['customer.whatsapp'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['customer.whatsapp']}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🏠 Shipping Address</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.fullName}
                      onChange={(e) => handleInputChange('shippingAddress', 'fullName', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors['shippingAddress.fullName'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Name for delivery"
                    />
                    {errors['shippingAddress.fullName'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.fullName']}</p>
                    )}
                  </div>

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

                  {/* Birth Details for Astrological Products */}
                  <div className="border-t pt-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="birthDetailsRequired"
                        checked={formData.birthDetails.isRequired}
                        onChange={(e) => handleInputChange('birthDetails', 'isRequired', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="birthDetailsRequired" className="text-sm font-medium text-gray-700">
                        🌟 Provide birth details for personalized astrological benefits
                      </label>
                    </div>

                    {formData.birthDetails.isRequired && (
                      <div className="space-y-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                          <input
                            type="date"
                            value={formData.birthDetails.dateOfBirth}
                            onChange={(e) => handleInputChange('birthDetails', 'dateOfBirth', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['birthDetails.dateOfBirth'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['birthDetails.dateOfBirth'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['birthDetails.dateOfBirth']}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth *</label>
                          <input
                            type="time"
                            value={formData.birthDetails.timeOfBirth}
                            onChange={(e) => handleInputChange('birthDetails', 'timeOfBirth', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['birthDetails.timeOfBirth'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['birthDetails.timeOfBirth'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['birthDetails.timeOfBirth']}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth *</label>
                          <input
                            type="text"
                            value={formData.birthDetails.placeOfBirth}
                            onChange={(e) => handleInputChange('birthDetails', 'placeOfBirth', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors['birthDetails.placeOfBirth'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="City, State"
                          />
                          {errors['birthDetails.placeOfBirth'] && (
                            <p className="text-red-500 text-xs mt-1">{errors['birthDetails.placeOfBirth']}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Special Requirements */}
                  <div>
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

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">✅ Review Your Order</h3>
                  
                  <div className="space-y-6">
                    {/* Customer Info Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Customer Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Name:</strong> {formData.customer.name}</p>
                        <p><strong>Email:</strong> {formData.customer.email}</p>
                        <p><strong>Phone:</strong> {formData.customer.phone}</p>
                        {formData.customer.whatsapp && (
                          <p><strong>WhatsApp:</strong> {formData.customer.whatsapp}</p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{formData.shippingAddress.fullName}</p>
                        <p>{formData.shippingAddress.addressLine1}</p>
                        {formData.shippingAddress.addressLine2 && (
                          <p>{formData.shippingAddress.addressLine2}</p>
                        )}
                        <p>{formData.shippingAddress.city}, {formData.shippingAddress.state} - {formData.shippingAddress.pincode}</p>
                        <p>{formData.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Birth Details Review */}
                    {formData.birthDetails.isRequired && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">🌟 Birth Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Date:</strong> {formData.birthDetails.dateOfBirth}</p>
                          <p><strong>Time:</strong> {formData.birthDetails.timeOfBirth}</p>
                          <p><strong>Place:</strong> {formData.birthDetails.placeOfBirth}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Product Total:</span>
                          <span>₹{calculateTotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span className="text-green-600">FREE</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex justify-between font-bold">
                          <span>Total Amount:</span>
                          <span className="text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">💬 Payment Method</h4>
                      <p className="text-sm text-blue-800">
                        Pay securely via WhatsApp or Cash on Delivery. We'll contact you to confirm payment details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={step === 1 ? handleClose : handleBack}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Placing Order...' : '🛒 Place Order'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;