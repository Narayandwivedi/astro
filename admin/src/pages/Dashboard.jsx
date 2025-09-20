import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/analytics/dashboard`);
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700 font-semibold">Error</div>
          <div className="text-red-600">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color = 'blue', change = null }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Astro Satya Admin Dashboard</p>
      </div>

      {dashboardData && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={dashboardData.overview.totalBookings}
              icon="📅"
              color="blue"
            />
            <StatCard
              title="Total Orders"
              value={dashboardData.overview.totalOrders}
              icon="🛒"
              color="green"
            />
            <StatCard
              title="Total Users"
              value={dashboardData.overview.totalUsers}
              icon="👥"
              color="purple"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardData.overview.totalRevenue)}
              icon="💰"
              color="yellow"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Services"
              value={dashboardData.overview.totalServices}
              icon="🔮"
              color="indigo"
            />
            <StatCard
              title="Active Products"
              value={dashboardData.overview.totalProducts}
              icon="📦"
              color="pink"
            />
            <StatCard
              title="Pending Bookings"
              value={dashboardData.status.bookings.pending}
              icon="⏳"
              color="orange"
            />
            <StatCard
              title="Pending Orders"
              value={dashboardData.status.orders.pending}
              icon="⏰"
              color="red"
            />
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Booking Status */}
            <ChartCard title="Booking Status Overview">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.bookings.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-gray-700">Completed</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.bookings.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="text-gray-700">Cancelled</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.bookings.cancelled}</span>
                </div>
              </div>
            </ChartCard>

            {/* Order Status */}
            <ChartCard title="Order Status Overview">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.orders.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-gray-700">Completed</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.orders.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="text-gray-700">Cancelled</span>
                  </div>
                  <span className="font-semibold">{dashboardData.status.orders.cancelled}</span>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Bookings */}
            <ChartCard title="Recent Bookings">
              <div className="space-y-3">
                {dashboardData.recent.bookings.length > 0 ? (
                  dashboardData.recent.bookings.map((booking, index) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold text-gray-800">{booking.name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.serviceId?.titleEn || 'General Consultation'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(booking.servicePrice || 0)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent bookings</p>
                )}
              </div>
            </ChartCard>

            {/* Recent Orders */}
            <ChartCard title="Recent Orders">
              <div className="space-y-3">
                {dashboardData.recent.orders.length > 0 ? (
                  dashboardData.recent.orders.map((order, index) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold text-gray-800">{order.customer?.name || 'Unknown Customer'}</p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} item(s)
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(order.pricing?.total || 0)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
              </div>
            </ChartCard>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <ChartCard title="Top Performing Services">
              <div className="space-y-3">
                {dashboardData.topPerformers.services.length > 0 ? (
                  dashboardData.topPerformers.services.map((service, index) => (
                    <div key={service._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">{service.serviceName}</p>
                          <p className="text-sm text-gray-600">{service.bookingCount} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(service.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No service data available</p>
                )}
              </div>
            </ChartCard>

            {/* Top Products */}
            <ChartCard title="Top Performing Products">
              <div className="space-y-3">
                {dashboardData.topPerformers.products.length > 0 ? (
                  dashboardData.topPerformers.products.map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">{product.productName}</p>
                          <p className="text-sm text-gray-600">{product.orderCount} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(product.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No product data available</p>
                )}
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;