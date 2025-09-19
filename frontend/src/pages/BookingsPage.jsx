import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { AppContext } from '../context/AppContext';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { BACKEND_URL, getImageURL } = useContext(AppContext);
  const { user, isAuthenticated } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookings, setExpandedBookings] = useState(new Set());

  // Toggle booking details dropdown
  const toggleBookingDetails = (bookingId) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/bookings/user/my-bookings`, {
          withCredentials: true, // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [BACKEND_URL, isAuthenticated]);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'rescheduled': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending Confirmation',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'rescheduled': 'Rescheduled'
    };
    return statusMap[status] || status;
  };

  const getConsultationTypeDisplay = (type) => {
    const typeMap = {
      'phone': 'Phone Call',
      'video': 'Video Call',
      'inperson': 'In Person'
    };
    return typeMap[type] || type;
  };

  const getConsultationTypeIcon = (type) => {
    const iconMap = {
      'phone': '📞',
      'video': '📹',
      'inperson': '👤'
    };
    return iconMap[type] || '💬';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })} at ${timeString}`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect
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
                My Bookings
              </h1>
              {bookings.length > 0 && (
                <p className="text-gray-600 mt-1">
                  {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          /* Loading State */
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Bookings</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't made any service bookings yet. Book a consultation to see your appointments here!
            </p>
            <button
              onClick={() => navigate('/services')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Book a Service
            </button>
          </div>
        ) : (
          /* Bookings List - Compact Cards with Dropdown */
          <div className="space-y-3">
            {bookings.map((booking) => {
              const isExpanded = expandedBookings.has(booking._id);
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Compact Header - Always Visible */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleBookingDetails(booking._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {booking.serviceName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusDisplay(booking.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {formatDateTime(booking.preferredDate, booking.preferredTime)}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">{getConsultationTypeIcon(booking.consultationType)}</span>
                            {getConsultationTypeDisplay(booking.consultationType)}
                          </span>
                          <span className="font-semibold text-orange-600">
                            ₹{booking.servicePrice?.toLocaleString() || '0'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500 font-mono">
                          Booking ID: {booking._id}
                        </span>
                        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Hidden by Default */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      <div className="p-4 space-y-4">
                        
                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Left Column - Appointment & Birth Details */}
                          <div className="space-y-3">
                            {/* Appointment Details */}
                            <div className="bg-blue-50 rounded-lg p-3">
                              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                <span className="mr-2">📅</span>
                                Appointment Details
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Date:</span> {formatDate(booking.preferredDate)}</p>
                                <p><span className="font-medium">Time:</span> {booking.preferredTime}</p>
                                <p><span className="font-medium">Type:</span> {getConsultationTypeDisplay(booking.consultationType)}</p>
                                {booking.status === 'confirmed' && booking.confirmedDate && (
                                  <p className="text-green-600 font-medium">
                                    ✅ Confirmed for {formatDateTime(booking.confirmedDate, booking.confirmedTime || booking.preferredTime)}
                                  </p>
                                )}
                                {booking.meetingLink && (
                                  <a
                                    href={booking.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 underline"
                                  >
                                    <span className="mr-1">📹</span>
                                    Join Meeting
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Birth Details */}
                            {(booking.birthDate || booking.birthTime || booking.birthCity) && (
                              <div className="bg-purple-50 rounded-lg p-3">
                                <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                                  <span className="mr-2">🌟</span>
                                  Birth Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  {booking.birthDate && (
                                    <p><span className="font-medium">Date:</span> {formatDate(booking.birthDate)}</p>
                                  )}
                                  {booking.birthTime && (
                                    <p><span className="font-medium">Time:</span> {booking.birthTime}</p>
                                  )}
                                  {booking.birthCity && (
                                    <p><span className="font-medium">Place:</span> {booking.birthCity}, {booking.birthState}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Column - Contact & Payment */}
                          <div className="space-y-3">
                            {/* Contact Information */}
                            <div className="bg-gray-100 rounded-lg p-3">
                              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                <span className="mr-2">👤</span>
                                Contact Information
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {booking.name}</p>
                                <p><span className="font-medium">Mobile:</span> {booking.mobile}</p>
                                {booking.email && (
                                  <p><span className="font-medium">Email:</span> {booking.email}</p>
                                )}
                              </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-green-50 rounded-lg p-3">
                              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <span className="mr-2">💳</span>
                                Payment Details
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-700">
                                  ₹{booking.servicePrice?.toLocaleString() || '0'}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  booking.paymentStatus === 'paid' 
                                    ? 'bg-green-100 text-green-800'
                                    : booking.paymentStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'pending' ? 'Pending' : 'Refunded'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Booked on {formatDate(booking.createdAt)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Booking ID: {booking._id}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                              <span className="mr-2">📝</span>
                              Special Requests
                            </h4>
                            <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                          </div>
                        )}

                        {/* Admin Notes */}
                        {booking.adminNotes && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                              <span className="mr-2">📢</span>
                              Notes from Pandit Ji
                            </h4>
                            <p className="text-sm text-blue-700">{booking.adminNotes}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {booking.meetingLink && booking.status === 'confirmed' && (
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Join Meeting
                            </a>
                          )}
                          
                          {booking.status === 'completed' && (
                            <button
                              onClick={() => navigate('/services')}
                              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Book Again
                            </button>
                          )}
                          
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  console.log('Cancel booking:', booking._id);
                                }
                              }}
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;