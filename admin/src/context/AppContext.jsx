import { useState, createContext, useMemo, useCallback } from "react";

export const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';

export const AppContextProvider = (props) => {
  // Global loading state
  const [loading, setLoading] = useState(false);

  // Image URL helper
  const getImageURL = useCallback((imagePath) => {
    if (!imagePath) return null;

    // Handle object with url property (like from product.images array)
    if (typeof imagePath === 'object' && imagePath.url) {
      imagePath = imagePath.url;
    }

    // Handle string URLs
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `${BACKEND_URL}/${cleanPath}`;
    }

    return null;
  }, []);

  const value = useMemo(() => ({
    // Constants
    BACKEND_URL,

    // Global state
    loading,
    setLoading,

    // Helpers
    getImageURL,
  }), [
    loading,
    getImageURL,
  ]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};