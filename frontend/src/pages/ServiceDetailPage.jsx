import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ConsultationModal from '../components/ConsultationModal';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [service, setService] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch service from database
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service');
        }
        const data = await response.json();
        setService(data.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        // Service not found or error, will show not found message
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);


  if (!service) {
    return (
      <div className="w-full">
        <Navigation />
        <div className="pt-32 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/services')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <Navigation />
        
        {/* Service Header */}
        <section className="pt-32 pb-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => navigate('/services')}
                  className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{service.icon}</span>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{service.titleEn}</h1>
                    <p className="text-lg text-amber-800 font-semibold">{service.titleHi}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <p className="text-gray-700 leading-relaxed mb-4">{service.description}</p>
                <p className="text-amber-700 leading-relaxed">{service.hindiDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  What's Included
                </h2>
                <p className="text-xl text-gray-600">
                  सेवा में क्या शामिल है
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                {/* English Features */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-3xl mr-4">🇬🇧</span>
                    Service Features
                  </h3>
                  <ul className="space-y-4">
                    {(service.features || []).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 text-xl mr-3 mt-1">✓</span>
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Hindi Features */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-3xl mr-4">🇮🇳</span>
                    सेवा विशेषताएं
                  </h3>
                  <ul className="space-y-4">
                    {(service.hindiFeatures || []).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 text-xl mr-3 mt-1">✓</span>
                        <span className="text-gray-700 text-lg">{feature}</span>
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
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Ready to Book?</h3>
                
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">💰</span>
                    <span className="text-xl font-bold text-amber-800">₹{service.price}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">⏱️</span>
                    <span className="text-lg text-gray-700">{service.duration}</span>
                  </div>
                </div>
                
                <button
                  onClick={openModal}
                  className="bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 hover:from-amber-900 hover:via-yellow-800 hover:to-orange-800 text-white font-bold px-12 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-3 text-xl">📅</span>
                    Book Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default ServiceDetailPage;