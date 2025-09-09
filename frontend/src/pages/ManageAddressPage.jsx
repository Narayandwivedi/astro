import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { getAddresses, deleteAddress, setDefaultAddress } from '../services/addressService';
import SimpleAddressModal from '../components/SimpleAddressModal';

const ManageAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAddresses();
      setAddresses(response.data || []);
    } catch (err) {
      console.error('Failed to load addresses:', err);
      setError(err.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr._id !== addressId));
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      })));
    } catch (error) {
      console.error('Failed to set default address:', error);
      alert(error.message || 'Failed to set default address');
    }
  };

  const handleModalSave = (savedAddress) => {
    if (isEditing) {
      setAddresses(prev => prev.map(addr => 
        addr._id === savedAddress._id ? savedAddress : addr
      ));
    } else {
      setAddresses(prev => [...prev, savedAddress]);
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow p-8 max-w-md mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAddresses}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-medium text-gray-900">Your Addresses</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Add Address Button */}
        <div className="mb-6">
          <button
            onClick={handleAddAddress}
            className="flex items-center justify-center w-full max-w-xs bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">+</div>
              <div className="text-sm font-medium text-gray-900">Add address</div>
            </div>
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You don't have any addresses saved.</p>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address._id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  {/* Address Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium text-gray-900 mr-3">{address.fullName}</h3>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <p>India</p>
                      <p className="font-medium">Phone number: {address.mobile}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Address Modal */}
      <SimpleAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        address={editingAddress}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageAddressPage;