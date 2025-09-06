import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: '📊',
      path: '/',
      description: 'Overview & Analytics'
    },
    {
      name: 'Orders',
      icon: '📦',
      path: '/orders',
      description: 'Manage Customer Orders'
    },
    {
      name: 'Services',
      icon: '🔮',
      path: '/services',
      description: 'Manage Astrology Services'
    },
    {
      name: 'Products',
      icon: '🛍️',
      path: '/products',
      description: 'Manage Shop Products'
    },
    {
      name: 'Blogs',
      icon: '📝',
      path: '/blogs',
      description: 'Manage Blog Posts'
    },
    {
      name: 'Bookings',
      icon: '📅',
      path: '/bookings',
      description: 'Service Appointments'
    },
    {
      name: 'Customers',
      icon: '👥',
      path: '/customers',
      description: 'Customer Management'
    },
    {
      name: 'Analytics',
      icon: '📈',
      path: '/analytics',
      description: 'Reports & Statistics'
    },
    {
      name: 'Settings',
      icon: '⚙️',
      path: '/settings',
      description: 'System Configuration'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 shadow-2xl`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-orange-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🕉️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                  ASTRO SATYA
                </h1>
                <p className="text-xs text-orange-200 font-medium">
                  Admin Panel
                </p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-orange-200 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Close Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 shadow-lg'
                  : 'hover:bg-white/10 hover:border border-transparent hover:border-yellow-400/20'
              }`}
            >
              <span className={`text-xl ${isActive(item.path) ? 'text-yellow-300' : 'text-orange-200 group-hover:text-yellow-300'}`}>
                {item.icon}
              </span>
              <div>
                <div className={`font-semibold ${isActive(item.path) ? 'text-yellow-100' : 'text-orange-100 group-hover:text-white'}`}>
                  {item.name}
                </div>
                <div className={`text-xs ${isActive(item.path) ? 'text-yellow-200' : 'text-orange-300 group-hover:text-orange-200'}`}>
                  {item.description}
                </div>
              </div>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-600/30">
          <div className="flex items-center space-x-3 px-4 py-3 bg-black/20 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div>
              <div className="font-semibold text-yellow-100">Admin User</div>
              <div className="text-xs text-orange-300">Super Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar