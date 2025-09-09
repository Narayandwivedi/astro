import React from 'react';
import AddressList from '../components/AddressList';

const AddressPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6 backdrop-blur-sm border border-white/30">
              <span className="text-3xl">🏠</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                Address Management
              </h1>
              <p className="text-orange-100 text-lg font-medium">
                पता प्रबंधन
              </p>
              <p className="text-orange-100 text-sm mt-1">
                Manage your delivery addresses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6 mb-8">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">ℹ️</span>
              <h2 className="text-xl font-semibold text-gray-800">Quick Tips</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="text-lg mr-2 flex-shrink-0">✅</span>
                <p>Add multiple addresses for different delivery locations</p>
              </div>
              <div className="flex items-start">
                <span className="text-lg mr-2 flex-shrink-0">🏠</span>
                <p>Set one address as default for quick checkouts</p>
              </div>
              <div className="flex items-start">
                <span className="text-lg mr-2 flex-shrink-0">📱</span>
                <p>Provide correct mobile number for delivery updates</p>
              </div>
            </div>
          </div>

          {/* Address List */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
            <AddressList showActions={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;