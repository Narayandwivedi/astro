import React from 'react'

const Header = ({ sidebarOpen, setSidebarOpen, title = "Dashboard" }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Side - Menu Toggle & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-amber-900">{title}</h1>
            <p className="text-sm text-amber-700">Astro Satya Admin Panel</p>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">24</div>
              <div className="text-xs text-gray-500">Active Services</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">156</div>
              <div className="text-xs text-gray-500">Total Bookings</div>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 18.5a1.5 1.5 0 01-1.5-1.5v-1a7.5 7.5 0 01.5-2.4l1-2.6h0A7.5 7.5 0 0112 3a7.5 7.5 0 010 15z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-gray-700">Admin User</div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header