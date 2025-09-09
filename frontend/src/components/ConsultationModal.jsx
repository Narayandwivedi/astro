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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-3xl md:w-full max-h-[96vh] md:max-h-[92vh] overflow-y-auto shadow-2xl modal-scroll animate-slide-up md:animate-fade-in">
        
        {/* Mobile-Friendly Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4 md:p-6 rounded-t-3xl md:rounded-t-2xl">
          {/* Mobile swipe indicator */}
          <div className="md:hidden w-12 h-1 bg-white/30 rounded-full mx-auto mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
                <span className="text-lg md:text-xl">🆓</span>
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold">
                  Free Consultation
                </h2>
                <p className="text-orange-100 text-sm">निःशुल्क परामर्श</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 p-3 rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Free consultation highlights */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex items-center bg-white/20 rounded-lg px-2 py-1">
              <span className="text-sm mr-1">🎉</span>
              <span className="text-xs font-medium">100% FREE</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-lg px-2 py-1">
              <span className="text-sm mr-1">📞</span>
              <span className="text-xs font-medium">15-20 mins</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-lg px-2 py-1">
              <span className="text-sm mr-1">🔮</span>
              <span className="text-xs font-medium">Expert Guidance</span>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Form */}
        <div className="p-3 sm:p-4 md:p-6 bg-gray-50 pb-24 sm:pb-4 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">👤</span>
                Personal Information
                <span className="text-sm text-gray-600 ml-2">(व्यक्तिगत जानकारी)</span>
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
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Birth Details - Simplified */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-orange-600 mr-2">🌟</span>
                Birth Details (Optional)
                <span className="text-sm text-gray-600 ml-2">(जन्म विवरण)</span>
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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
              </div>
            </div>

            {/* Consultation Type - Simplified */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">🔮</span>
                What would you like to discuss?
                <span className="text-sm text-gray-600 ml-2">(परामर्श प्रकार)</span>
              </h3>
              <select
                id="consultationType"
                name="consultationType"
                value={formData.consultationType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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

            {/* Booking Preferences - Simplified */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-green-600 mr-2">📅</span>
                When would you like to talk?
                <span className="text-sm text-gray-600 ml-2">(पसंदीदा समय)</span>
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
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
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
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
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
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
                    
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
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
                    
                    <label className="flex flex-col items-center justify-center p-2 sm:p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none text-sm"
                    placeholder="Any specific questions or requirements..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Free Consultation Notice - Simplified */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">🆓</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-800">100% Free Consultation</h4>
                  <p className="text-green-700 text-sm">निःशुल्क परामर्श - No charges apply!</p>
                </div>
              </div>
            </div>

            {/* Submit Buttons - Mobile Optimized */}
            <div className="bg-white p-3 sm:p-4 -m-3 sm:-m-4 border-t border-gray-200 md:bg-transparent md:p-0 md:border-t-0 md:m-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-base active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-4 rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-1">🚀</span>
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;