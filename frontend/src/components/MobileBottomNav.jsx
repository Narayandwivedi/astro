import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AppContext);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowAccountMenu(!showAccountMenu);
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = (path) => {
    setShowAccountMenu(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setShowAccountMenu(false);
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Professional Design */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg">
        <div className="safe-area-inset-bottom">
          <div className="flex justify-around items-center py-2 px-4">
            
            {/* Book Call Button */}
            <a
              href="tel:+91883945431"
              className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Call Now</span>
            </a>

            {/* Shop Button */}
            <Link
              to="/shop"
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mb-1 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Shop</span>
            </Link>

            {/* Account Section */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={handleAccountClick}
                className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shadow-sm ${
                  isAuthenticated ? 'bg-orange-500' : 'bg-gray-500'
                }`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {isAuthenticated ? 'Account' : 'Login'}
                </span>
              </button>

              {/* Account Dropdown Menu */}
              {showAccountMenu && isAuthenticated && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    onClick={() => handleMenuClick('/orders')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a1 1 0 001 1h6a1 1 0 001-1v-6M8 11h8" />
                    </svg>
                    <span>Orders</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('/bookings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                    <span>Bookings</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('/manage-addresses')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Manage Addresses</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  
                  <hr className="my-2 border-gray-100" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Consultation Modal */}
    </>
  )
}

export default MobileBottomNav