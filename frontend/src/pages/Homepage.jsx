import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Navigation from '../components/Navigation'
import IntroBanner from '../components/IntroBanner'
import ConsultationModal from '../components/ConsultationModal'
import BookingModal from '../components/BookingModal'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'

const Homepage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { BACKEND_URL, getImageURL } = useContext(AppContext);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingToast, setShowBookingToast] = useState(false);
  const [bookedServiceName, setBookedServiceName] = useState('');

  const handleBookConsultation = () => {
    setIsConsultationModalOpen(true);
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  const handleBookingSuccess = (service) => {
    setBookedServiceName(service?.titleEn || 'Service');
    setShowBookingToast(true);
    setTimeout(() => {
      setShowBookingToast(false);
    }, 4000); // Show for 4 seconds
  };

  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    addToCart(product, 1);
  };

  const handleBuyNow = (product, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    addToCart(product, 1);
    navigate('/cart');
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/services/popular?limit=6`);
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data);
        } else {
          setServicesError('Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setServicesError('Failed to load services');
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/products?limit=6&featured=true`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setProductsError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProductsError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <Navigation />
      <IntroBanner />
      <Hero onBookConsultation={handleBookConsultation} />

      {/* Get in Touch Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 border-b border-purple-100 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-amber-700 bg-clip-text text-transparent mb-3">
              Get in Touch
            </h2>
            <p className="text-purple-700 mb-6 font-medium">
              संपर्क करें - Connect with Pandit Satya Prakash Tripathi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Phone Contact */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl text-orange-600">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">Phone</h3>
                    <p className="text-xl font-bold text-orange-600">+91 8839453431</p>
                  </div>
                </div>
                <a 
                  href="tel:+918839453431"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                >
                  Call Now
                </a>
              </div>
            </div>
            
            {/* Email Contact */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl text-purple-600">📧</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-purple-800">Email</h3>
                    <p className="text-xs font-semibold text-purple-600 whitespace-nowrap">satyaprakashtripathi7578@gmail.com</p>
                  </div>
                </div>
                <a 
                  href="mailto:satyaprakashtripathi7578@gmail.com?subject=Consultation%20Inquiry&body=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center whitespace-nowrap"
                >
                  Email Now
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Available: 9:00 AM - 8:00 PM (IST) | Response within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/50 rounded-full px-6 py-2 mb-6">
              <span className="text-amber-700 text-sm font-semibold">🕉️ Our Premium Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-800 to-amber-800 bg-clip-text text-transparent mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-amber-600">Services</span>
            </h2>
            <p className="text-lg text-purple-800 max-w-2xl mx-auto font-medium">
              हमारी सेवाएं - जीवन की हर समस्या का समाधान
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {servicesLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : servicesError ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <div className="text-red-500 text-lg font-semibold">{servicesError}</div>
                <p className="text-gray-600 mt-2">Please try refreshing the page</p>
              </div>
            ) : services.length === 0 ? (
              // No services state
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500 text-lg font-semibold">No services available</div>
                <p className="text-gray-400 mt-2">Services will appear here once they are added</p>
              </div>
            ) : (
              // Services list
              services.map((service) => (
              <div key={service._id} className="group relative bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl transition-all duration-300 md:duration-500 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-1 md:hover:-translate-y-3 hover:scale-[1.01] md:hover:scale-[1.02] cursor-pointer"
                onClick={() => navigate(`/services/${service._id}`)}
              >
                
                {/* Cosmic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500"></div>
                
                {/* Read More Arrow */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4 z-20 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 shadow-lg">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Service Header - Mobile Optimized */}
                <div className="relative p-3 md:p-4 text-center">
                  {/* Icon with Glow Effect */}
                  <div className="relative inline-flex items-center justify-center mb-3 md:mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full blur-md md:blur-lg opacity-20 md:opacity-30 group-hover:opacity-40 md:group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg md:shadow-xl border-2 border-gray-300">
                      <span className="text-lg md:text-2xl filter drop-shadow-lg">{service.icon}</span>
                    </div>
                  </div>
                  
                  {/* Service Title - Mobile Optimized */}
                  <h3 className="text-sm md:text-lg font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-700 bg-clip-text text-transparent mb-1 md:mb-2 group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-amber-600 transition-all duration-300 leading-tight">
                    {service.titleEn}
                  </h3>
                  <p className="text-purple-600 text-xs md:text-sm font-medium mb-3">{service.titleHi}</p>
                </div>

                {/* Pricing Section - Mobile Optimized */}
                <div className="px-3 md:px-4 mb-3 md:mb-4">
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-purple-100 shadow-inner">
                    {/* Mobile: Stacked Layout, Desktop: Three columns */}
                    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
                      {/* Price - Prominent on mobile */}
                      <div className="text-center md:flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Price</p>
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                          ₹{service.price}
                        </span>
                      </div>
                      
                      {/* Mobile: Horizontal divider, Desktop: Vertical */}
                      <div className="h-px md:h-12 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-purple-200 to-transparent md:mx-4"></div>
                      
                      {/* Duration only on mobile, Duration & Status on desktop */}
                      <div className="flex justify-center md:justify-between md:flex-1">
                        <div className="text-center flex-1 md:flex-none">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Duration</p>
                          <span className="text-xs md:text-sm font-semibold text-gray-700">{service.duration}</span>
                        </div>
                        
                        {/* Desktop divider */}
                        <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-4"></div>
                        
                        {/* Status - Desktop only */}
                        <div className="hidden md:block text-center flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Status</p>
                          <div className="flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-xs font-bold text-emerald-600">
                              {service.isActive ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Mobile: Button only, Desktop: Review + Button */}
                <div className="px-3 md:px-4 pb-3 md:pb-4">

                  {/* Book Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookService(service);
                    }}
                    disabled={!service.isActive}
                    className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-bold py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="mr-2 md:mr-3 text-base md:text-xl">📅</span>
                      <span className="text-sm md:text-base font-semibold tracking-wide">
                        {service.isActive ? 'Book Now' : 'Unavailable'}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-500/60"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Our Shop Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50 relative overflow-hidden">
        {/* Cosmic stars background */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-amber-500/20 backdrop-blur-sm border border-purple-300/50 rounded-full px-6 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">🛍️ Our Sacred Shop</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 via-indigo-800 to-amber-800 bg-clip-text text-transparent mb-4">
              Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600">Products</span>
            </h2>
            <p className="text-lg text-purple-800 max-w-2xl mx-auto font-medium">
              पवित्र उत्पाद - Authentic Spiritual Items for Your Well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : productsError ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <div className="text-red-500 text-lg font-semibold">{productsError}</div>
                <p className="text-gray-600 mt-2">Please try refreshing the page</p>
              </div>
            ) : products.length === 0 ? (
              // No products state
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500 text-lg font-semibold">No products available</div>
                <p className="text-gray-400 mt-2">Products will appear here once they are added</p>
              </div>
            ) : (
              // Products list
              products.map((product) => (
              <Link 
                key={product._id} 
                to={`/shop/product/${product._id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 cursor-pointer block"
              >
                
                {/* Product Image - Clean Image Only */}
                {product.images && product.images.length > 0 && (
                  <div className="h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-50 relative flex items-center justify-center p-4">
                    <img 
                      src={getImageURL(product.images[0])}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-4xl">🔸</span></div>';
                      }}
                    />
                  </div>
                )}

                {/* Product Info - Amazon Style */}
                <div className="p-3">
                  {/* Product Name */}
                  <div className="mb-2">
                    <h3 className="text-gray-800 font-medium text-sm sm:text-base line-clamp-2 leading-tight">{product.name}</h3>
                    {product.nameHi && (
                      <p className="text-gray-600 text-xs mt-1">{product.nameHi}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg sm:text-xl font-bold text-purple-600">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {product.inStock ? (
                    <div className="flex gap-2">
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm flex items-center justify-center"
                      >
                        <span className="mr-1">🛒</span>
                        <span>Add to Cart</span>
                      </button>

                      {/* Buy Now Button */}
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center justify-center"
                      >
                        <span className="mr-1">⚡</span>
                        <span>Buy</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg cursor-not-allowed opacity-60 text-sm flex items-center justify-center"
                    >
                      <span className="mr-1">❌</span>
                      <span>Out of Stock</span>
                    </button>
                  )}
                </div>
              </Link>
            ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/shop"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-500/60"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsConsultationModalOpen(false)} 
      />

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={closeBookingModal} 
        selectedService={selectedService}
        onSuccess={handleBookingSuccess} 
      />

      {/* Booking Success Toast */}
      {showBookingToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[70] animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-md border border-green-300/30 backdrop-blur-sm">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Booking Successful! 🎉</p>
              <p className="text-sm text-green-100 mt-1">
                {bookedServiceName} booking confirmed. We'll contact you within 24 hours.
              </p>
            </div>
            <button 
              onClick={() => setShowBookingToast(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Homepage
