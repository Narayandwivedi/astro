import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { AppContext } from '../context/AppContext';

// Add custom CSS animations
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = modalStyles;
  document.head.appendChild(styleSheet);
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const { BACKEND_URL, getImageURL } = useContext(AppContext);
  const { user, isAuthenticated } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Navigate to order details page
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
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

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping orders fetch');
        return;
      }
      
      console.log('=== FRONTEND DEBUG ===');
      console.log('Fetching orders for authenticated user');
      console.log('API Base URL:', BACKEND_URL);
      console.log('Full URL:', `${BACKEND_URL}/api/orders/user/my-orders`);
      
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/orders/user/my-orders`, {
          withCredentials: true, // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setOrders(response.data.data);
          console.log('Orders set:', response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
          console.log('API returned error:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        setError(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
        console.log('=== END FRONTEND DEBUG ===');
      }
    };

    fetchOrders();
  }, [BACKEND_URL, isAuthenticated]);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel || !cancelReason.trim()) return;
    
    const orderId = orderToCancel._id;
    setCancellingOrders(prev => new Set(prev).add(orderId));
    
    try {
      const response = await axios.put(`${BACKEND_URL}/api/orders/${orderId}/cancel`, {
        reason: cancelReason.trim()
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        // Update the order status in local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        
        // Close modal
        setShowCancelModal(false);
        setOrderToCancel(null);
        setCancelReason('');
        
        // Show success message with better styling
        const successMsg = response.data.message || 'Order cancelled successfully!';
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ${successMsg}
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
      } else {
        // Show error message with better styling
        const errorMsg = response.data.message || 'Failed to cancel order';
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            ${errorMsg}
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      const errorMsg = error.response?.data?.message || 'Failed to cancel order. Please try again.';
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          ${errorMsg}
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    } finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
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
                My Orders
              </h1>
              {orders.length > 0 && (
                <p className="text-gray-600 mt-1">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Orders List - Enhanced Cards with Product Images */
          <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {orders.map((order) => {
              // Get first 3 product images for preview
              const previewItems = order.items.slice(0, 3);
              const remainingCount = order.items.length - 3;
              
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  
                  {/* Order Header with Product Images */}
                  <div 
                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Order #{order._id}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusDisplay(order.status)}
                          </span>
                        </div>
                        <div className="ml-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Product Images Preview - Mobile */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          {previewItems.map((item, index) => (
                            <div key={index} className="relative">
                              <img
                                src={item.productImage ? getImageURL(item.productImage) : '/api/placeholder/60/60'}
                                alt={item.productName}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/api/placeholder/60/60';
                                }}
                              />
                              {item.quantity > 1 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                          {remainingCount > 0 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-600 font-medium">+{remainingCount}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                          {order.items.length > 2 && `... +${order.items.length - 2} more`}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {formatDate(order.orderDate)}
                          </span>
                          <span className="font-bold text-orange-600 text-lg">
                            ₹{order.pricing.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-1">📦</span>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {order._id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Layout - Single Line Layout */}
                    <div className="hidden sm:block">
                      {/* Header Row with Order Number and Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-800">
                            Order #{order._id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusDisplay(order.status)}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-orange-600 text-2xl">
                            ₹{order.pricing.total.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {order._id.slice(-8)}
                          </span>
                        </div>
                      </div>

                      {/* Main Content Row - Image, Product Names, and Date in one line */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Product Images */}
                          <div className="flex items-center space-x-2">
                            {previewItems.map((item, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={item.productImage ? getImageURL(item.productImage) : '/api/placeholder/60/60'}
                                  alt={item.productName}
                                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = '/api/placeholder/60/60';
                                  }}
                                />
                                {item.quantity > 1 && (
                                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                )}
                              </div>
                            ))}
                            {remainingCount > 0 && (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-600 font-medium">+{remainingCount}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Names */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                              {order.items.length > 2 && `... +${order.items.length - 2} more`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>

                        {/* Order Date and Arrow */}
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="mr-1">📅</span>
                              {formatDate(order.orderDate)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Order Date</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button Section - Always Visible for Cancellable Orders */}
                  {['pending', 'confirmed', 'processing'].includes(order.status) && (
                    <div className="border-t border-red-200 bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 px-3 sm:px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order);
                          }}
                          disabled={cancellingOrders.has(order._id)}
                          className="group relative flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transform active:scale-95 sm:hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm font-medium shadow-md touch-manipulation"
                        >
                          {cancellingOrders.has(order._id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              <span className="text-xs sm:text-sm">Cancelling...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-xs sm:text-sm">Cancel Order</span>
                            </>
                          )}
                          
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Cancel Order Modal */}
      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Cancel Order
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setOrderToCancel(null);
                    setCancelReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <span className="font-semibold">Order #{orderToCancel._id}</span>
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Total: ₹{orderToCancel.pricing.total.toLocaleString()}
                  </p>
                </div>
                
                <p className="text-gray-700 mb-3">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                
                <div className="mb-4">
                  <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Found better price elsewhere">Found better price elsewhere</option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Taking too long to deliver">Taking too long to deliver</option>
                    <option value="No longer needed">No longer needed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setOrderToCancel(null);
                    setCancelReason('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  disabled={!cancelReason.trim() || cancellingOrders.has(orderToCancel._id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center font-medium"
                >
                  {cancellingOrders.has(orderToCancel._id) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <span className="font-semibold">Note:</span> If payment was already made, refund will be processed within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;