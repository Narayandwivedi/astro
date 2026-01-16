import React from 'react'

const Hero = ({ onBookConsultation }) => {

  return (
    <>
    <section className="relative w-full min-h-fit pt-24 sm:pt-24 md:pt-20 lg:pt-28 pb-4 sm:pb-6 lg:pb-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 overflow-hidden">

      {/* Astro Chart Background with Brown Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/astro chart.webp"
          alt="Astrology Chart"
          className="w-full h-full object-cover"
          style={{
            filter: 'sepia(100%) saturate(150%) hue-rotate(25deg) brightness(0.7) contrast(1.2)'
          }}
        />
      </div>

      {/* Cosmic Stars Layer */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full cosmic-stars"></div>
      </div>

      {/* Traditional Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full traditional-pattern"></div>
      </div>

      {/* Enhanced gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>

      {/* Radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/40"></div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10 flex items-center">
        {/* Mobile Layout */}
        <div className="flex flex-col w-full lg:hidden">
          {/* Name - Centered */}
          <div className="text-center text-white fade-in-up">
            <h1 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-serif block">
                आचार्य सत्य प्रकाश त्रिपाठी
              </span>
              <span className="text-sm sm:text-base text-gray-300 font-light">
                Acharya Satya Prakash Tripathi
              </span>
            </h1>
          </div>

          {/* Experience - Centered */}
          <div className="flex items-center justify-center space-x-2 mb-2 fade-in-up-delay-1">
            <span className="text-yellow-400 text-xs sm:text-sm glow-stars">★★★★★</span>
            <span className="text-gray-300 text-[10px] sm:text-xs">10+ Years Experience</span>
          </div>

          {/* Buttons - Centered */}
          <div className="flex flex-row gap-2 justify-center mb-6 fade-in-up-delay-2">
            <button
              onClick={onBookConsultation}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs text-center inline-flex items-center justify-center shadow-lg"
            >
              Get Free Consultation
            </button>
            <a
              href="tel:+918839453431"
              className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs text-center inline-flex items-center justify-center shadow-lg"
            >
              📞 Call Now
            </a>
          </div>

          {/* Description + Photo Row */}
          <div className="flex flex-row gap-3 items-center fade-in-up-delay-3">
            {/* Description */}
            <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed flex-1 text-left">
              जीवन में आने वाली समस्याओं का समाधान पाएं।<br/>करियर, प्रेम, विवाह, व्यापार और स्वास्थ्य<br/>के लिए सटीक भविष्यवाणी।
            </p>

            {/* Photo */}
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 sm:w-40 sm:h-40 border-2 border-yellow-400/30 rounded-full"></div>
              <div className="absolute w-[120px] h-[120px] sm:w-[152px] sm:h-[152px] border-2 border-yellow-400/30 rounded-full"></div>
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-0.5 shadow-2xl relative z-10">
                <div className="w-full h-full bg-white rounded-full p-0.5">
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

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row gap-8 items-center w-full">
          {/* Left Content */}
          <div className="text-left text-white lg:flex-1 fade-in-up">
            <h1 className="text-3xl font-bold mb-3 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-serif block">
                आचार्य सत्य प्रकाश त्रिपाठी
              </span>
              <span className="text-lg text-gray-300 font-light">
                Acharya Satya Prakash Tripathi
              </span>
            </h1>

            <div className="flex items-center justify-start space-x-2 mb-3 fade-in-up-delay-1">
              <span className="text-yellow-400 text-sm glow-stars">★★★★★</span>
              <span className="text-gray-300 text-xs">10+ Years Experience</span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4 fade-in-up-delay-2">
              जीवन में आने वाली समस्याओं का समाधान पाएं। करियर, प्रेम, विवाह, व्यापार और स्वास्थ्य के लिए सटीक भविष्यवाणी।
            </p>

            <div className="flex flex-row gap-3 justify-start fade-in-up-delay-3">
              <button
                onClick={onBookConsultation}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm text-center inline-flex items-center justify-center shadow-lg"
              >
                Get Free Consultation
              </button>
              <a
                href="tel:+918839453431"
                className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm text-center inline-flex items-center justify-center shadow-lg"
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-end lg:flex-1 items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-56 h-56 border-2 border-yellow-400/30 rounded-full"></div>
              <div className="absolute w-52 h-52 border-2 border-yellow-400/30 rounded-full"></div>
              <div className="absolute -top-4 -right-4 w-10 h-10 decorative-dots opacity-30 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-8 h-8 decorative-dots opacity-20 rounded-full"></div>
              <div className="w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-1 shadow-2xl relative z-10">
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
    </>
  )
}

export default Hero