import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import BookingModal from '../components/BookingModal';

const ServicesPage = () => {
  const navigate = useNavigate();
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
        const response = await fetch('http://localhost:5000/api/services');
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
        <section className="pt-32 py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-xs md:text-base ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white shadow-xl shadow-orange-500/30 border-2 border-yellow-400'
                      : 'bg-white/90 backdrop-blur-sm text-orange-800 hover:bg-white hover:shadow-xl border-2 border-orange-200/60 hover:border-orange-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                <p className="mt-4 text-amber-800 font-medium">Loading services...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium mb-4">Failed to load services: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredServices.map((service) => (
                <div 
                  key={service._id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-amber-200/60 hover:border-amber-400 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/services/${service._id}`)}
                >
                  
                  {/* Service Header */}
                  <div className="bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 text-white p-4 relative overflow-hidden">
                    {/* Read More Arrow */}
                    <div className="absolute top-3 right-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-950/40 rounded-xl flex items-center justify-center backdrop-blur-sm border-2 border-yellow-700/60 shadow-lg mx-auto mb-3">
                        <span className="text-2xl filter drop-shadow-lg">{service.icon}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold mb-1 group-hover:text-yellow-300 transition-colors drop-shadow-lg">{service.titleEn}</h3>
                      <p className="text-yellow-100 text-xs font-semibold drop-shadow-md">{service.titleHi}</p>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4">
                    {/* Price */}
                    <div className="text-center mb-4">
                      <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent drop-shadow-sm">₹{service.price}</span>
                      <p className="text-amber-800 text-xs font-semibold">{service.duration}</p>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(service);
                      }}
                      className="w-full bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 hover:from-amber-900 hover:via-yellow-800 hover:to-orange-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border-2 border-yellow-600/60"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center drop-shadow-md">
                        <span className="mr-2 text-sm">📅</span>
                        <span className="text-xs md:text-sm">Book Now</span>
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
                <h3 className="text-xl font-bold text-slate-800 mb-3">25+ Years Experience</h3>
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
        <section className="py-20 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(60deg, rgba(255,215,0,0.1) 0px, rgba(255,215,0,0.1) 3px, transparent 3px, transparent 25px),
                repeating-linear-gradient(-60deg, rgba(255,140,0,0.08) 0px, rgba(255,140,0,0.08) 3px, transparent 3px, transparent 25px)
              `
            }}></div>
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-2xl"></div>
          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/40 to-orange-500/40 backdrop-blur-sm border-2 border-yellow-400/50 rounded-full px-8 py-3 mb-8 shadow-2xl">
                <span className="text-yellow-200 text-sm font-bold">🚀 Transform Your Life</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">Life?</span>
              </h2>
              <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
                Don't let uncertainty hold you back. Get personalized astrological guidance 
                and find solutions to all your problems today with our expert consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
                <button
                  onClick={() => openModal(null)}
                  className="group relative bg-white text-red-800 font-bold px-12 py-6 rounded-2xl hover:bg-yellow-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-yellow-400"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📅</span>
                    Book Free Consultation
                  </span>
                </button>
                <a
                  href="tel:+91883945431"
                  className="group relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 overflow-hidden border-4 border-yellow-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-lg drop-shadow-md">
                    <span className="mr-3 text-2xl">📞</span>
                    Call: +91 883945431
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