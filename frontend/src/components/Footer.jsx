import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white relative overflow-hidden">
      {/* Cosmic Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-1/2 w-12 h-12 border border-white/25 rounded-full transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 border border-white/15 rounded-full"></div>
        <div className="absolute bottom-8 right-16 w-14 h-14 border border-white/20 rounded-full"></div>
      </div>
      
      {/* Cosmic Stars */}
      <div className="absolute inset-0 cosmic-stars opacity-30"></div>
      
      <div className="container mx-auto px-4 lg:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-xl text-white">🕉️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200">
                  ASTRO SATYA PRAKASH
                </h3>
                <p className="text-xs text-purple-200 font-medium uppercase tracking-wider">
                  Vedic Astrology
                </p>
              </div>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Experience the wisdom of Vedic Astrology with Acharya Satya Prakash Tripathi. 
              10+ years of expertise in guiding lives through ancient wisdom.
            </p>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/satyaprakashtr757/?igsh=MTRkM2xzZW1jbHNqcw%3D%3D" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a 
                href="https://x.com/Satyapr09522228?t=Ugux-IMwLGahYNOCvqWJWA&s=09" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/satyaprakashtr7578?rdid=eujLlzACcul5YlPt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1YFpR13YPn%2F" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@satyaprakashtr7578" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-200 border-b border-purple-700/50 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Shop', path: '/shop' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-purple-200 hover:text-indigo-200 text-sm hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-200 border-b border-indigo-700/50 pb-2">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Kundali Reading
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Business Consultation
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Marriage Astrology
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Vastu Shastra
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Gemstone Consultation
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-amber-200 transition-colors duration-200 cursor-pointer hover:underline"
                >
                  • Muhurat Selection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-200 border-b border-amber-700/50 pb-2">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">+91 8839453431</p>
                  <p className="text-indigo-300 text-xs">Available 9 AM - 8 PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-purple-200 text-xs whitespace-nowrap">satyaprakashtripathi7578@gmail.com</p>
                  <p className="text-indigo-300 text-xs">For consultations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-amber-200 text-sm">Varanasi, Uttar Pradesh</p>
                  <p className="text-amber-300 text-xs">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-purple-200 text-sm">
              © 2024 Astro Satya Prakash. All rights reserved.
            </p>
            <p className="text-indigo-300 text-xs mt-1">
              Guided by ancient wisdom, empowering modern lives
            </p>
          </div>
          
          <div className="flex space-x-6 text-xs">
            <Link 
              to="/privacy" 
              className="text-purple-200 hover:text-indigo-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-purple-200 hover:text-indigo-200"
            >
              Terms of Service
            </Link>
            <Link 
              to="/disclaimer" 
              className="text-purple-200 hover:text-indigo-200"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer