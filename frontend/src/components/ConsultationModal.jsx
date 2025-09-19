import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ConsultationModal = ({ isOpen, onClose }) => {
  const { BACKEND_URL } = useContext(AppContext);
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
    consultationType: '',
    preferredDate: '',
    preferredDay: '',
    preferredMonth: '',
    preferredYear: '',
    preferredTime: '',
    consultationMethod: 'phone',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show toast notification
  const showSuccessToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000); // Show for 4 seconds
  };

  // Time slots for consultation
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Generate years (from 1920 to current year for birth, current year to +2 years for consultation)
  const getBirthYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1920; year--) {
      years.push(year);
    }
    return years;
  };

  const getConsultationYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1];
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle mobile number formatting
    if (name === 'mobile') {
      let cleanValue = value.replace(/\D/g, ''); // Remove all non-digits
      
      // If it starts with 91 and is longer than 10 digits, assume it includes country code
      if (cleanValue.startsWith('91') && cleanValue.length > 10) {
        cleanValue = cleanValue.substring(2); // Remove the 91 prefix
      }
      
      // Limit to 10 digits
      cleanValue = cleanValue.substring(0, 10);
      
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Update the combined birthTime when individual time components change
      if (name === 'birthTimeHour' || name === 'birthTimeMinute' || name === 'birthTimeAmPm') {
        const hour = name === 'birthTimeHour' ? value : prev.birthTimeHour;
        const minute = name === 'birthTimeMinute' ? value : prev.birthTimeMinute;
        const ampm = name === 'birthTimeAmPm' ? value : prev.birthTimeAmPm;
        
        if (hour && minute && ampm) {
          newData.birthTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${ampm}`;
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

      // Update the combined preferredDate when individual date components change
      if (name === 'preferredDay' || name === 'preferredMonth' || name === 'preferredYear') {
        const day = name === 'preferredDay' ? value : prev.preferredDay;
        const month = name === 'preferredMonth' ? value : prev.preferredMonth;
        const year = name === 'preferredYear' ? value : prev.preferredYear;
        
        if (day && month && year) {
          newData.preferredDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a general consultation booking
      const bookingData = {
        serviceId: null,
        serviceName: `General Consultation - ${formData.consultationType || 'General Reading'}`,
        servicePrice: 0,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthState: formData.birthState,
        birthCity: formData.birthCity,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        consultationType: formData.consultationMethod,
        specialRequests: `Consultation Type: ${formData.consultationType}${formData.specialRequests ? `\nSpecial Requests: ${formData.specialRequests}` : ''}`
      };

      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit consultation request');
      }

      const result = await response.json();
      
      // Show success toast
      showSuccessToast();
      
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
        consultationType: '',
        preferredDate: '',
        preferredDay: '',
        preferredMonth: '',
        preferredYear: '',
        preferredTime: '',
        consultationMethod: 'phone',
        specialRequests: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Consultation submission error:', error);
      alert('Failed to submit consultation request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-3xl md:w-full max-h-[96vh] md:max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-200/50">
        
        {/* Enhanced Cosmic Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white p-4 md:p-6 rounded-t-3xl md:rounded-t-2xl relative overflow-hidden">
          {/* Cosmic Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 w-12 h-12 border border-white/25 rounded-full transform -translate-x-1/2"></div>
          </div>
          
          {/* Floating Stars */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-6 right-20 text-amber-300/40">✨</div>
            <div className="absolute top-12 left-20 text-amber-200/30">⭐</div>
            <div className="absolute bottom-8 right-12 text-amber-400/35">🌟</div>
          </div>

          {/* Mobile swipe indicator */}
          <div className="md:hidden w-12 h-1 bg-white/30 rounded-full mx-auto mb-3 relative z-10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30">
                <span className="text-lg md:text-xl">🆓</span>
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold drop-shadow-lg">
                  Free Consultation
                </h2>
                <p className="text-purple-100 text-sm font-medium">निःशुल्क परामर्श</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Free consultation highlights with cosmic theme */}
          <div className="flex flex-wrap gap-2 mt-3 relative z-10">
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
              <span className="text-sm mr-1">🎉</span>
              <span className="text-xs font-medium">100% FREE</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
              <span className="text-sm mr-1">📞</span>
              <span className="text-xs font-medium">15-20 mins</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30">
              <span className="text-sm mr-1">🔮</span>
              <span className="text-xs font-medium">Expert Guidance</span>
            </div>
          </div>
        </div>

        {/* Enhanced Cosmic Form */}
        <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-amber-50/40 pb-24 sm:pb-4 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Enhanced Personal Information */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 rounded-2xl border-2 border-blue-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-blue-200 text-3xl sm:text-5xl opacity-20">👤</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <span className="text-white text-sm sm:text-lg">👤</span>
                </div>
                <div>
                  <span className="text-gray-800 text-sm sm:text-lg">Personal Information</span>
                  <p className="text-xs text-blue-700 font-normal">(व्यक्तिगत जानकारी)</p>
                </div>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name / पूरा नाम *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number / मोबाइल नंबर *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      +91
                    </div>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      minLength="10"
                      maxLength="10"
                      className="w-full pl-12 pr-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      placeholder="9876543210"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit mobile number (without +91)
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address / ईमेल पता
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Birth Details */}
            <div className="relative bg-gradient-to-br from-purple-50 to-indigo-100 p-3 sm:p-4 rounded-2xl border-2 border-purple-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-purple-200 text-3xl sm:text-5xl opacity-20">🌟</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <span className="text-white text-sm sm:text-lg">🌟</span>
                </div>
                <div>
                  <span className="text-gray-800 text-sm sm:text-lg">Birth Details (Optional)</span>
                  <p className="text-xs text-purple-700 font-normal">(जन्म विवरण)</p>
                </div>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date / जन्म तिथि
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <select
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleInputChange}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
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
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">Min</option>
                      {[0, 15, 30, 45].map((minute) => {
                        const minuteStr = minute.toString().padStart(2, '0');
                        return (
                          <option key={minute} value={minuteStr}>
                            {minuteStr}
                          </option>
                        );
                      })}
                    </select>
                    
                    <select
                      name="birthTimeAmPm"
                      value={formData.birthTimeAmPm}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="birthState" className="block text-sm font-medium text-gray-700 mb-2">
                      Birth State / जन्म राज्य
                    </label>
                    <select
                      id="birthState"
                      name="birthState"
                      value={formData.birthState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select State</option>
                      {[
                        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
                        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
                        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
                        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
                        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 
                        'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
                      ].map((state) => (
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="Enter your birth city"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  * Birth details help provide more accurate consultation
                </p>
              </div>
            </div>

            {/* Enhanced Consultation Type */}
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 p-3 sm:p-4 rounded-2xl border-2 border-amber-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-amber-200 text-3xl sm:text-5xl opacity-20">🔮</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <span className="text-white text-sm sm:text-lg">🔮</span>
                </div>
                <div>
                  <span className="text-gray-800 text-sm sm:text-lg">What would you like to discuss?</span>
                  <p className="text-xs text-amber-700 font-normal">(परामर्श प्रकार)</p>
                </div>
              </h3>
              <select
                id="consultationType"
                name="consultationType"
                value={formData.consultationType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
              >
                <option value="">Select consultation type</option>
                <option value="general">General Reading</option>
                <option value="career">Career Guidance</option>
                <option value="marriage">Marriage & Love</option>
                <option value="health">Health Issues</option>
                <option value="financial">Financial Problems</option>
                <option value="family">Family Issues</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Enhanced Booking Preferences */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 p-3 sm:p-4 rounded-2xl border-2 border-green-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-green-200 text-3xl sm:text-5xl opacity-20">📅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <span className="text-white text-sm sm:text-lg">📅</span>
                </div>
                <div>
                  <span className="text-gray-800 text-sm sm:text-lg">When would you like to talk?</span>
                  <p className="text-xs text-green-700 font-normal">(पसंदीदा समय)</p>
                </div>
              </h3>
              
              <div className="space-y-4">
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you prefer to talk? / परामर्श विधि *
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <input
                        type="radio"
                        name="consultationMethod"
                        value="phone"
                        checked={formData.consultationMethod === 'phone'}
                        onChange={handleInputChange}
                        className="mb-1 text-green-500"
                      />
                      <span className="text-base sm:text-lg mb-1">📞</span>
                      <span className="text-xs sm:text-sm font-medium">Phone</span>
                    </label>
                    
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <input
                        type="radio"
                        name="consultationMethod"
                        value="video"
                        checked={formData.consultationMethod === 'video'}
                        onChange={handleInputChange}
                        className="mb-1 text-green-500"
                      />
                      <span className="text-base sm:text-lg mb-1">🎥</span>
                      <span className="text-xs sm:text-sm font-medium">Video</span>
                    </label>
                    
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-center">
                      <input
                        type="radio"
                        name="consultationMethod"
                        value="inperson"
                        checked={formData.consultationMethod === 'inperson'}
                        onChange={handleInputChange}
                        className="mb-1 text-green-500"
                      />
                      <span className="text-base sm:text-lg mb-1">🤝</span>
                      <span className="text-xs sm:text-sm font-medium">In Person</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                    Any specific questions? (Optional)
                    <span className="text-gray-600 ml-1">(विशेष अनुरोध)</span>
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                    placeholder="Any specific questions or requirements..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Enhanced Free Consultation Notice */}
            <div className="relative bg-gradient-to-br from-purple-50 to-indigo-100 p-4 rounded-2xl border-2 border-purple-200/60 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="absolute top-2 right-2 text-purple-200 text-4xl opacity-20">🆓</div>
              <div className="absolute inset-0 opacity-30"></div>
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-xl text-white">🆓</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                    100% Free Consultation
                  </h4>
                  <p className="text-purple-700 text-sm font-medium">निःशुल्क परामर्श - No charges apply!</p>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Buttons - Cosmic Theme */}
            <div className="bg-gradient-to-br from-white/80 to-purple-50/60 p-3 sm:p-4 -m-3 sm:-m-4 border-t border-purple-200/30 backdrop-blur-sm md:bg-transparent md:p-0 md:border-t-0 md:m-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold text-base shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white px-4 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🚀</span>
                      <span>Submit Free Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Success Toast Notification - Cosmic Theme */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm border border-purple-300/30 backdrop-blur-sm animate-pulse">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm">Free Consultation Requested!</p>
              <p className="text-xs text-purple-100">We'll contact you within 24 hours</p>
            </div>
            <div className="text-amber-300">✨</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationModal;