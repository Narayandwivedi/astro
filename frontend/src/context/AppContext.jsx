import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com/'

export const AppContextProvider = (props) => {
  const navigate = useNavigate()

  // Auth states
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  const checkAuthStatus = useCallback(async () => {
    if (isCheckingAuth) return
    
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
        withCredentials: true
      })
      
      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(response.data.user)
        
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated === null && !user) {
      checkAuthStatus()
    }
  }, [isAuthenticated, user, checkAuthStatus])

  const login = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }, [])

  const signup = useCallback(async (signupData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Signup failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate('/')
    }
  }, [navigate])

  const refreshUser = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }))
  }, [])

  const getImageURL = useCallback((imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${BACKEND_URL}/${cleanPath}`;
  }, [BACKEND_URL])

  const value = useMemo(() => ({
    BACKEND_URL,
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    updateUser,
    checkAuthStatus,
    getImageURL,
  }), [user, isAuthenticated, loading, login, signup, logout, refreshUser, updateUser, checkAuthStatus, getImageURL]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};