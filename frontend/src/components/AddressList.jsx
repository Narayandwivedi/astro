import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import { getAddresses, deleteAddress, setDefaultAddress } from '../services/addressService';

const AddressList = ({ onSelectAddress = null, showActions = true, selectedAddressId = null }) => {
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
      alert('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert(error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      // Update the addresses list to reflect the change
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      })));
      alert('Default address updated successfully');
    } catch (error) {
      console.error('Failed to set default address:', error);
      alert(error.message || 'Failed to set default address');
    }
  };

  const handleModalSave = (savedAddress) => {
    if (isEditing) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr._id === savedAddress._id ? savedAddress : addr
      ));
    } else {
      // Add new address
      setAddresses(prev => [...prev, savedAddress]);
    }
    setIsModalOpen(false);
  };

  const handleSelectAddress = (address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading addresses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          <span className="text-4xl">⚠️</span>
          <p className="text-lg font-medium mt-2">{error}</p>
        </div>
        <button
          onClick={loadAddresses}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      {showActions && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">🏠</span>
            My Addresses
            <span className="ml-2 text-sm font-normal text-gray-500">({addresses.length})</span>
          </h3>
          <button
            onClick={handleAddAddress}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
          >
            <span className="mr-2">➕</span>
            Add Address
          </button>
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-gray-200 border-dashed">
            <span className="text-6xl">🏠</span>
            <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">No addresses found</h4>
            <p className="text-gray-500 mb-4">Add your first address to get started</p>
            {showActions && (
              <button
                onClick={handleAddAddress}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <span className="mr-2">➕</span>
                Add Your First Address
              </button>
            )}
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`p-4 border rounded-lg transition-all duration-300 ${
                selectedAddressId === address._id 
                  ? 'border-orange-500 bg-orange-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              } ${onSelectAddress ? 'cursor-pointer' : ''}`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className="flex justify-between items-start">
                {/* Address Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">
                      {address.type === 'home' ? '🏠' : address.type === 'work' ? '🏢' : '📍'}
                    </span>
                    <span className="font-semibold text-gray-800 capitalize">{address.type}</span>
                    {address.isDefault && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-gray-700">
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm">{address.mobile}</p>
                    <p className="text-sm">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {address.landmark && `, Near ${address.landmark}`}
                    </p>
                    <p className="text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {showActions && (
                  <div className="flex flex-col space-y-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address._id);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address._id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        address={editingAddress}
        isEditing={isEditing}
      />
    </div>
  );
};

export default AddressList;