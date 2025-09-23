import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ManageBookings = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    mobile: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form states
  const [updateForm, setUpdateForm] = useState({
    status: '',
    confirmedDate: '',
    confirmedTime: '',
    meetingLink: '',
    adminNotes: '',
    paymentStatus: ''
  });

  const [communicationForm, setCommunicationForm] = useState({
    type: 'call',
    message: '',
    sentBy: 'admin'
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: '✅' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: '🎉' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' },
    { value: 'rescheduled', label: 'Rescheduled', color: 'bg-purple-100 text-purple-800', icon: '📅' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-red-100 text-red-800' }
  ];

  const consultationTypes = {
    phone: { icon: '📞', label: 'Phone Call' },
    video: { icon: '🎥', label: 'Video Call' },
    inperson: { icon: '🤝', label: 'In Person' }
  };

  // Fetch bookings and stats
  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      }).toString();

      const response = await fetch(`${BACKEND_URL}/api/admin/bookings?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${selectedBooking._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });

      const data = await response.json();

      if (data.success) {
        setIsUpdateModalOpen(false);
        fetchBookings();
        fetchStats();
        alert('Booking updated successfully!');
      } else {
        alert('Failed to update booking: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking');
    }
  };

  const handleAddCommunication = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${selectedBooking._id}/communication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communicationForm),
      });

      const data = await response.json();

      if (data.success) {
        setIsCommunicationModalOpen(false);
        setCommunicationForm({ type: 'call', message: '', sentBy: 'admin' });
        // Refresh booking details
        fetchBookingDetails(selectedBooking._id);
        alert('Communication added successfully!');
      } else {
        alert('Failed to add communication: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding communication:', error);
      alert('Error adding communication');
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedBooking(data.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const openUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setUpdateForm({
      status: booking.status,
      confirmedDate: booking.confirmedDate ? new Date(booking.confirmedDate).toISOString().split('T')[0] : '',
      confirmedTime: booking.confirmedTime || '',
      meetingLink: booking.meetingLink || '',
      adminNotes: booking.adminNotes || '',
      paymentStatus: booking.paymentStatus || 'pending'
    });
    setIsUpdateModalOpen(true);
  };

  const openCommunicationModal = (booking) => {
    setSelectedBooking(booking);
    setIsCommunicationModalOpen(true);
  };

  const getStatusDisplay = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return status;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        <span className="mr-1">{statusOption.icon}</span>
        {statusOption.label}
      </span>
    );
  };

  const getPaymentStatusDisplay = (paymentStatus) => {
    const statusOption = paymentStatusOptions.find(opt => opt.value === paymentStatus);
    if (!statusOption) return paymentStatus;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        {statusOption.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              📅 Booking Management
            </h1>
            <p className="text-blue-100 mt-1">Manage service appointments and consultations</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalBookings || 0}</div>
            <div className="text-sm text-blue-100">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyBookings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              placeholder="Search by mobile"
              value={filters.mobile}
              onChange={(e) => handleFilterChange('mobile', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Latest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="preferredDate-asc">Date (Upcoming)</option>
              <option value="preferredDate-desc">Date (Latest)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📅</div>
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {booking.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.serviceName}</div>
                      <div className="text-sm text-gray-500">₹{booking.servicePrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.preferredDate)}</div>
                      <div className="text-sm text-gray-500">{booking.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span className="mr-1">{consultationTypes[booking.consultationType]?.icon}</span>
                        {consultationTypes[booking.consultationType]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusDisplay(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusDisplay(booking.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => openUpdateModal(booking)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Update Booking"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openCommunicationModal(booking)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Add Communication"
                        >
                          💬
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-blue-100 mt-1">ID: BK{selectedBooking._id.slice(-6).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">👤</span>Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.name}</div>
                  <div><strong>Mobile:</strong> {selectedBooking.mobile}</div>
                  <div><strong>Email:</strong> {selectedBooking.email || 'Not provided'}</div>
                  <div><strong>Birth Date:</strong> {formatDate(selectedBooking.birthDate)}</div>
                  <div><strong>Birth Time:</strong> {selectedBooking.birthTime || 'Not provided'}</div>
                  <div><strong>Birth Place:</strong> {selectedBooking.birthCity ? `${selectedBooking.birthCity}, ${selectedBooking.birthState}` : 'Not provided'}</div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🔮</span>Service Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Service:</strong> {selectedBooking.serviceName}</div>
                  <div><strong>Price:</strong> ₹{selectedBooking.servicePrice}</div>
                  <div><strong>Consultation Type:</strong> 
                    <span className="ml-1">
                      {consultationTypes[selectedBooking.consultationType]?.icon} {consultationTypes[selectedBooking.consultationType]?.label}
                    </span>
                  </div>
                  <div><strong>Special Requests:</strong> {selectedBooking.specialRequests || 'None'}</div>
                </div>
              </div>

              {/* Booking Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📋</span>Booking Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Status:</strong> <span className="ml-2">{getStatusDisplay(selectedBooking.status)}</span></div>
                  <div><strong>Payment Status:</strong> <span className="ml-2">{getPaymentStatusDisplay(selectedBooking.paymentStatus)}</span></div>
                  <div><strong>Preferred Date:</strong> {formatDate(selectedBooking.preferredDate)}</div>
                  <div><strong>Preferred Time:</strong> {selectedBooking.preferredTime}</div>
                  <div><strong>Confirmed Date:</strong> {formatDate(selectedBooking.confirmedDate)}</div>
                  <div><strong>Confirmed Time:</strong> {selectedBooking.confirmedTime || 'Not set'}</div>
                  <div><strong>Meeting Link:</strong> {selectedBooking.meetingLink || 'Not set'}</div>
                  <div><strong>Created:</strong> {formatDateTime(selectedBooking.createdAt)}</div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedBooking.adminNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">📝</span>Admin Notes
                  </h3>
                  <p className="text-sm text-gray-700">{selectedBooking.adminNotes}</p>
                </div>
              )}

              {/* Communication History */}
              {selectedBooking.communicationHistory && selectedBooking.communicationHistory.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">💬</span>Communication History
                  </h3>
                  <div className="space-y-3">
                    {selectedBooking.communicationHistory.map((comm, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} - {comm.sentBy}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(comm.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comm.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Booking Modal */}
      {isUpdateModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Update Booking</h2>
                  <p className="text-green-100 mt-1">{selectedBooking.name} - {selectedBooking.serviceName}</p>
                </div>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {statusOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={updateForm.paymentStatus}
                    onChange={(e) => setUpdateForm({ ...updateForm, paymentStatus: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Date</label>
                  <input
                    type="date"
                    value={updateForm.confirmedDate}
                    onChange={(e) => setUpdateForm({ ...updateForm, confirmedDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 2:00 PM"
                    value={updateForm.confirmedTime}
                    onChange={(e) => setUpdateForm({ ...updateForm, confirmedTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz or Zoom link"
                  value={updateForm.meetingLink}
                  onChange={(e) => setUpdateForm({ ...updateForm, meetingLink: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  rows="3"
                  value={updateForm.adminNotes}
                  onChange={(e) => setUpdateForm({ ...updateForm, adminNotes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes about this booking..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {isCommunicationModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Add Communication</h2>
                  <p className="text-purple-100 mt-1">{selectedBooking.name}</p>
                </div>
                <button
                  onClick={() => setIsCommunicationModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddCommunication} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Type</label>
                <select
                  value={communicationForm.type}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="call">📞 Phone Call</option>
                  <option value="email">📧 Email</option>
                  <option value="sms">📱 SMS</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  value={communicationForm.message}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the communication details..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCommunicationModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Communication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;