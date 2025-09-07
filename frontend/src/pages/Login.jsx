import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GoogleLogin from '../components/GoogleLogin'

const Login = () => {
  const { login, signup, BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const [loginData, setLoginData] = useState({
    emailOrMobile: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errors, setErrors] = useState({})

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const result = await login(loginData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          login: result.error
        })
      }
    } catch (error) {
      setErrors({
        login: 'Login failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ signup: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...submitData } = signupData
      const result = await signup(submitData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          signup: result.error
        })
      }
    } catch (error) {
      setErrors({
        signup: 'Signup failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: forgotData.email
      })
      
      if (response.data.success) {
        setOtpSent(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Failed to send OTP'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setErrors({ forgot: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email: forgotData.email,
        otp: forgotData.otp,
        newPass: forgotData.newPassword
      })
      
      if (response.data.success) {
        setShowForgotPassword(false)
        setOtpSent(false)
        setForgotData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' })
        setIsLogin(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Password reset failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Star Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 left-16 w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
        
        {/* Floating Mystic Elements */}
        <div className="absolute top-16 left-8 opacity-10 animate-bounce text-6xl">🌙</div>
        <div className="absolute top-40 right-12 opacity-10 animate-bounce text-4xl" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-32 left-12 opacity-10 animate-bounce text-5xl" style={{animationDelay: '2s'}}>🔮</div>
        <div className="absolute bottom-16 right-16 opacity-10 animate-bounce text-3xl" style={{animationDelay: '0.5s'}}>⭐</div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          
          {/* Logo and Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full mb-6 shadow-2xl">
              <div className="text-white text-2xl font-bold">🕉️</div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Astro <span className="text-yellow-400">Satya</span>
            </h1>
            <p className="text-yellow-200 font-medium">
              आध्यात्मिक ज्ञान का केंद्र
            </p>
            <p className="text-purple-200 text-sm mt-2 opacity-90">
              {showForgotPassword ? 'Reset Your Password' : (isLogin ? 'Welcome Back!' : 'Begin Your Journey')}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10">
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-60"></div>
        {!showForgotPassword ? (
          <>
            <div className="flex bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-2 mb-8 shadow-inner border border-orange-100">
              <button
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 relative ${
                  isLogin ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg transform scale-[1.02]' : 'text-orange-600 hover:text-orange-700'
                }`}
                onClick={() => setIsLogin(true)}
              >
                {isLogin && <span className="absolute top-1 right-1 text-xs">🔥</span>}
                Sign In
              </button>
              <button
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 relative ${
                  !isLogin ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg transform scale-[1.02]' : 'text-orange-600 hover:text-orange-700'  
                }`}
                onClick={() => setIsLogin(false)}
              >
                {!isLogin && <span className="absolute top-1 right-1 text-xs">✨</span>}
                Join Us
              </button>
            </div>

            {isLogin ? (
              <>
                {/* Google Login Component - Top of Login Form */}
                <div className="mb-6">
                  <GoogleLogin />
                </div>

                {/* Login Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 font-medium bg-white">or sign in with email</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">📧</span>
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={loginData.emailOrMobile}
                    onChange={(e) => setLoginData({...loginData, emailOrMobile: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all text-gray-800 bg-gradient-to-r from-orange-50 to-yellow-50 placeholder:text-gray-500"
                    placeholder="Enter your email or mobile"
                    required
                  />
                </div>

                <div className="relative">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <span className="mr-2">🔐</span>
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all text-gray-800 bg-gradient-to-r from-orange-50 to-yellow-50 placeholder:text-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {errors.login && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-2xl flex items-center">
                    <span className="mr-2">⚠️</span>
                    {errors.login}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 hover:from-orange-700 hover:via-orange-600 hover:to-yellow-600 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Logging in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚪</span>
                        Login
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-orange-600 text-sm hover:text-orange-700 font-bold hover:underline transition-colors flex items-center justify-center mx-auto"
                  >
                    <span className="mr-1">🔮</span>
                    Forgot Password?
                  </button>
                </div>
              </form>
              </>
            ) : (
              <>
                {/* Google Login Component - Top of Signup Form */}
                <div className="mb-6">
                  <GoogleLogin />
                </div>

                {/* Signup Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 font-medium bg-white">or create account with email</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300"></div>
                </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={signupData.mobile}
                    onChange={(e) => setSignupData({...signupData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                {errors.signup && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errors.signup}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-semibold hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Signing up...
                      </div>
                    ) : 'Sign Up'}
                  </button>
                </div>
              </form>
              </>
            )}
          </>
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Email address"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errors.forgot}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-semibold hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending OTP...
                      </div>
                    ) : 'Send OTP'}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-600 text-sm hover:text-gray-800 font-semibold hover:underline transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={forgotData.otp}
                    onChange={(e) => setForgotData({...forgotData, otp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.confirmNewPassword}
                    onChange={(e) => setForgotData({...forgotData, confirmNewPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm">{errors.forgot}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 disabled:bg-gray-400 transition-colors shadow-lg"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setForgotData({...forgotData, otp: '', newPassword: '', confirmNewPassword: ''})
                  }}
                  className="w-full text-gray-600 text-sm hover:underline"
                >
                  Resend OTP
                </button>
              </form>
            )}
          </>
        )}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 text-white/70">
            <p className="text-sm mb-2">
              ✨ May the stars guide your path ✨
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <span className="flex items-center">
                <span className="mr-1">🌟</span>
                Blessed by Ancient Wisdom
              </span>
              <span className="flex items-center">
                <span className="mr-1">🔮</span>
                Protected by Divine Energy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login