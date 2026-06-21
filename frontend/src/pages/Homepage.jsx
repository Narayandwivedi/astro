import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Navigation from '../components/Navigation'
import ConsultationModal from '../components/ConsultationModal'
import BookingModal from '../components/BookingModal'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'

const Homepage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { BACKEND_URL, getImageURL } = useContext(AppContext);

  // SEO Optimization
  useEffect(() => {
    document.title = 'Astro Satya Prakash - Expert Vedic Astrology Services | Acharya Satya Prakash Tripathi';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get expert Vedic astrology guidance from Acharya Satya Prakash Tripathi. Professional kundali reading, marriage consultation, business astrology, vastu shastra, gemstone remedies. 10+ years experience in Varanasi.');
    }
  }, []);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const [blogsError, setBlogsError] = useState(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingToast, setShowBookingToast] = useState(false);
  const [bookedServiceName, setBookedServiceName] = useState('');
  const [isProductCarouselPaused, setIsProductCarouselPaused] = useState(false);
  const [isServiceCarouselPaused, setIsServiceCarouselPaused] = useState(false);

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

  // Fetch latest blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/blogs/published?limit=4`);
        const data = await response.json();

        if (data.success) {
          setBlogs(data.blogs);
        } else {
          setBlogsError('Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setBlogsError('Failed to load blogs');
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-slide product carousel (mobile only)
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      if (!isProductCarouselPaused && window.innerWidth < 768) {
        const container = document.querySelector('.hide-scrollbar');
        if (container) {
          const cardWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 0;
          const scrollAmount = cardWidth * 2;
          
          if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length, isProductCarouselPaused]);

  // Auto-slide service carousel (mobile only)
  useEffect(() => {
    if (services.length === 0) return;

    const interval = setInterval(() => {
      if (!isServiceCarouselPaused && window.innerWidth < 768) {
        const container = document.querySelector('.services-carousel');
        if (container) {
          const cardWidth = container.querySelector('.flex-shrink-0')?.offsetWidth || 0;
          const scrollAmount = cardWidth * 2;
          
          if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [services.length, isServiceCarouselPaused]);

  return (
    <>
      {/* Homepage Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Astro Satya Prakash",
            "description": "Expert Vedic astrology services by Acharya Satya Prakash Tripathi. Professional astrology consultations, kundali reading, vastu shastra, gemstone remedies.",
            "url": "https://astrosatyaprakash.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://astrosatyaprakash.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Astro Satya Prakash - Acharya Satya Prakash Tripathi",
              "image": "https://astrosatyaprakash.com/images/astro-satya-logo.jpg",
              "description": "Professional Vedic astrology services including kundali reading, marriage consultation, business guidance, vastu shastra, and gemstone remedies by experienced astrologer Acharya Satya Prakash Tripathi.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Varanasi",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 25.3176,
                "longitude": 82.9739
              },
              "url": "https://astrosatyaprakash.com",
              "telephone": "+91-8839453431",
              "email": "satyaprakashtripathi7578@gmail.com",
              "priceRange": "₹₹",
              "openingHours": "Mo-Su 09:00-20:00",
              "serviceType": "Astrology Services",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              }
            }
          })
        }}
      />

    <div className="w-full">
      <Navigation />
      <Hero onBookConsultation={handleBookConsultation} />

      <section className="pt-6 pb-3 md:pt-12 md:pb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 border-b border-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-amber-700 bg-clip-text text-transparent mb-2 md:mb-3">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-purple-700 font-medium">
              संपर्क करें - Connect with Pandit Satya Prakash Tripathi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto">
            <a href="tel:+918839453431" className="group">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 md:p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-lg md:text-2xl text-orange-600">📞</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm md:text-lg font-semibold text-amber-800">Phone</h3>
                      <p className="text-sm md:text-xl font-bold text-orange-600 truncate">+91 8839453431</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 md:w-auto md:h-auto bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-md group-hover:from-amber-700 group-hover:to-orange-700 transition-all flex-shrink-0">
                    <svg className="w-4 h-4 md:hidden text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="hidden md:inline text-white font-semibold px-4 py-2">Call Now</span>
                  </div>
                </div>
              </div>
            </a>
             
            <a href="mailto:satyaprakashtripathi7578@gmail.com?subject=Consultation%20Inquiry&body=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you." className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 md:p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-lg md:text-2xl text-purple-600">📧</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm md:text-lg font-semibold text-purple-800">Email</h3>
                      <p className="text-xs md:text-sm font-semibold text-purple-600 truncate">satyaprakashtripathi7578@gmail.com</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 md:w-auto md:h-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:from-indigo-700 group-hover:to-purple-700 transition-all flex-shrink-0">
                    <svg className="w-4 h-4 md:hidden text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="hidden md:inline text-white font-semibold px-4 py-2 whitespace-nowrap">Email Now</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          <div className="text-center mt-3 md:mt-6">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
              Available: 9:00 AM - 8:00 PM (IST)
            </p>
          </div>
        </div>
      </section>

      <section className="pt-8 pb-6 md:pt-16 md:pb-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/50 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-3 md:mb-6">
              <span className="text-amber-700 text-xs sm:text-sm font-semibold">🕉️ Our Premium Services</span>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-800 to-amber-800 bg-clip-text text-transparent mb-2 md:mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-amber-600">Services</span>
            </h2>
            <p className="text-sm md:text-lg text-purple-800 max-w-2xl mx-auto font-medium">
              हमारी सेवाएं - जीवन की हर समस्या का समाधान
            </p>
          </div>

          <div className="relative">
            {servicesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 md:p-6 animate-pulse">
                    <div className="h-3 bg-gray-300 rounded mb-2 md:mb-4"></div>
                    <div className="h-2 bg-gray-300 rounded mb-1 md:mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded mb-2 md:mb-4"></div>
                    <div className="h-6 md:h-8 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : servicesError ? (
              <div className="col-span-full text-center py-6 md:py-8">
                <div className="text-red-500 text-sm md:text-lg font-semibold">{servicesError}</div>
                <p className="text-gray-600 text-xs md:text-sm mt-2">Please try refreshing the page</p>
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-6 md:py-8">
                <div className="text-gray-500 text-sm md:text-lg font-semibold">No services available</div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">Services will appear here once they are added</p>
              </div>
            ) : (
              <div className="relative">
                <div 
                  onMouseEnter={() => setIsServiceCarouselPaused(true)}
                  onMouseLeave={() => setIsServiceCarouselPaused(false)}>
                  <div className="flex md:hidden overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scroll-smooth services-carousel" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {services.map((service) => (
                      <div key={service._id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-1 cursor-pointer block flex-shrink-0 w-[calc(50%-6px)] snap-start"
                        onClick={() => navigate(`/services/${service._id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-3 md:p-4 text-center">
                          <div className="relative inline-flex items-center justify-center mb-3">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
                              <span className="text-lg md:text-2xl filter drop-shadow-lg">{service.icon}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-sm font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-700 bg-clip-text text-transparent mb-1 md:mb-2 group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-amber-600 transition-all duration-300 leading-tight">
                            {service.titleEn}
                          </h3>
                          <p className="text-purple-600 text-xs md:text-sm font-medium mb-3 hidden sm:block">{service.titleHi}</p>
                        </div>

                        <div className="px-3 md:px-4 mb-3">
                          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 rounded-xl p-3 border border-purple-100 shadow-inner">
                            <div className="flex flex-col space-y-3">
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Price</p>
                                <span className="text-lg font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                                  ₹{service.price}
                                </span>
                              </div>
                              <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                              <div className="flex justify-center">
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Duration</p>
                                  <span className="text-xs font-semibold text-gray-700">{service.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-3 md:px-4 pb-3 md:pb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookService(service);
                            }}
                            disabled={!service.isActive}
                            className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs md:text-sm"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center justify-center">
                              <span className="mr-2 text-sm md:text-base">📅</span>
                              <span className="font-semibold tracking-wide">
                                {service.isActive ? 'Book Now' : 'Unavailable'}
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8">
                    {services.slice(0, 5).map((service) => (
                      <div key={service._id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-1 cursor-pointer block"
                        onClick={() => navigate(`/services/${service._id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-3 md:p-4 text-center">
                          <div className="relative inline-flex items-center justify-center mb-3 md:mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full blur-md md:blur-lg opacity-20 md:opacity-30 group-hover:opacity-40 md:group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg md:shadow-xl border-2 border-gray-300">
                              <span className="text-lg md:text-2xl filter drop-shadow-lg">{service.icon}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-sm md:text-lg font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-700 bg-clip-text text-transparent mb-1 md:mb-2 group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-amber-600 transition-all duration-300 leading-tight">
                            {service.titleEn}
                          </h3>
                          <p className="text-purple-600 text-xs md:text-sm font-medium mb-3">{service.titleHi}</p>
                        </div>

                        <div className="px-3 md:px-4 mb-3 md:mb-4">
                          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-purple-100 shadow-inner">
                            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
                              <div className="text-center md:flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Price</p>
                                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                                  ₹{service.price}
                                </span>
                              </div>
                              
                              <div className="h-px md:h-12 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-purple-200 to-transparent md:mx-4"></div>
                              
                              <div className="flex justify-center md:justify-between md:flex-1">
                                <div className="text-center flex-1 md:flex-none">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Duration</p>
                                  <span className="text-xs md:text-sm font-semibold text-gray-700">{service.duration}</span>
                                </div>
                                
                                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-4"></div>
                                
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

                        <div className="px-3 md:px-4 pb-3 md:pb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookService(service);
                            }}
                            disabled={!service.isActive}
                            className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs md:text-sm"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center justify-center">
                              <span className="mr-2 text-sm md:text-base">📅</span>
                              <span className="text-sm md:text-base font-semibold tracking-wide">
                                {service.isActive ? 'Book Now' : 'Unavailable'}
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-6 md:mt-12">
              <Link 
                to="/services"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 md:px-10 py-2.5 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-500/60 text-xs sm:text-sm md:text-base"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/50 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-3 md:mb-6">
              <span className="text-amber-700 text-xs sm:text-sm font-semibold">📖 Latest Articles</span>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 bg-clip-text text-transparent mb-2 md:mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600">Blogs</span>
            </h2>
            <p className="text-sm md:text-lg text-amber-800 max-w-2xl mx-auto font-medium">
              हमारे ब्लॉग - ज्ञान और जानकारी
            </p>
          </div>

          {blogsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-xl p-4 animate-pulse">
                  <div className="h-32 bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : blogsError ? (
            <div className="text-center py-6">
              <p className="text-red-500 text-sm font-semibold">{blogsError}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm font-semibold">No blogs available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-1"
                >
                  <div className="h-28 sm:h-32 md:h-40 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                    {blog.featuredImage ? (
                      <img
                        src={getImageURL(blog.featuredImage)}
                        alt={blog.featuredImageAlt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center" style={{ display: blog.featuredImage ? 'none' : 'flex' }}>
                      <span className="text-2xl md:text-3xl">📖</span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="mt-2 md:mt-3 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                      <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-orange-600 font-medium group-hover:underline">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-6 md:mt-12">
            <Link
              to="/blogs"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 md:px-10 py-2.5 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-orange-500/60 text-xs sm:text-sm md:text-base"
            >
              See All Blogs
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-amber-500/20 backdrop-blur-sm border border-purple-300/50 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-3 md:mb-6">
              <span className="text-purple-700 text-xs sm:text-sm font-semibold">🛍️ Our Sacred Shop</span>
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-900 via-indigo-800 to-amber-800 bg-clip-text text-transparent mb-2 md:mb-4">
              Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600">Products</span>
            </h2>
            <p className="text-sm md:text-lg text-purple-800 max-w-2xl mx-auto font-medium">
              पवित्र उत्पाद - Authentic Spiritual Items
            </p>
          </div>

           <div className="relative">
             {productsLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                 {Array.from({ length: 6 }).map((_, index) => (
                   <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 md:p-6 animate-pulse">
                     <div className="h-3 bg-gray-300 rounded mb-2 md:mb-4"></div>
                     <div className="h-2 bg-gray-300 rounded mb-1 md:mb-2"></div>
                     <div className="h-2 bg-gray-300 rounded mb-2 md:mb-4"></div>
                     <div className="h-6 md:h-8 bg-gray-300 rounded"></div>
                   </div>
                 ))}
               </div>
             ) : productsError ? (
               <div className="col-span-full text-center py-6 md:py-8">
                 <div className="text-red-500 text-sm md:text-lg font-semibold">{productsError}</div>
                 <p className="text-gray-600 text-xs md:text-sm mt-2">Please try refreshing the page</p>
               </div>
             ) : products.length === 0 ? (
               <div className="col-span-full text-center py-6 md:py-8">
                 <div className="text-gray-500 text-sm md:text-lg font-semibold">No products available</div>
                 <p className="text-gray-400 text-xs md:text-sm mt-2">Products will appear here once they are added</p>
               </div>
             ) : (
               <div className="relative">
                 <div 
                   onMouseEnter={() => setIsProductCarouselPaused(true)}
                   onMouseLeave={() => setIsProductCarouselPaused(false)}>
                   <div className="flex md:hidden overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     {products.map((product) => (
                       <Link 
                         key={product._id} 
                         to={`/shop/product/${product._id}`}
                         onClick={() => window.scrollTo(0, 0)}
                         className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 cursor-pointer block flex-shrink-0 w-[calc(50%-6px)] snap-start"
                       >
                         {product.images && product.images.length > 0 && (
                           <div className="h-32 sm:h-40 overflow-hidden bg-gray-50 relative flex items-center justify-center p-2 md:p-4">
                             <img 
                               src={getImageURL(product.images[0])}
                               alt={product.name}
                               className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                               onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.style.display = 'none';
                                 e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-2xl md:text-4xl">🔸</span></div>';
                               }}
                             />
                           </div>
                         )}

                         <div className="p-2 md:p-3">
                           <div className="mb-1 md:mb-2">
                             <h3 className="text-gray-800 font-medium text-xs sm:text-sm line-clamp-2 leading-tight">{product.name}</h3>
                             {product.nameHi && (
                               <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5 md:mt-1 hidden sm:block">{product.nameHi}</p>
                             )}
                           </div>

                           <div className="flex items-center gap-1 md:gap-2 mb-1.5 md:mb-3">
                             <span className="text-sm md:text-lg font-bold text-purple-600">₹{product.price}</span>
                             {product.originalPrice && product.originalPrice > product.price && (
                               <span className="text-xs md:text-sm text-gray-500 line-through hidden sm:block">₹{product.originalPrice}</span>
                             )}
                           </div>

                           {product.inStock ? (
                             <div className="flex gap-1.5 md:gap-2">
                               <button
                                 onClick={(e) => handleAddToCart(product, e)}
                                 className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm flex items-center justify-center"
                               >
                                 <span className="mr-0.5 md:mr-1 text-[10px] sm:text-sm md:text-base">🛒</span>
                                 <span className="hidden sm:inline">Add</span>
                               </button>
                               <button
                                 onClick={(e) => handleBuyNow(product, e)}
                                 className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-[10px] sm:text-xs md:text-sm flex items-center justify-center"
                               >
                                 <span className="mr-0.5 md:mr-1 text-[10px] sm:text-sm md:text-base">⚡</span>
                                 <span className="hidden sm:inline">Buy</span>
                               </button>
                             </div>
                           ) : (
                             <button
                               disabled
                               className="w-full bg-gray-400 text-white font-semibold py-1.5 md:py-2 px-1.5 md:px-3 rounded-lg cursor-not-allowed opacity-60 text-[10px] sm:text-xs md:text-sm flex items-center justify-center"
                             >
                               <span className="mr-0.5 md:mr-1 text-[10px] sm:text-sm md:text-base">❌</span>
                               <span className="hidden sm:inline">Out of Stock</span>
                             </button>
                           )}
                         </div>
                       </Link>
                     ))}
                   </div>

                   <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8">
                     {products.slice(0, 5).map((product) => (
                       <Link 
                         key={product._id} 
                         to={`/shop/product/${product._id}`}
                         onClick={() => window.scrollTo(0, 0)}
                         className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 cursor-pointer block"
                       >
                         {product.images && product.images.length > 0 && (
                           <div className="h-48 lg:h-56 xl:h-72 overflow-hidden bg-gray-50 relative flex items-center justify-center p-2 md:p-4">
                             <img 
                               src={getImageURL(product.images[0])}
                               alt={product.name}
                               className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                               onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.style.display = 'none';
                                 e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-2xl md:text-4xl">🔸</span></div>';
                               }}
                             />
                           </div>
                         )}

                         <div className="p-3">
                           <div className="mb-2">
                             <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 leading-tight">{product.name}</h3>
                             {product.nameHi && (
                               <p className="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">{product.nameHi}</p>
                             )}
                           </div>

                           <div className="flex items-center gap-2 mb-3">
                             <span className="text-lg lg:text-xl xl:text-2xl font-bold text-purple-600">₹{product.price}</span>
                             {product.originalPrice && product.originalPrice > product.price && (
                               <span className="text-xs md:text-sm text-gray-500 line-through hidden sm:block">₹{product.originalPrice}</span>
                             )}
                           </div>

                           {product.inStock ? (
                             <div className="flex gap-2">
                               <button
                                 onClick={(e) => handleAddToCart(product, e)}
                                 className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-xs md:text-sm flex items-center justify-center"
                               >
                                 <span className="mr-1 text-sm md:text-base">🛒</span>
                                 <span>Add</span>
                               </button>
                               <button
                                 onClick={(e) => handleBuyNow(product, e)}
                                 className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs md:text-sm flex items-center justify-center"
                               >
                                 <span className="mr-1 text-sm md:text-base">⚡</span>
                                 <span>Buy</span>
                               </button>
                             </div>
                           ) : (
                             <button
                               disabled
                               className="w-full bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg cursor-not-allowed opacity-60 text-xs md:text-sm flex items-center justify-center"
                             >
                               <span className="mr-1 text-sm md:text-base">❌</span>
                               <span>Out of Stock</span>
                             </button>
                           )}
                         </div>
                       </Link>
                     ))}
                   </div>
                 </div>
               </div>
             )}

            <div className="text-center mt-6 md:mt-12">
              <Link 
                to="/shop"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 md:px-10 py-2.5 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-500/60 text-xs sm:text-sm md:text-base"
              >
                View All Products
              </Link>
            </div>
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
    </>
  )
}

export default Homepage
