import React, { useState, useEffect } from 'react';

const IntroBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 text-white rounded-2xl shadow-2xl animate-slideIn">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl">🕉️</span>
          </div>

          {/* Welcome Text */}
          <h1 className="text-xl font-bold text-white mb-2">
            Welcome to Grand Launch of
          </h1>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-1">
            Astro Satya Prakash Website.com
          </h2>
          <p className="text-purple-200 text-lg mb-6 font-medium">
            पंडित सत्य प्रकाश त्रिपाठी
          </p>

          {/* Simple Description */}
          <p className="text-purple-100 text-base mb-6 leading-relaxed">
            Your trusted guide for astrology, spiritual wisdom, and life solutions.
          </p>

          {/* Launch Badge */}
          <div className="bg-gradient-to-r from-purple-600/30 to-amber-600/30 border border-amber-300/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">🎉</span>
              <span className="text-amber-300 font-bold">Grand Launch Special!</span>
            </div>
            <p className="text-sm text-purple-100">
              Experience authentic Vedic astrology consultations and spiritual products online
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2 text-xl">✨</span>
              <span>Explore Now</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroBanner;