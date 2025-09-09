import React, { useState, useEffect } from 'react';
import AddressSelector from './AddressSelector';

const BookingModal = ({ isOpen, onClose, selectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    birthDate: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    birthTime: '',
    birthTimeHour: '',
    birthTimeMinute: '',
    birthTimeAmPm: 'AM',
    birthState: '',
    birthCity: '',
    preferredDate: '',
    preferredDay: '',
    preferredMonth: '',
    preferredYear: '',
    preferredTime: '',
    consultationType: 'phone',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

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

  // Generate years for consultation (current year to +1 year)
  const getConsultationYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1];
  };

  // Generate years for birth (from 1920 to current year)
  const getBirthYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1920; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate months
  const months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return Array.from({ length: 31 }, (_, i) => i + 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Get minimum date parts for consultation date
  const getMinDateParts = () => {
    const today = new Date();
    return {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };
  };

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
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Update the combined preferredDate when individual date components change
      if (name === 'preferredDay' || name === 'preferredMonth' || name === 'preferredYear') {
        const day = name === 'preferredDay' ? value : prev.preferredDay;
        const month = name === 'preferredMonth' ? value : prev.preferredMonth;
        const year = name === 'preferredYear' ? value : prev.preferredYear;
        
        if (day && month && year) {
          newData.preferredDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }

      // Update the combined birthDate when individual date components change
      if (name === 'birthDay' || name === 'birthMonth' || name === 'birthYear') {
        const day = name === 'birthDay' ? value : prev.birthDay;
        const month = name === 'birthMonth' ? value : prev.birthMonth;
        const year = name === 'birthYear' ? value : prev.birthYear;
        
        if (day && month && year) {
          newData.birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }

      // Update the combined birthTime when individual time components change
      if (name === 'birthTimeHour' || name === 'birthTimeMinute' || name === 'birthTimeAmPm') {
        const hour = name === 'birthTimeHour' ? value : prev.birthTimeHour;
        const minute = name === 'birthTimeMinute' ? value : prev.birthTimeMinute;
        const ampm = name === 'birthTimeAmPm' ? value : prev.birthTimeAmPm;
        
        if (hour && minute && ampm) {
          newData.birthTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${ampm}`;
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        serviceId: service._id,
        serviceName: service.titleEn,
        servicePrice: service.price,
        address: selectedAddress
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
      
      alert(`Thank you ${formData.name}! Your booking for ${service.titleEn} has been submitted successfully. Booking ID: ${result.data._id}. We will contact you on ${formData.mobile} within 24 hours.`);
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        email: '',
        birthDate: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        birthTime: '',
        birthTimeHour: '',
        birthTimeMinute: '',
        birthTimeAmPm: 'AM',
        birthState: '',
        birthCity: '',
        preferredDate: '',
        preferredDay: '',
        preferredMonth: '',
        preferredYear: '',
        preferredTime: '',
        consultationType: 'phone',
        specialRequests: ''
      });
      setSelectedAddress(null);
      
      onClose();
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Handle case when selectedService is null (free consultation)
  const service = selectedService || {
    titleEn: 'Free Consultation',
    titleHi: 'निःशुल्क परामर्श',
    icon: '🆓',
    price: 0,
    duration: '15-20 min',
    category: 'General'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200/50 animate-fade-in">
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
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                    Book {service.titleEn}
                  </h2>
                  <p className="text-orange-100 text-base md:text-lg font-medium">{service.titleHi}</p>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 sm:p-4 mt-4 border border-white/30">
                <div className="flex items-center justify-center gap-4 sm:gap-8 text-white">
                  <div className="flex items-center bg-white/10 rounded-md sm:rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                    <span className="text-base sm:text-xl mr-2">💰</span>
                    <div className="text-center">
                      <span className="font-bold text-sm sm:text-lg block">₹{service.price}</span>
                      <span className="text-xs text-orange-100 hidden sm:block">Investment</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-md sm:rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                    <span className="text-base sm:text-xl mr-2">⏱️</span>
                    <div className="text-center">
                      <span className="font-bold text-sm sm:text-lg block">{service.duration?.includes('min') ? service.duration : `${service.duration} min`}</span>
                      <span className="text-xs text-orange-100 hidden sm:block">Duration</span>
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
        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-orange-50/30 pb-20 md:pb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Enhanced Personal Information */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-2xl border-2 border-blue-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-blue-200 text-4xl sm:text-6xl opacity-20">👤</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                  <span className="text-white text-sm sm:text-lg">👤</span>
                </div>
                <div>
                  <span className="text-gray-800 text-base sm:text-xl">Personal Information</span>
                  <p className="text-xs sm:text-sm text-blue-700 font-normal">व्यक्तिगत जानकारी</p>
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
            <div className="relative bg-gradient-to-br from-orange-50 to-yellow-100 p-4 sm:p-6 rounded-2xl border-2 border-orange-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-orange-200 text-4xl sm:text-6xl opacity-20">🌟</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                  <span className="text-white text-sm sm:text-lg">🌟</span>
                </div>
                <div>
                  <span className="text-gray-800 text-base sm:text-xl">Birth Details</span>
                  <p className="text-xs sm:text-sm text-orange-700 font-normal">जन्म विवरण</p>
                </div>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date / जन्म तिथि
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <select
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Day</option>
                      {getDaysInMonth(formData.birthMonth, formData.birthYear).map((day) => (
                        <option key={day} value={day.toString().padStart(2, '0')}>
                          {day}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.name.slice(0, 3)}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      name="birthYear"
                      value={formData.birthYear}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Year</option>
                      {getBirthYears().slice(0, 80).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Time / जन्म समय
                  </label>
                  <div className="flex gap-2 items-center">
                    <select
                      name="birthTimeHour"
                      value={formData.birthTimeHour}
                      onChange={handleInputChange}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Hour</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 1;
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                    
                    <span className="text-gray-500 font-bold">:</span>
                    
                    <select
                      name="birthTimeMinute"
                      value={formData.birthTimeMinute}
                      onChange={handleInputChange}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Min</option>
                      {Array.from({ length: 60 }, (_, i) => {
                        const minuteStr = i.toString().padStart(2, '0');
                        return (
                          <option key={i} value={minuteStr}>
                            {minuteStr}
                          </option>
                        );
                      })}
                    </select>
                    
                    <select
                      name="birthTimeAmPm"
                      value={formData.birthTimeAmPm}
                      onChange={handleInputChange}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
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
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 rounded-2xl border-2 border-green-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-green-200 text-4xl sm:text-6xl opacity-20">📅</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                  <span className="text-white text-sm sm:text-lg">📅</span>
                </div>
                <div>
                  <span className="text-gray-800 text-base sm:text-xl">Booking Preferences</span>
                  <p className="text-xs sm:text-sm text-green-700 font-normal">बुकिंग प्राथमिकताएं</p>
                </div>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date / पसंदीदा तारीख *
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <select
                      name="preferredDay"
                      value={formData.preferredDay}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Day</option>
                      {getDaysInMonth(formData.preferredMonth, formData.preferredYear)
                        .filter((day) => {
                          const minDate = getMinDateParts();
                          // Only show future dates
                          return !(formData.preferredYear && formData.preferredMonth && 
                            (parseInt(formData.preferredYear) < minDate.year || 
                             (parseInt(formData.preferredYear) === minDate.year && 
                              parseInt(formData.preferredMonth) === minDate.month && 
                              day < minDate.day)));
                        })
                        .map((day) => (
                          <option key={day} value={day.toString().padStart(2, '0')}>
                            {day}
                          </option>
                        ))}
                    </select>
                    
                    <select
                      name="preferredMonth"
                      value={formData.preferredMonth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Month</option>
                      {months
                        .filter((month) => {
                          const minDate = getMinDateParts();
                          // Only show future months
                          return !(formData.preferredYear && 
                            (parseInt(formData.preferredYear) < minDate.year || 
                             (parseInt(formData.preferredYear) === minDate.year && 
                              parseInt(month.value) < minDate.month)));
                        })
                        .map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.name.slice(0, 3)}
                          </option>
                        ))}
                    </select>
                    
                    <select
                      name="preferredYear"
                      value={formData.preferredYear}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Year</option>
                      {getConsultationYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
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
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
                    <input
                      type="radio"
                      name="consultationType"
                      value="phone"
                      checked={formData.consultationType === 'phone'}
                      onChange={handleInputChange}
                      className="mb-1 text-orange-500"
                    />
                    <span className="text-base sm:text-lg mb-1">📞</span>
                    <span className="text-xs sm:text-sm font-medium">Phone</span>
                  </label>
                  <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
                    <input
                      type="radio"
                      name="consultationType"
                      value="video"
                      checked={formData.consultationType === 'video'}
                      onChange={handleInputChange}
                      className="mb-1 text-orange-500"
                    />
                    <span className="text-base sm:text-lg mb-1">🎥</span>
                    <span className="text-xs sm:text-sm font-medium">Video</span>
                  </label>
                  <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
                    <input
                      type="radio"
                      name="consultationType"
                      value="inperson"
                      checked={formData.consultationType === 'inperson'}
                      onChange={handleInputChange}
                      className="mb-1 text-orange-500"
                    />
                    <span className="text-base sm:text-lg mb-1">🤝</span>
                    <span className="text-xs sm:text-sm font-medium">In Person</span>
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

            {/* Address Selection */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6 rounded-2xl border-2 border-purple-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-purple-200 text-4xl sm:text-6xl opacity-20">🏠</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center relative z-10">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
                  <span className="text-white text-sm sm:text-lg">🏠</span>
                </div>
                <div>
                  <span className="text-gray-800 text-base sm:text-xl">Service Address</span>
                  <p className="text-xs sm:text-sm text-purple-700 font-normal">सेवा पता (यदि आवश्यक हो)</p>
                </div>
              </h3>
              
              <div className="relative z-10">
                <AddressSelector
                  onSelectAddress={setSelectedAddress}
                  selectedAddress={selectedAddress}
                  required={false}
                />
                <p className="text-sm text-gray-600 mt-3">
                  * Address is optional for phone/video consultations, required for in-person meetings
                </p>
              </div>
            </div>

            {/* Enhanced Total Cost */}
            <div className="relative bg-gradient-to-br from-yellow-50 to-amber-100 p-4 sm:p-6 rounded-2xl border-2 border-yellow-300/60 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="absolute top-4 right-4 text-yellow-200 text-4xl sm:text-6xl opacity-20">💰</div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                  <span className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                    <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                      <span className="text-white text-sm sm:text-lg">💰</span>
                    </div>
                    <span className="text-sm sm:text-xl">Total Investment / कुल लागत</span>
                  </span>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-bold text-orange-600 block">
                      ₹{service.price}
                    </span>
                    <span className="text-xs sm:text-sm text-amber-700">One-time fee</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-yellow-300/40">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm text-gray-700">
                    <span className="flex items-center">
                      <span className="mr-1 sm:mr-2">⏱️</span>
                      <strong>Duration:</strong> <span className="ml-1">{service.duration?.includes('min') ? service.duration : `${service.duration} min`}</span>
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1 sm:mr-2">🔮</span>
                      <strong>Category:</strong> <span className="ml-1">{service.category}</span>
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