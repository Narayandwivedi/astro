import React from 'react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Services',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: '🔮',
      color: 'blue'
    },
    {
      title: 'Active Bookings',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: '📅',
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+45',
      changeType: 'positive',
      icon: '👥',
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: '₹45,680',
      change: '+8%',
      changeType: 'positive',
      icon: '💰',
      color: 'amber'
    }
  ]

  const recentBookings = [
    {
      id: 1,
      service: 'Kundli Reading',
      customer: 'Rahul Sharma',
      date: '2024-08-23',
      time: '10:30 AM',
      status: 'confirmed',
      amount: '₹1,500'
    },
    {
      id: 2,
      service: 'Business Problems',
      customer: 'Priya Patel',
      date: '2024-08-23',
      time: '2:00 PM',
      status: 'pending',
      amount: '₹2,000'
    },
    {
      id: 3,
      service: 'Marriage Problems',
      customer: 'Amit Kumar',
      date: '2024-08-24',
      time: '11:00 AM',
      status: 'confirmed',
      amount: '₹1,800'
    },
    {
      id: 4,
      service: 'Vastu Consultation',
      customer: 'Sunita Devi',
      date: '2024-08-24',
      time: '4:30 PM',
      status: 'completed',
      amount: '₹2,500'
    }
  ]

  const popularServices = [
    { name: 'Kundli Reading', bookings: 89, icon: '🔮' },
    { name: 'Marriage Problems', bookings: 67, icon: '💕' },
    { name: 'Business Problems', bookings: 45, icon: '💼' },
    { name: 'Vastu Consultation', bookings: 34, icon: '🏛️' },
    { name: 'Gemstone Consultation', bookings: 23, icon: '💎' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 🙏</h1>
            <p className="text-amber-100">Here's what's happening with Astro Satya today</p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl opacity-50">🕉️</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? '↗' : '↘'} {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">this month</span>
                </div>
              </div>
              <div className="text-4xl opacity-80">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{booking.service}</div>
                    <div className="text-sm text-gray-600">{booking.customer}</div>
                    <div className="text-xs text-gray-500">{booking.date} at {booking.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{booking.amount}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Popular Services</h2>
              <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {popularServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${(service.bookings / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{service.bookings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">➕</div>
              <div className="font-semibold text-gray-900">Add New Service</div>
              <div className="text-sm text-gray-600">Create a new astrology service</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Check performance metrics</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold text-gray-900">System Settings</div>
              <div className="text-sm text-gray-600">Configure admin settings</div>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
          <p className="text-sm text-gray-600">August 23, 2024</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <div>
                <div className="font-semibold text-gray-900">Kundli Reading - Rahul Sharma</div>
                <div className="text-sm text-gray-600">10:30 AM - 11:30 AM</div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Upcoming
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
              <div>
                <div className="font-semibold text-gray-900">Business Problems - Priya Patel</div>
                <div className="text-sm text-gray-600">2:00 PM - 3:00 PM</div>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Pending Confirmation
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <div>
                <div className="font-semibold text-gray-900">Vastu Consultation - Sunita Devi</div>
                <div className="text-sm text-gray-600">4:30 PM - 5:30 PM</div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard