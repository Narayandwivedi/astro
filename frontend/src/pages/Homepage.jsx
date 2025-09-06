import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Navigation from '../components/Navigation'
import ConsultationModal from '../components/ConsultationModal'

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/services/popular?limit=6');
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data);
        } else {
          setError('Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="w-full">
      <Navigation />
      <Hero />

      {/* Get in Touch Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              संपर्क करें - Connect with Pandit Satya Prakash Tripathi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Phone Contact */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-orange-600">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                    <p className="text-xl font-bold text-orange-600">+91 883945431</p>
                  </div>
                </div>
                <a 
                  href="tel:+91883945431"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg text-center"
                >
                  Call Now
                </a>
              </div>
            </div>
            
            {/* Email Contact */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-blue-600">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                    <p className="text-sm font-semibold text-blue-600 break-all">astrosatya@gmail.com</p>
                  </div>
                </div>
                <a 
                  href="mailto:astrosatya@gmail.com?subject=Consultation%20Inquiry&body=Hello%20Pandit%20Satya%20Prakash%20Tripathi,%0A%0AI%20would%20like%20to%20schedule%20a%20consultation.%20Please%20let%20me%20know%20your%20availability.%0A%0AThank%20you."
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg text-center"
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
      <section className="py-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/50 rounded-full px-6 py-2 mb-6">
              <span className="text-amber-700 text-sm font-semibold">🕉️ Our Premium Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600">Services</span>
            </h2>
            <p className="text-lg text-amber-800 max-w-2xl mx-auto font-medium">
              हमारी सेवाएं - जीवन की हर समस्या का समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <div className="text-red-500 text-lg font-semibold">{error}</div>
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
              <div key={service._id} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200/60 hover:border-amber-400 transform hover:-translate-y-2">
                
                {/* Service Header */}
                <div className="bg-gradient-to-br from-amber-800 via-yellow-700 to-orange-600 text-white p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(139,69,19,0.2) 0px, rgba(139,69,19,0.2) 2px, transparent 2px, transparent 15px),
                      repeating-linear-gradient(-45deg, rgba(160,82,45,0.15) 0px, rgba(160,82,45,0.15) 2px, transparent 2px, transparent 15px)
                    `
                  }}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-amber-950/30 rounded-lg flex items-center justify-center border-2 border-yellow-600/50 shadow-lg">
                        <span className="text-xl filter drop-shadow-lg">{service.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-yellow-300 transition-colors drop-shadow-lg">{service.titleEn}</h3>
                    </div>
                    <p className="text-yellow-100 text-xs font-semibold drop-shadow-md text-center -mt-0.5">{service.titleHi}</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-4 md:p-6">
                  <p className="text-amber-900 mb-4 md:mb-6 leading-relaxed font-medium text-center text-sm md:text-base">
                    {service.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4 md:mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 md:p-4 rounded-lg shadow-inner border border-amber-200">
                    <div className="flex flex-col">
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 bg-clip-text text-transparent">₹{service.price}</span>
                      <span className="text-xs text-gray-600">{service.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-600 rounded-full mr-2 animate-pulse shadow-md"></div>
                      <p className="text-xs md:text-sm text-green-700 font-bold">{service.isActive ? 'Available' : 'Unavailable'}</p>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={openModal}
                    disabled={!service.isActive}
                    className="w-full bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 hover:from-amber-800 hover:via-yellow-700 hover:to-orange-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border-2 border-yellow-500/60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center drop-shadow-md">
                      <span className="mr-2 text-base md:text-lg">📅</span>
                      <span className="text-sm md:text-base">{service.isActive ? 'Book Now' : 'Unavailable'}</span>
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
              className="inline-block bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 hover:from-amber-800 hover:via-orange-700 hover:to-yellow-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-yellow-500/60"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Our Shop Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/50 rounded-full px-6 py-2 mb-6">
              <span className="text-amber-700 text-sm font-semibold">🛍️ Our Sacred Shop</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600">Products</span>
            </h2>
            <p className="text-lg text-amber-800 max-w-2xl mx-auto font-medium">
              पवित्र उत्पाद - Authentic Spiritual Items for Your Well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "5 Mukhi Rudraksha",
                hindi: "पांच मुखी रुद्राक्ष",
                description: "Powerful 5 Mukhi Rudraksha for health, wealth, and overall well-being.",
                icon: "🌿",
                price: "₹500",
                originalPrice: "₹800"
              },
              {
                id: 2,
                name: "Blue Sapphire (Neelam)",
                hindi: "नीलम रत्न",
                description: "Original Blue Sapphire gemstone for Saturn planet and career success.",
                icon: "💎",
                price: "₹8,500",
                originalPrice: "₹12,000"
              },
              {
                id: 3,
                name: "Yellow Sapphire (Pukhraj)",
                hindi: "पुखराज रत्न",
                description: "Natural Yellow Sapphire for Jupiter bringing wisdom and prosperity.",
                icon: "💛",
                price: "₹6,500",
                originalPrice: "₹9,000"
              },
              {
                id: 4,
                name: "Sphatik Mala",
                hindi: "स्फटिक माला",
                description: "Pure Crystal prayer beads for meditation and spiritual practices.",
                icon: "📿",
                price: "₹800",
                originalPrice: "₹1,200"
              },
              {
                id: 5,
                name: "Shree Yantra",
                hindi: "श्री यंत्र",
                description: "Sacred geometric yantra for wealth, prosperity and spiritual growth.",
                icon: "🔶",
                price: "₹2,500",
                originalPrice: "₹3,500"
              },
              {
                id: 6,
                name: "Navgraha Yantra",
                hindi: "नवग्रह यंत्र",
                description: "Complete set of nine planetary yantras for cosmic harmony.",
                icon: "⭐",
                price: "₹4,500",
                originalPrice: "₹6,000"
              }
            ].map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200/60 hover:border-amber-400 transform hover:-translate-y-2">
                
                {/* Product Header */}
                <div className="bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 text-white p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(139,69,19,0.2) 0px, rgba(139,69,19,0.2) 2px, transparent 2px, transparent 15px),
                      repeating-linear-gradient(-45deg, rgba(160,82,45,0.15) 0px, rgba(160,82,45,0.15) 2px, transparent 2px, transparent 15px)
                    `
                  }}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-amber-950/40 rounded-lg flex items-center justify-center border-2 border-yellow-600/50 shadow-lg">
                        <span className="text-xl filter drop-shadow-lg">{product.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-yellow-300 transition-colors drop-shadow-lg">{product.name}</h3>
                    </div>
                    <p className="text-yellow-100 text-xs font-semibold drop-shadow-md text-center -mt-0.5">{product.hindi}</p>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-4 md:p-6">
                  <p className="text-amber-950 mb-4 md:mb-6 leading-relaxed font-medium text-center text-sm md:text-base">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4 md:mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 md:p-4 rounded-lg shadow-inner border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-900 via-yellow-800 to-orange-800 bg-clip-text text-transparent">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-600 rounded-full mr-2 animate-pulse shadow-md"></div>
                      <p className="text-xs md:text-sm text-green-700 font-bold">In Stock</p>
                    </div>
                  </div>

                  {/* Buy Now Button */}
                  <a
                    href={`https://wa.me/91883945431?text=Hi,%20I%20want%20to%20buy%20${encodeURIComponent(product.name)}%20for%20${encodeURIComponent(product.price)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 hover:from-amber-900 hover:via-yellow-800 hover:to-orange-800 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group border-2 border-yellow-600/60 inline-flex items-center justify-center"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center drop-shadow-md">
                      <span className="mr-2 text-base md:text-lg">🛒</span>
                      <span className="text-sm md:text-base">Buy Now</span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/shop"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-gradient-to-r from-orange-700 via-red-600 to-yellow-600 hover:from-orange-800 hover:via-red-700 hover:to-yellow-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-yellow-500/60"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default Homepage
