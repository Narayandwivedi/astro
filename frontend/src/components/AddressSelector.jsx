import React, { useState } from 'react';
import AddressList from './AddressList';

const AddressSelector = ({ onSelectAddress, selectedAddress = null, required = false }) => {
  const [showAddressList, setShowAddressList] = useState(false);

  const handleAddressSelect = (address) => {
    onSelectAddress(address);
    setShowAddressList(false);
  };

  return (
    <div className="space-y-4">
      {/* Selected Address Display */}
      {selectedAddress ? (
        <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border-2 border-green-200/60 shadow-sm">
          <div className="absolute top-4 right-4 text-green-200 text-2xl opacity-20">🏠</div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">
                  {selectedAddress.type === 'home' ? '🏠' : selectedAddress.type === 'work' ? '🏢' : '📍'}
                </span>
                <span className="font-semibold text-gray-800 capitalize">{selectedAddress.type} Address</span>
                {selectedAddress.isDefault && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Default
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-gray-700">
                <p className="font-medium">{selectedAddress.fullName}</p>
                <p className="text-sm">{selectedAddress.mobile}</p>
                <p className="text-sm">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  {selectedAddress.landmark && `, Near ${selectedAddress.landmark}`}
                </p>
                <p className="text-sm">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddressList(true)}
              className="ml-4 px-3 py-2 bg-white/60 backdrop-blur-sm border border-green-300/40 text-green-700 rounded-lg hover:bg-white hover:border-green-400 transition-all duration-300 font-medium text-sm"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        /* No Address Selected */
        <div className="relative bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-lg border-2 border-orange-200/60 shadow-sm">
          <div className="absolute top-4 right-4 text-orange-200 text-2xl opacity-20">🏠</div>
          
          <div className="text-center relative z-10">
            <span className="text-3xl mb-2 block">📍</span>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              {required ? 'Select Delivery Address *' : 'Select Address'}
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Choose an address for delivery / डिलीवरी के लिए पता चुनें
            </p>
            <button
              onClick={() => setShowAddressList(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">📋</span>
              Choose Address
            </button>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200/50">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                      Select Address
                    </h2>
                    <p className="text-orange-100 text-lg font-medium">
                      पता चुनें
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressList(false)}
                  className="text-white hover:text-orange-200 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
              <AddressList 
                onSelectAddress={handleAddressSelect}
                showActions={true}
                selectedAddressId={selectedAddress?._id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;