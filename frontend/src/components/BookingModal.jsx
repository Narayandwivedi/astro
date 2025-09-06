import React, { useState, useEffect } from 'react';

const BookingModal = ({ isOpen, onClose, selectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    birthDate: '',
    birthTime: '',
    birthState: '',
    birthCity: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'phone',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Time slots for consultation
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

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

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        serviceId: selectedService?._id,
        serviceName: selectedService?.titleEn,
        servicePrice: selectedService?.price
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      
      alert(`Thank you ${formData.name}! Your booking for ${selectedService?.titleEn} has been submitted successfully. Booking ID: ${result.data._id}. We will contact you on ${formData.mobile} within 24 hours.`);
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        email: '',
        birthDate: '',
        birthTime: '',
        birthState: '',
        birthCity: '',
        preferredDate: '',
        preferredTime: '',
        consultationType: 'phone',
        specialRequests: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !selectedService) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200/50">
        {/* Enhanced Modal Header with Mystic Design */}
        <div className="relative bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 text-white p-6 md:p-8 rounded-t-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 w-12 h-12 border border-white/25 rounded-full transform -translate-x-1/2"></div>
          </div>
          
          {/* Floating Stars */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-6 right-20 text-white/30 animate-pulse">✨</div>
            <div className="absolute top-12 left-20 text-white/20 animate-pulse delay-300">⭐</div>
            <div className="absolute bottom-8 right-12 text-white/25 animate-pulse delay-700">🌟</div>
          </div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                  <span className="text-3xl">{selectedService.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                    Book {selectedService.titleEn}
                  </h2>
                  <p className="text-orange-100 text-base md:text-lg font-medium">{selectedService.titleHi}</p>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mt-4 border border-white/30">
                <div className="flex flex-wrap items-center gap-6 text-white">
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">💰</span>
                    <div>
                      <span className="font-bold text-lg">₹{selectedService.price}</span>
                      <span className="text-xs block text-orange-100">Investment</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">⏱️</span>
                    <div>
                      <span className="font-bold text-lg">{selectedService.duration}</span>
                      <span className="text-xs block text-orange-100">Duration</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">🔮</span>
                    <div>
                      <span className="font-bold text-lg">{selectedService.category}</span>
                      <span className="text-xs block text-orange-100">Category</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-all duration-300 ml-4 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Modal Body */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-orange-50/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Enhanced Personal Information */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border-2 border-blue-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-blue-200 text-6xl opacity-20">👤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white text-lg">👤</span>
                </div>
                <div>
                  <span className="text-gray-800">Personal Information</span>
                  <p className="text-sm text-blue-700 font-normal">व्यक्तिगत जानकारी</p>
                </div>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name / पूरा नाम *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
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
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="mt-4">
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

            {/* Enhanced Birth Details */}
            <div className="relative bg-gradient-to-br from-orange-50 to-yellow-100 p-6 rounded-2xl border-2 border-orange-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-orange-200 text-6xl opacity-20">🌟</div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white text-lg">🌟</span>
                </div>
                <div>
                  <span className="text-gray-800">Birth Details</span>
                  <p className="text-sm text-orange-700 font-normal">जन्म विवरण</p>
                </div>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date / जन्म तिथि
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Time / जन्म समय
                  </label>
                  <input
                    type="time"
                    id="birthTime"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthState" className="block text-sm font-medium text-gray-700 mb-2">
                    Birth State / जन्म राज्य
                  </label>
                  <select
                    id="birthState"
                    name="birthState"
                    value={formData.birthState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthCity" className="block text-sm font-medium text-gray-700 mb-2">
                    Birth City / जन्म शहर
                  </label>
                  <input
                    type="text"
                    id="birthCity"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your birth city"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                * Birth details help provide more accurate consultation
              </p>
            </div>

            {/* Enhanced Booking Preferences */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-green-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-green-200 text-6xl opacity-20">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white text-lg">📅</span>
                </div>
                <div>
                  <span className="text-gray-800">Booking Preferences</span>
                  <p className="text-sm text-green-700 font-normal">बुकिंग प्राथमिकताएं</p>
                </div>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date / पसंदीदा तारीख *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={getMinDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time / पसंदीदा समय *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Type / परामर्श प्रकार *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consultationType"
                      value="phone"
                      checked={formData.consultationType === 'phone'}
                      onChange={handleInputChange}
                      className="mr-2 text-orange-500"
                    />
                    <span className="mr-2">📞</span>
                    <span className="text-sm">Phone Call</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consultationType"
                      value="video"
                      checked={formData.consultationType === 'video'}
                      onChange={handleInputChange}
                      className="mr-2 text-orange-500"
                    />
                    <span className="mr-2">🎥</span>
                    <span className="text-sm">Video Call</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consultationType"
                      value="inperson"
                      checked={formData.consultationType === 'inperson'}
                      onChange={handleInputChange}
                      className="mr-2 text-orange-500"
                    />
                    <span className="mr-2">🤝</span>
                    <span className="text-sm">In Person</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests / विशेष अनुरोध
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Any specific questions or requirements..."
                ></textarea>
              </div>
            </div>

            {/* Enhanced Total Cost */}
            <div className="relative bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-2xl border-2 border-yellow-300/60 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="absolute top-4 right-4 text-yellow-200 text-6xl opacity-20">💰</div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    Total Investment / कुल लागत
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-orange-600 block">
                      ₹{selectedService.price}
                    </span>
                    <span className="text-sm text-amber-700">One-time fee</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-yellow-300/40">
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span className="flex items-center">
                      <span className="mr-2">⏱️</span>
                      <strong>Duration:</strong> {selectedService.duration}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-2">🔮</span>
                      <strong>Category:</strong> {selectedService.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🔮</span>
                    Confirm Booking
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

export default BookingModal;