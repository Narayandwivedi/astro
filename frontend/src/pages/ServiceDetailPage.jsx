import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ConsultationModal from '../components/ConsultationModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleBookConsultation = () => {
    setIsConsultationModalOpen(true);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch service from database
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service');
        }
        const data = await response.json();
        setService(data.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);


  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <Navigation />
        <div className="pt-32 py-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Service not found
  if (!service) {
    return (
      <div className="w-full">
        <Navigation />
        <div className="pt-32 py-16 text-center min-h-screen flex items-center justify-center">
          <div>
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/services')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-28 pb-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => navigate('/services')}
                  className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back to Services</span>
                </button>
              </div>

              {/* Service Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
                  <span className="text-3xl text-white">{service.icon}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                  {service.titleEn}
                </h1>
                <p className="text-xl md:text-2xl text-orange-600 font-semibold mb-6">
                  {service.titleHi}
                </p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Key Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Price</h3>
                  <p className="text-2xl font-bold text-orange-600">₹{service.price}</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Duration</h3>
                  <p className="text-lg text-gray-700">{service.duration}</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Mode</h3>
                  <p className="text-lg text-gray-700">Phone/Video Call</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Service Features
                </h2>
                <p className="text-xl text-gray-600">
                  सेवा की विशेषताएं
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* English Features */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🇬🇧</span>
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {(service.features || ['Detailed birth chart analysis', 'Personalized consultation', 'Expert guidance', 'Remedial solutions']).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 text-lg mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Hindi Features */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🇮🇳</span>
                    मुख्य विशेषताएं
                  </h3>
                  <ul className="space-y-3">
                    {(service.hindiFeatures || ['विस्तृत जन्म कुंडली विश्लेषण', 'व्यक्तिगत परामर्श', 'विशेषज्ञ मार्गदर्शन', 'उपचारात्मक समाधान']).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 text-lg mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book Now Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">🚀</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Life?</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Book your consultation now and gain clarity about your future. Get expert guidance from Acharya Satya Prakash Tripathi.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                  <div className="flex items-center bg-green-100 rounded-full px-6 py-3">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Investment</p>
                      <p className="text-xl font-bold text-green-800">₹{service.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-blue-100 rounded-full px-6 py-3">
                    <span className="text-2xl mr-3">⏱️</span>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Duration</p>
                      <p className="text-lg font-semibold text-blue-800">{service.duration}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleBookConsultation}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-3 text-xl">📞</span>
                    Book Your Consultation Now
                  </span>
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  💫 Join thousands of satisfied clients who have found clarity and success
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsConsultationModalOpen(false)} 
        service={service}
      />
    </>
  );
};

export default ServiceDetailPage;