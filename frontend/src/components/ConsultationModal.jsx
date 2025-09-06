import React, { useState, useEffect } from 'react';

const ConsultationModal = ({ isOpen, onClose }) => {
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

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
    const years = [];
    for (let year = currentYear; year <= currentYear + 2; year++) {
      years.push(year);
    }
    return years;
  };

  // Generate months
  const months = [
    { value: '01', name: 'January', hindi: 'जनवरी' },
    { value: '02', name: 'February', hindi: 'फरवरी' },
    { value: '03', name: 'March', hindi: 'मार्च' },
    { value: '04', name: 'April', hindi: 'अप्रैल' },
    { value: '05', name: 'May', hindi: 'मई' },
    { value: '06', name: 'June', hindi: 'जून' },
    { value: '07', name: 'July', hindi: 'जुलाई' },
    { value: '08', name: 'August', hindi: 'अगस्त' },
    { value: '09', name: 'September', hindi: 'सितंबर' },
    { value: '10', name: 'October', hindi: 'अक्टूबर' },
    { value: '11', name: 'November', hindi: 'नवंबर' },
    { value: '12', name: 'December', hindi: 'दिसंबर' }
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

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
        // Use null for serviceId and set default values for general consultation
        serviceId: null,
        serviceName: `General Consultation - ${formData.consultationType || 'General Reading'}`,
        servicePrice: 0, // Free consultation
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

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit consultation request');
      }

      const result = await response.json();
      
      alert(`Thank you ${formData.name}! Your consultation request has been submitted successfully. Booking ID: ${result.data._id}. We will contact you on ${formData.mobile} within 24 hours.`);
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200/50">
        {/* Enhanced Modal Header with Mystical Design */}
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white p-6 md:p-8 rounded-t-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 w-12 h-12 border border-white/25 rounded-full transform -translate-x-1/2"></div>
          </div>
          
          {/* Floating Stars */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-6 right-20 text-white/30 animate-pulse">🌟</div>
            <div className="absolute top-12 left-20 text-white/20 animate-pulse delay-300">✨</div>
            <div className="absolute bottom-8 right-12 text-white/25 animate-pulse delay-700">💫</div>
          </div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                  <span className="text-3xl">🆓</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                    Free Consultation Request
                  </h2>
                  <p className="text-green-100 text-base md:text-lg font-medium">निःशुल्क ज्योतिष परामर्श के लिए फॉर्म भरें</p>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mt-4 border border-white/30">
                <div className="flex flex-wrap items-center gap-6 text-white">
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">🎉</span>
                    <div>
                      <span className="font-bold text-lg">100% FREE</span>
                      <span className="text-xs block text-green-100">No Cost</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">📞</span>
                    <div>
                      <span className="font-bold text-lg">15-20 mins</span>
                      <span className="text-xs block text-green-100">Duration</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xl mr-2">🔮</span>
                    <div>
                      <span className="font-bold text-lg">General Reading</span>
                      <span className="text-xs block text-green-100">Category</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-all duration-300 ml-4 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Modal Body */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-green-50/30">
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
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="text-orange-500 mr-2">📅</span>
                    Birth Date / जन्म तिथि
                  </label>
                  <div className="grid grid-cols-3 gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    {/* Day Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-orange-400 pointer-events-none">
                        📅
                      </div>
                      <select
                        name="birthDay"
                        value={formData.birthDay}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 text-sm font-medium hover:border-orange-300"
                      >
                        <option value="" className="text-gray-400">Day</option>
                        {getDaysInMonth(formData.birthMonth, formData.birthYear).map((day) => (
                          <option key={day} value={day.toString().padStart(2, '0')}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Month Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-orange-400 pointer-events-none">
                        🗓️
                      </div>
                      <select
                        name="birthMonth"
                        value={formData.birthMonth}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 text-sm font-medium hover:border-orange-300"
                      >
                        <option value="" className="text-gray-400">Month</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Year Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-orange-400 pointer-events-none">
                        📊
                      </div>
                      <select
                        name="birthYear"
                        value={formData.birthYear}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 text-sm font-medium hover:border-orange-300"
                      >
                        <option value="" className="text-gray-400">Year</option>
                        {getBirthYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.birthDate && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-700 font-medium flex items-center">
                        <span className="mr-2">✨</span>
                        Selected: {new Date(formData.birthDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        <span className="ml-2">🎂</span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Time / जन्म समय
                  </label>
                  <div className="flex gap-2 items-center">
                    {/* Hour Dropdown */}
                    <div className="flex-1">
                      <select
                        name="birthTimeHour"
                        value={formData.birthTimeHour}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
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
                    </div>
                    
                    <span className="text-gray-500 font-bold">:</span>
                    
                    {/* Minute Dropdown */}
                    <div className="flex-1">
                      <select
                        name="birthTimeMinute"
                        value={formData.birthTimeMinute}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Min</option>
                        {Array.from({ length: 60 }, (_, i) => {
                          const minute = i.toString().padStart(2, '0');
                          return (
                            <option key={minute} value={minute}>
                              {minute}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    
                    {/* AM/PM Dropdown */}
                    <div className="flex-1">
                      <select
                        name="birthTimeAmPm"
                        value={formData.birthTimeAmPm}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  {formData.birthTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected time: {formData.birthTime}
                    </p>
                  )}
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

            {/* Enhanced Consultation Type */}
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl border-2 border-purple-200/60 shadow-lg backdrop-blur-sm">
              <div className="absolute top-4 right-4 text-purple-200 text-6xl opacity-20">🔮</div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white text-lg">🔮</span>
                </div>
                <div>
                  <span className="text-gray-800">Consultation Type</span>
                  <p className="text-sm text-purple-700 font-normal">परामर्श प्रकार</p>
                </div>
              </h3>
              <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Area of Interest
              </label>
              <select
                id="consultationType"
                name="consultationType"
                value={formData.consultationType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              >
                <option value="">Select consultation type</option>
                <option value="general">General Reading / सामान्य राशिफल</option>
                <option value="career">Career Guidance / करियर मार्गदर्शन</option>
                <option value="marriage">Marriage & Love / विवाह और प्रेम</option>
                <option value="health">Health Issues / स्वास्थ्य समस्याएं</option>
                <option value="financial">Financial Problems / वित्तीय समस्याएं</option>
                <option value="family">Family Issues / पारिवारिक समस्याएं</option>
                <option value="education">Education / शिक्षा</option>
                <option value="business">Business / व्यापार</option>
                <option value="gemstone">Gemstone Consultation / रत्न परामर्श</option>
                <option value="other">Other / अन्य</option>
              </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="text-green-500 mr-2">🗓️</span>
                    Preferred Date / पसंदीदा तारीख *
                  </label>
                  <div className="grid grid-cols-3 gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    {/* Day Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-green-400 pointer-events-none">
                        📅
                      </div>
                      <select
                        name="preferredDay"
                        value={formData.preferredDay}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 text-sm font-medium hover:border-green-300"
                      >
                        <option value="" className="text-gray-400">Day</option>
                        {getDaysInMonth(formData.preferredMonth, formData.preferredYear).map((day) => {
                          const minDate = getMinDateParts();
                          const isDisabled = formData.preferredYear && formData.preferredMonth && 
                            (parseInt(formData.preferredYear) < minDate.year || 
                             (parseInt(formData.preferredYear) === minDate.year && 
                              parseInt(formData.preferredMonth) === minDate.month && 
                              day < minDate.day));
                          
                          return (
                            <option key={day} value={day.toString().padStart(2, '0')} disabled={isDisabled} className={isDisabled ? 'text-gray-300' : ''}>
                              {day}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    
                    {/* Month Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-green-400 pointer-events-none">
                        🗓️
                      </div>
                      <select
                        name="preferredMonth"
                        value={formData.preferredMonth}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 text-sm font-medium hover:border-green-300"
                      >
                        <option value="" className="text-gray-400">Month</option>
                        {months.map((month) => {
                          const minDate = getMinDateParts();
                          const isDisabled = formData.preferredYear && 
                            (parseInt(formData.preferredYear) < minDate.year || 
                             (parseInt(formData.preferredYear) === minDate.year && 
                              parseInt(month.value) < minDate.month));
                          
                          return (
                            <option key={month.value} value={month.value} disabled={isDisabled} className={isDisabled ? 'text-gray-300' : ''}>
                              {month.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    
                    {/* Year Dropdown */}
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-green-400 pointer-events-none">
                        📊
                      </div>
                      <select
                        name="preferredYear"
                        value={formData.preferredYear}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-white border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 text-sm font-medium hover:border-green-300"
                      >
                        <option value="" className="text-gray-400">Year</option>
                        {getConsultationYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.preferredDate && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium flex items-center">
                        <span className="mr-2">✅</span>
                        Selected: {new Date(formData.preferredDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          weekday: 'long'
                        })}
                        <span className="ml-2">🌟</span>
                      </p>
                    </div>
                  )}
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

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Consultation Method / परामर्श विधि *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="relative flex items-center p-4 bg-white/70 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all duration-300 group">
                    <input
                      type="radio"
                      name="consultationMethod"
                      value="phone"
                      checked={formData.consultationMethod === 'phone'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-colors ${
                      formData.consultationMethod === 'phone' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.consultationMethod === 'phone' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">📞</span>
                      <div>
                        <span className="font-medium text-gray-800">Phone Call</span>
                        <p className="text-xs text-gray-600">Voice consultation</p>
                      </div>
                    </div>
                    {formData.consultationMethod === 'phone' && (
                      <div className="absolute top-2 right-2 text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                  
                  <label className="relative flex items-center p-4 bg-white/70 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all duration-300 group">
                    <input
                      type="radio"
                      name="consultationMethod"
                      value="video"
                      checked={formData.consultationMethod === 'video'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-colors ${
                      formData.consultationMethod === 'video' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.consultationMethod === 'video' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">🎥</span>
                      <div>
                        <span className="font-medium text-gray-800">Video Call</span>
                        <p className="text-xs text-gray-600">Face-to-face consultation</p>
                      </div>
                    </div>
                    {formData.consultationMethod === 'video' && (
                      <div className="absolute top-2 right-2 text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                  
                  <label className="relative flex items-center p-4 bg-white/70 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all duration-300 group">
                    <input
                      type="radio"
                      name="consultationMethod"
                      value="inperson"
                      checked={formData.consultationMethod === 'inperson'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-colors ${
                      formData.consultationMethod === 'inperson' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.consultationMethod === 'inperson' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">🤝</span>
                      <div>
                        <span className="font-medium text-gray-800">In Person</span>
                        <p className="text-xs text-gray-600">Physical meeting</p>
                      </div>
                    </div>
                    {formData.consultationMethod === 'inperson' && (
                      <div className="absolute top-2 right-2 text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-3">
                  Special Requests / विशेष अनुरोध
                </label>
                <div className="relative">
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-300 hover:border-green-200 transition-all duration-200 resize-none"
                    placeholder="Any specific questions or requirements you would like to discuss during the consultation..."
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
                    Optional
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Free Consultation Notice */}
            <div className="relative bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300/50 shadow-lg overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-2 left-4 text-6xl">🎉</div>
                <div className="absolute bottom-2 right-4 text-4xl">✨</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl">🆓</div>
              </div>
              
              {/* Floating sparkles */}
              <div className="absolute top-3 right-8 text-yellow-400 animate-pulse">✨</div>
              <div className="absolute bottom-4 left-8 text-amber-400 animate-pulse delay-300">🌟</div>
              
              <div className="relative flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-6 shadow-lg animate-pulse">
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-amber-700 mb-2">100% Free Consultation</h4>
                  <p className="text-amber-800 font-medium text-lg">This is a complimentary consultation session - absolutely no charges apply!</p>
                  <p className="text-yellow-700 text-sm mt-1">नि:शुल्क परामर्श सत्र - कोई शुल्क नहीं!</p>
                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center bg-white/50 rounded-full px-3 py-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      <span className="text-sm font-medium text-green-800">No Hidden Costs</span>
                    </div>
                    <div className="flex items-center bg-white/50 rounded-full px-3 py-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                      <span className="text-sm font-medium text-blue-800">Expert Guidance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Enhanced Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2 text-xl">🚀</span>
                      <span>Submit Free Consultation Request</span>
                      <span className="ml-2 text-xl animate-bounce">✨</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;