import React, { createContext, useContext } from 'react';

// Create API Context
const ApiContext = createContext();

// Backend URL configuration
const BACKEND_URL = 'http://localhost:5000';

// API Context Provider
export const ApiProvider = ({ children }) => {
  const apiConfig = {
    baseURL: BACKEND_URL,
    getImageURL: (imagePath) => {
      if (!imagePath) return null;
      // If imagePath already includes http://, return as is
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      // If imagePath starts with /, remove it to avoid double slashes
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `${BACKEND_URL}/${cleanPath}`;
    },
    endpoints: {
      products: `${BACKEND_URL}/api/products`,
      services: `${BACKEND_URL}/api/services`,
      bookings: `${BACKEND_URL}/api/bookings`,
      orders: `${BACKEND_URL}/api/orders`
    }
  };

  return (
    <ApiContext.Provider value={apiConfig}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;