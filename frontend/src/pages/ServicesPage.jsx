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

  // SEO optimization
  useEffect(() => {
    document.title = 'Vedic Astrology Services | Expert Consultation by Acharya Satya Prakash Tripathi';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore comprehensive Vedic astrology services by Acharya Satya Prakash Tripathi. Get expert guidance on Kundli reading, marriage compatibility, business astrology, vastu consultation, health astrology, education guidance, and remedial solutions. Book online consultation now!');
    }

    let structuredData = document.querySelector('script[type="application/ld+json"][data-page="services"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      structuredData.setAttribute('data-page', 'services');
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Vedic Astrology Services",
      "description": "Comprehensive Vedic astrology services including Kundli reading, marriage consultation, business astrology, vastu shastra, health predictions, education guidance, and spiritual remedies by expert astrologer Acharya Satya Prakash Tripathi",
      "provider": {
        "@type": "Organization",
        "name": "Astro Satya Prakash",
        "url": "https://astrosatyaprakash.com",
        "founder": {
          "@type": "Person",
          "name": "Acharya Satya Prakash Tripathi",
          "jobTitle": "Vedic Astrologer",
          "description": "Expert Vedic Astrologer with 10+ years of experience"
        }
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceType": "Online Consultation",
        "availableLanguage": ["Hindi", "English"]
      },
      "serviceType": [
        "Kundli Reading",
        "Marriage Astrology",
        "Business Consultation",
        "Vastu Shastra",
        "Health Astrology",
        "Education Guidance",
        "Remedial Astrology",
        "Career Guidance"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Astrology Services Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Complete Kundli Analysis",
              "description": "Detailed birth chart reading with predictions and remedies"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Marriage Compatibility",
              "description": "Gun Milan and compatibility analysis for marriage"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Business Astrology",
              "description": "Business timing, partnership analysis, and success predictions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Vastu Consultation",
              "description": "Vastu shastra guidance for homes and offices"
            }
          }
        ]
      }
    });

    return () => {
      const script = document.querySelector('script[data-page="services"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

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

        {/* Hero Section */}
        <section className="relative pt-24 md:pt-24 pb-8 md:pb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 overflow-hidden">
          {/* Cosmic background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-indigo-900/5 to-amber-900/5"></div>

          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">

              <h1 className="text-xl md:text-xl lg:text-5xl font-bold mt-4 mb-4 md:mb-8 leading-tight">
                <span className="text-gray-800">Vedic Astrology</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600">Services</span>
              </h1>
              <p className="text-sm md:text-xl text-gray-600 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
                Get expert guidance from <strong>Acharya Satya Prakash Tripathi</strong> with 10+ years of experience in authentic Vedic astrology. Transform your life with personalized solutions.
              </p>
              <div className="flex flex-row gap-4 justify-center">
                <button
                  onClick={() => openModal(null)}
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:via-indigo-700 hover:to-amber-700 text-white font-bold text-xs md:text-base px-3 py-1 md:px-8 md:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 whitespace-nowrap"
                >
                  📅 Book Free Consultation
                </button>
                <a
                  href="tel:+918839453431"
                  className="bg-white hover:bg-gray-50 text-purple-800 font-bold text-xs md:text-base px-3 py-1 md:px-8 md:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-purple-200 hover:border-purple-300 transform hover:-translate-y-1 whitespace-nowrap flex items-center justify-center"
                >
                  📞 Call: +91 8839453431
                </a>
              </div>
            </div>
          </div>
        </section>
        

        {/* Category Filter */}
        <section className="pt-4 pb-4 md:pt-20 md:pb-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 relative overflow-hidden">
          {/* Cosmic stars background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-4 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-xs md:text-sm ${
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



        {/* Why Choose Us Section */}
        <section className="pt-0 pb-16 md:pt-12 md:pb-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-xl md:text-3xl font-bold text-slate-800 mt-6 mb-4 md:mb-6">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Astro Satya</span>?
              </h2>
              <p className="text-lg md:text-sm text-slate-600 font-light max-w-2xl mx-auto">
                हमें क्यों चुनें - Your Trusted Astrological Partner
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center group">
                <div className="relative mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-2xl md:text-4xl text-white">🎯</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl mx-auto w-12 h-12 md:w-20 md:h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 md:mb-3">10+ Years Experience</h3>
                <p className="text-slate-600 font-light leading-relaxed text-xs md:text-xs">Trusted by thousands of satisfied clients worldwide</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-2xl md:text-4xl text-white">📱</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl mx-auto w-12 h-12 md:w-20 md:h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 md:mb-3">Online Consultation</h3>
                <p className="text-slate-600 font-light leading-relaxed text-xs md:text-xs">Available 24/7 through phone, video call & chat</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-2xl md:text-4xl text-white">✅</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl mx-auto w-12 h-12 md:w-20 md:h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 md:mb-3">Accurate Predictions</h3>
                <p className="text-slate-600 font-light leading-relaxed text-xs md:text-xs">Based on authentic Vedic astrology principles</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <span className="text-2xl md:text-4xl text-white">🔒</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl mx-auto w-12 h-12 md:w-20 md:h-20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 md:mb-3">Complete Privacy</h3>
                <p className="text-slate-600 font-light leading-relaxed text-xs md:text-xs">Your personal information is 100% confidential</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-2xl"></div>
          <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-500/40 to-amber-500/40 backdrop-blur-sm border-2 border-purple-400/50 rounded-full px-6 py-2 md:px-8 md:py-3 mb-6 md:mb-8 shadow-2xl">
                <span className="text-purple-200 text-xs md:text-sm font-bold">🚀 Transform Your Life</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight drop-shadow-2xl">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-amber-300">Life?</span>
              </h2>
              <p className="text-lg md:text-xl text-purple-100 mb-10 md:mb-12 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-lg">
                Don't let uncertainty hold you back. Get personalized astrological guidance
                and find solutions to all your problems today with our expert consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center max-w-3xl mx-auto">
                <button
                  onClick={() => openModal(null)}
                  className="group relative bg-white text-purple-800 font-bold px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transform hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden border-2 md:border-4 border-purple-400"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-base md:text-lg drop-shadow-md">
                    <span className="mr-2 md:mr-3 text-xl md:text-2xl">📅</span>
                    Book Free Consultation
                  </span>
                </button>
                <a
                  href="tel:+918839453431"
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-700 hover:via-indigo-700 hover:to-amber-700 text-white font-bold px-8 py-4 md:px-12 md:py-6 rounded-xl md:rounded-2xl transition-all duration-300 shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transform hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden border-2 md:border-4 border-purple-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center text-base md:text-lg drop-shadow-md">
                    <span className="mr-2 md:mr-3 text-xl md:text-2xl">📞</span>
                    Call: +91 8839453431
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      {isModalOpen && (
        <BookingModal service={selectedService} onClose={closeModal} />
      )}
    </>
  );
};

export default ServicesPage;