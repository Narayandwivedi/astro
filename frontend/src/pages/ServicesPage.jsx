import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import BookingModal from '../components/BookingModal';
import { AppContext } from '../context/AppContext';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
        // Fallback to empty array if fetch fails
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = [
    { name: "All", value: "all" },
    { name: "Personal", value: "Personal" },
    { name: "Business", value: "Business" },
    { name: "Relationship", value: "Relationship" },
    { name: "Remedial", value: "Remedial" },
    { name: "Health", value: "Health" },
    { name: "Education", value: "Education" },
    { name: "Property", value: "Property" },
    { name: "Travel", value: "Travel" },
    { name: "Vastu", value: "Vastu" },
    { name: "Ceremonial", value: "Ceremonial" },
    { name: "Timing", value: "Timing" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <>
      <div className="w-full">
        <Navigation />
        

        {/* Category Filter */}
        <section className="pt-32 py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
          {/* Cosmic stars background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-xs md:text-base ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 text-white shadow-xl shadow-purple-500/30 border-2 border-amber-400'
                      : 'bg-white/90 backdrop-blur-sm text-purple-800 hover:bg-white hover:shadow-xl border-2 border-purple-200/60 hover:border-purple-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
          {/* Cosmic stars background */}
          <div className="absolute inset-0 opacity-15">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-purple-800 font-medium">Loading services...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium mb-4">Failed to load services: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredServices.map((service) => (
                <div 
                  key={service._id} 
                  className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate(`/services/${service._id}`)}
                >
                  
                  {/* Cosmic Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Read More Arrow */}
                  <div className="absolute top-4 right-4 z-20 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 shadow-lg">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Service Header - Redesigned */}
                  <div className="relative p-4 md:p-6 text-center">
                    {/* Icon with Glow Effect */}
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-300">
                        <span className="text-lg md:text-2xl filter drop-shadow-lg">{service.icon}</span>
                      </div>
                    </div>
                    
                    {/* Service Title */}
                    <h3 className="text-sm md:text-lg font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-700 bg-clip-text text-transparent mb-2 group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-amber-600 transition-all duration-300">
                      {service.titleEn}
                    </h3>
                    <p className="text-purple-600 text-xs md:text-sm font-medium mb-3">{service.titleHi}</p>
                  </div>

                  {/* Pricing Section - Redesigned */}
                  <div className="px-4 md:px-6 mb-4">
                    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 rounded-2xl p-3 border border-purple-100 shadow-inner">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Price</p>
                          <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                            ₹{service.price}
                          </span>
                        </div>
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-4"></div>
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Duration</p>
                          <span className="text-xs md:text-sm font-semibold text-gray-700">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button - Enhanced */}
                  <div className="px-4 md:px-6 pb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(service);
                      }}
                      className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-800 hover:via-indigo-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border border-white/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="mr-3 text-base md:text-xl">📅</span>
                        <span className="text-sm md:text-base font-semibold tracking-wide">Book Now</span>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-full px-6 py-2 mb-6">
                <span className="text-indigo-600 text-sm font-medium">⭐ Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Astro Satya</span>?
              </h2>
              <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
                हमें क्यों चुनें - Your Trusted Astrological Partner
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">🎯</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">10+ Years Experience</h3>
                <p className="text-slate-600 font-light leading-relaxed">Trusted by thousands of satisfied clients worldwide</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">📱</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Online Consultation</h3>
                <p className="text-slate-600 font-light leading-relaxed">Available 24/7 through phone, video call & chat</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">✅</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Accurate Predictions</h3>
                <p className="text-slate-600 font-light leading-relaxed">Based on authentic Vedic astrology principles</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-4xl text-white">🔒</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl mx-auto w-20 h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Complete Privacy</h3>
                <p className="text-slate-600 font-light leading-relaxed">Your personal information is 100% confidential</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-2xl"></div>
          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-500/40 to-amber-500/40 backdrop-blur-sm border-2 border-purple-400/50 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-purple-200 text-sm font-bold">🚀 Transform Your Life</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-amber-300">Life?</span>
              </h2>
              <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
                Don't let uncertainty hold you back. Get personalized astrological guidance 
                and find solutions to all your problems today with our expert consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
                <button
                  onClick={() => openModal(null)}
                  className="group relative bg-white text-purple-800 font-bold px-12 py-6 rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-purple-400"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📅</span>
                    Book Free Consultation
                  </span>
                </button>
                <a
                  href="tel:+918839453431"
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:via-indigo-700 hover:to-amber-700 text-white font-bold px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-purple-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📞</span>
                    Call: +91 8839453431
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={closeModal} selectedService={selectedService} />
    </>
  );
};

export default ServicesPage;