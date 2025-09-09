import React, { useState, useEffect } from 'react';
import { addAddress, updateAddress, validateAddress } from '../services/addressService';

const AddressModal = ({ isOpen, onClose, onSave, address = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    type: 'home',
    label: '',
    fullName: '',
    mobile: '',
    alternatePhone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    deliveryInstructions: '',
    addressTags: [],
    isDefault: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Indian states data
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
  ];

  // Load address data if editing
  useEffect(() => {
    if (isEditing && address) {
      setFormData({
        type: address.type || 'home',
        label: address.label || '',
        fullName: address.fullName || '',
        mobile: address.mobile || '',
        alternatePhone: address.alternatePhone || '',
        email: address.email || '',
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        landmark: address.landmark || '',
        area: address.area || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        country: address.country || 'India',
        deliveryInstructions: address.deliveryInstructions || '',
        addressTags: address.addressTags || [],
        isDefault: address.isDefault || false
      });
    } else {
      // Reset form for new address
      setFormData({
        type: 'home',
        label: '',
        fullName: '',
        mobile: '',
        alternatePhone: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        deliveryInstructions: '',
        addressTags: [],
        isDefault: false
      });
    }
    setErrors({});
  }, [isEditing, address, isOpen]);

  // Disable scrolling when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateAddress(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (isEditing && address) {
        result = await updateAddress(address._id, formData);
      } else {
        result = await addAddress(formData);
      }

      // Call onSave callback to refresh the address list
      if (onSave) {
        onSave(result.data);
      }

      // Show success message
      alert(isEditing ? 'Address updated successfully!' : 'Address added successfully!');
      
      onClose();
    } catch (error) {
      console.error('Address save error:', error);
      alert(error.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200/50">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {isEditing ? 'Edit Address' : 'Add New Address'}
                </h2>
                <p className="text-orange-100 text-lg font-medium">
                  {isEditing ? 'पता संपादित करें' : 'नया पता जोड़ें'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Address Type / पता प्रकार *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['home', 'work', 'billing', 'shipping', 'other'].map((type) => (
                  <label key={type} className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                      className="mb-2 text-orange-500"
                    />
                    <span className="text-lg mb-1">
                      {type === 'home' ? '🏠' : 
                       type === 'work' ? '🏢' : 
                       type === 'billing' ? '💳' :
                       type === 'shipping' ? '📦' : '📍'}
                    </span>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address Label */}
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                Address Label / पता लेबल
              </label>
              <input
                type="text"
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="e.g., Main Office, Mom's House, etc."
                maxLength="50"
              />
            </div>

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name / पूरा नाम *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number / मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="9876543210"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Additional Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone / वैकल्पिक फोन
                </label>
                <input
                  type="tel"
                  id="alternatePhone"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address / ईमेल पता
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 / पता पंक्ति 1 *
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="House/Flat number, Building name"
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2 / पता पंक्ति 2
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Street, Area, Locality"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark / स्थान चिह्न
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Near famous location"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area / क्षेत्र
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Sector, Colony, etc."
                />
              </div>
            </div>

            {/* City, State, Pincode */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City / शहर *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State / राज्य *
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode / पिन कोड *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123456"
                  maxLength="6"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions / डिलीवरी निर्देश
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Any specific delivery instructions, gate code, etc."
                maxLength="300"
              />
            </div>

            {/* Address Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Address Features / पता की विशेषताएं
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'safe', label: 'Safe Area', icon: '🛡️' },
                  { value: 'secure_building', label: 'Secure Building', icon: '🏢' },
                  { value: 'no_lift', label: 'No Lift', icon: '🚶' },
                  { value: 'parking_available', label: 'Parking Available', icon: '🅿️' },
                  { value: 'gated_community', label: 'Gated Community', icon: '🏘️' },
                  { value: 'apartment', label: 'Apartment', icon: '🏬' },
                  { value: 'independent_house', label: 'Independent House', icon: '🏠' }
                ].map((tag) => (
                  <label key={tag.value} className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.addressTags.includes(tag.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            addressTags: [...prev.addressTags, tag.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            addressTags: prev.addressTags.filter(t => t !== tag.value)
                          }));
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                    />
                    <span className="mr-1 text-sm">{tag.icon}</span>
                    <span className="text-xs">{tag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                Set as default address / डिफ़ॉल्ट पता के रूप में सेट करें
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">{isEditing ? '✏️' : '✅'}</span>
                    {isEditing ? 'Update Address' : 'Add Address'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;