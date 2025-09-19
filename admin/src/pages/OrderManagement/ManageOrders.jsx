import React, { useState, useEffect } from 'react';
import { useApi } from '../../context/ApiContext';

const ManageOrders = () => {
  const api = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    processing: 'bg-purple-100 text-purple-800 border-purple-300',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    refunded: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${api.baseURL}/api/orders/admin/all?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, adminNotes = '') => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`${api.baseURL}/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminNotes 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh orders list
        fetchOrders();
        setShowOrderModal(false);
        setSelectedOrder(null);
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600 text-2xl mr-3">⚠️</div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Orders</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Order Management</h1>
        <p className="text-orange-100">Manage customer orders, update status, and track deliveries</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order number, customer name, phone..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <button
              onClick={fetchOrders}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600">No orders match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Order</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Items</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Payment</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            #{order._id}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} items
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.customer.phone}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-gray-600">
                              {item.productName} × {item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-gray-500 text-xs">
                              +{order.items.length - 2} more...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(order.pricing.total)}
                        </div>
                        {order.pricing.shipping > 0 && (
                          <div className="text-sm text-gray-600">
                            +{formatCurrency(order.pricing.shipping)} shipping
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="text-sm font-medium">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                          {order.paymentDetails?.utrNumber && (
                            <div className="text-xs text-gray-600">
                              UTR: {order.paymentDetails.utrNumber}
                            </div>
                          )}
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            order.paymentDetails?.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentDetails?.paymentStatus || order.paymentStatus}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || statusColors.pending}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details - #{selectedOrder._id}</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                  <div className="text-gray-600">
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              {item.productNameHi && <div className="text-sm text-gray-600">{item.productNameHi}</div>}
                              {item.specifications && <div className="text-sm text-gray-600">Specs: {item.specifications}</div>}
                            </div>
                          </td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">{formatCurrency(item.price)}</td>
                          <td className="p-3 font-medium">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{selectedOrder.pricing.shipping === 0 ? 'FREE' : formatCurrency(selectedOrder.pricing.shipping)}</span>
                  </div>
                  {selectedOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(selectedOrder.pricing.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.pricing.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Update Order Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Status: <span className={`px-2 py-1 rounded text-xs ${statusColors[selectedOrder.status]}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    {statusOptions.slice(1).map(status => (
                      <button
                        key={status.value}
                        onClick={() => updateOrderStatus(selectedOrder._id, status.value)}
                        disabled={updatingStatus || selectedOrder.status === status.value}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          selectedOrder.status === status.value
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        } disabled:opacity-50`}
                      >
                        {updatingStatus ? '⏳' : status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedOrder.specialRequirements && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Special Requirements</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-gray-700">{selectedOrder.specialRequirements}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;