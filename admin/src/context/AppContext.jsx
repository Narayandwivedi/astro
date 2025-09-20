import { useState, createContext, useMemo, useCallback } from "react";

export const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';

export const AppContextProvider = (props) => {
  // Global loading state
  const [loading, setLoading] = useState(false);

  // Image URL helper
  const getImageURL = useCallback((imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${BACKEND_URL}/${cleanPath}`;
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