import React, { useState } from 'react'
import ConsultationModal from './ConsultationModal'

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <section className="relative w-full h-[90vh] sm:h-[75vh] md:h-[70vh] pt-32 sm:pt-24 md:pt-20 pb-6 sm:pb-0 bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700 overflow-hidden">
      
      {/* Astro Chart Background with Brown Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/astro chart.png" 
          alt="Astrology Chart" 
          className="w-full h-full object-cover"
          style={{
            filter: 'sepia(100%) saturate(150%) hue-rotate(25deg) brightness(0.7) contrast(1.2)'
          }}
        />
      </div>
      
      {/* Traditional Pattern Overlay */}
      <div className="absolute inset-0 opacity-8">
        <div className="w-full h-full" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(139,69,19,0.15) 0px, rgba(139,69,19,0.15) 2px, transparent 2px, transparent 25px),
            repeating-linear-gradient(-45deg, rgba(160,82,45,0.1) 0px, rgba(160,82,45,0.1) 2px, transparent 2px, transparent 25px)
          `
        }}></div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10 h-full flex items-center">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Content */}
          <div className="text-center lg:text-left text-white lg:flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-serif block mb-1">
                आचार्य सत्य प्रकाश त्रिपाठी
              </span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light">
                Acharya Satya Prakash Tripathi
              </span>
            </h1>
            
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-3 lg:mb-4">
              <span className="text-yellow-400 text-sm sm:text-base">★★★★★</span>
              <span className="text-gray-300 text-xs sm:text-sm">10+ Years Experience</span>
            </div>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 lg:mb-6 px-4 lg:px-0">
              जीवन में आने वाली समस्याओं का समाधान पाएं। करियर, प्रेम, विवाह, व्यापार और स्वास्थ्य के लिए सटीक भविष्यवाणी।
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start px-4 lg:px-0">
              <button 
                onClick={openModal}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base text-center inline-flex items-center justify-center"
              >
                Get Free Consultation
              </button>
              <a 
                href="tel:+91883945431"
                className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base text-center inline-flex items-center justify-center"
              >
                📞 Call Now
              </a>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex justify-center lg:justify-end lg:flex-1">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-1 shadow-2xl">
                <div className="w-full h-full bg-white rounded-full p-1">
                  <img 
                    src="/satya2.webp" 
                    alt="Astrologer Satya Prakash Tripathi" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    {/* Consultation Modal */}
    <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default Hero