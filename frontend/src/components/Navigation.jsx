import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;


  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white py-4 shadow-lg">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center">
          
          {/* Mobile Menu Button - Left (mobile only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-light transition-colors duration-200 mr-4"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute block w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                isMenuOpen ? 'top-3 rotate-45' : 'top-1'
              }`}></span>
              <span className={`absolute block w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'top-3'
              }`}></span>
              <span className={`absolute block w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                isMenuOpen ? 'top-3 -rotate-45' : 'top-5'
              }`}></span>
            </div>
          </button>

          {/* Logo - Left on desktop, center on mobile */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center space-x-3 group flex-1 lg:flex-none justify-center lg:justify-start lg:mr-8">
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 border-gradient-to-r from-orange-400/30 to-yellow-400/30 rounded-full animate-spin-slow opacity-50"></div>
              
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/50 to-yellow-400/50 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-700 -z-10 scale-125 animate-pulse"></div>
              
              {/* Secondary glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-all duration-500 scale-110"></div>
              
              {/* Main logo container */}
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-600 via-amber-500 via-yellow-500 to-orange-400 rounded-full shadow-2xl flex items-center justify-center border-3 border-white/30 group-hover:border-white/50 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-110 relative overflow-hidden backdrop-blur-sm">
                
                {/* Rotating inner gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/40 via-transparent to-orange-400/40 rounded-full animate-spin-slow"></div>
                
                {/* Inner shine effect */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-full"></div>
                
                {/* Sacred geometry - outer ring */}
                <div className="absolute inset-2 border border-white/20 rounded-full opacity-60"></div>
                
                {/* Sacred geometry - inner elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/40 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/20 rounded-full"></div>
                </div>
                
                {/* Center point */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                
                {/* Logo image */}
                <img 
                  src="/logo.png" 
                  alt="Astro Satya Prakash Logo" 
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 object-contain drop-shadow-2xl filter relative z-20 group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                
                {/* Enhanced Fallback OM symbol */}
                <div className="relative z-20 group-hover:scale-110 transition-transform duration-300" style={{display: 'none'}}>
                  <span className="text-xl md:text-2xl lg:text-3xl text-white drop-shadow-2xl filter">🕉️</span>
                  <div className="absolute inset-0 text-xl md:text-2xl lg:text-3xl text-yellow-200/50 drop-shadow-2xl animate-pulse">🕉️</div>
                  <div className="absolute inset-0 text-xl md:text-2xl lg:text-3xl text-white/20 drop-shadow-2xl animate-pulse delay-300">🕉️</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 tracking-wide leading-tight">
                ASTRO SATYA
              </h1>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 tracking-wide leading-tight -mt-1">
                PRAKASH
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Center on desktop */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.scrollTo(0, 0)}
                className={`relative px-1 py-2 font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
                )}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-6 ml-4 lg:ml-0">
            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login</span>
            </button>


            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="p-2 rounded-lg glass-light hover:bg-gray-100 transition-colors duration-200 relative group"
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              {/* Cart count badge */}
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 mt-4 border-t border-gray-300">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  {item.name}
                </Link>
              ))}
              

              {/* Cart option in mobile menu */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/cart');
                }}
                className="px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                  <span>Cart</span>
                </div>
                {getCartItemsCount() > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navigation;