import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConsultationModal from './ConsultationModal'

const MobileBottomNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Professional Design */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg">
        <div className="safe-area-inset-bottom">
          <div className="flex justify-around items-center py-2 px-4">
            
            {/* Book Call Button */}
            <button
              onClick={openModal}
              className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Book Call</span>
            </button>

            {/* Shop Button */}
            <Link
              to="/shop"
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mb-1 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Shop</span>
            </Link>

            {/* Account Button */}
            <Link
              to="/login"
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mb-1 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Account</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default MobileBottomNav