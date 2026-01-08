import React, { useState, useEffect } from 'react'
import { MessageSquare, X, Minimize2, Bot, ChevronUp, Phone, User, Key, Globe } from 'lucide-react'
import ChatInterface from './ChatInterface.jsx'
import { 
  isAuthenticated, 
  getCurrentUser, 
  registerUser, 
  loginUser, 
  logoutUser,
  guestLogin,
  validatePhoneNumber,
  COUNTRY_CODES,
  formatPhoneNumber
} from '../utils/auth.js'

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [authData, setAuthData] = useState({
    phone: '',
    countryCode: '234', // Default to Nigeria
    fullName: ''
  })
  const [authError, setAuthError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (isAuthenticated()) {
      setCurrentUser(getCurrentUser())
    }
  }, [])

  const toggleChat = () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true)
    } else {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setIsMinimized(false)
      }
    }
  }

  const minimizeChat = () => {
    setIsMinimized(!isMinimized)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handlePhoneChange = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    setAuthData({...authData, phone: digits})
    
    // Validate as user types
    if (digits) {
      const isValid = validatePhoneNumber(digits, authData.countryCode)
      if (!isValid && digits.length > 3) {
        setPhoneError('Please enter a valid phone number')
      } else {
        setPhoneError('')
      }
    } else {
      setPhoneError('')
    }
  }

  const handleCountryCodeChange = (code) => {
    setAuthData({...authData, countryCode: code})
    // Revalidate phone with new country code
    if (authData.phone) {
      const isValid = validatePhoneNumber(authData.phone, code)
      if (!isValid) {
        setPhoneError('Please enter a valid phone number for this country')
      } else {
        setPhoneError('')
      }
    }
  }

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    setAuthError('')
    setPhoneError('')

    // Validate phone
    if (!validatePhoneNumber(authData.phone, authData.countryCode)) {
      setPhoneError('Please enter a valid phone number')
      return
    }

    if (isLoginMode) {
      const result = loginUser(authData.phone, authData.countryCode)
      if (result.success) {
        setCurrentUser(result.user)
        setShowAuthModal(false)
        setIsOpen(true)
      } else {
        setAuthError(result.message)
      }
    } else {
      // Registration
      if (!authData.fullName.trim()) {
        setAuthError('Please enter your full name')
        return
      }

      const result = registerUser(authData.phone, authData.countryCode, authData.fullName)
      if (result.success) {
        setCurrentUser(result.user)
        setShowAuthModal(false)
        setIsOpen(true)
      } else {
        setAuthError(result.message)
      }
    }
  }

  const handleGuestLogin = () => {
    const result = guestLogin()
    setCurrentUser(result.user)
    setShowAuthModal(false)
    setIsOpen(true)
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    setIsOpen(false)
    setShowAuthModal(true)
  }

  const getCurrentCountry = () => {
    return COUNTRY_CODES.find(country => country.code === authData.countryCode) || COUNTRY_CODES[0]
  }

  return (
    <>
      {/* Floating AI Icon with "Chat Nelfi" Text */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        <button
          onClick={toggleChat}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative flex items-center justify-center bg-gradient-to-r from-[#006400] to-[#004d00] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            width: isHovering ? '140px' : '60px',
            height: '60px',
            transition: 'width 0.3s ease'
          }}
          aria-label="Chat with AI Assistant"
        >
          <div className="absolute left-3">
            <Bot size={20} className="sm:size-6" />
          </div>
          
          {isHovering && (
            <div className="absolute left-12 animate-fadeIn">
              <span className="text-sm font-semibold whitespace-nowrap">
                {currentUser ? 
                  (currentUser.isGuest ? 'Guest' : `Hi, ${currentUser.fullName?.split(' ')[0]}`) 
                  : 'Chat Nelfi'
                }
              </span>
            </div>
          )}
          
          {/* Pulse Animation */}
          <div className="absolute -top-1 -right-1 w-4 h-4">
            <div className="absolute w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute w-full h-full bg-[#00a000] rounded-full"></div>
          </div>
        </button>
        
        {/* "Chat Nelfi" Text Under Icon */}
        <div className="mt-1 text-center">
          <span className="text-xs font-semibold text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
            Chat Nelfi
          </span>
        </div>
        
        {/* Tooltip on mobile */}
        <div className="md:hidden mt-2 text-center">
          {showTooltip && (
            <div className="bg-[#006400] text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <div className="flex items-center justify-center space-x-1">
                <ChevronUp size={12} />
                <p className="text-xs font-medium">Tap to ask questions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-[90%] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006400] to-[#004d00] text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">NELFI AI Assistant</h3>
                    <p className="text-sm text-white/80">Available to everyone</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="flex border-b mb-6">
                <button
                  onClick={() => {
                    setIsLoginMode(true)
                    setAuthError('')
                    setPhoneError('')
                  }}
                  className={`flex-1 py-2 font-semibold ${isLoginMode ? 'text-[#006400] border-b-2 border-[#006400]' : 'text-gray-500'}`}
                >
                  <Key className="inline mr-2" size={16} />
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLoginMode(false)
                    setAuthError('')
                    setPhoneError('')
                  }}
                  className={`flex-1 py-2 font-semibold ${!isLoginMode ? 'text-[#006400] border-b-2 border-[#006400]' : 'text-gray-500'}`}
                >
                  <User className="inline mr-2" size={16} />
                  Register
                </button>
              </div>

              <form onSubmit={handleAuthSubmit}>
                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex space-x-2">
                      {/* Country Code Selector */}
                      <div className="relative flex-shrink-0">
                        <select
                          value={authData.countryCode}
                          onChange={(e) => handleCountryCodeChange(e.target.value)}
                          className="w-32 border border-gray-300 rounded-lg px-3 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#006400] focus:border-transparent appearance-none"
                        >
                          {COUNTRY_CODES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      
                      {/* Phone Number Input */}
                      <div className="flex-1 relative">
                        <input
                          type="tel"
                          value={authData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder={getCurrentCountry().code === '234' ? 'e.g., 8012345678' : 'Enter phone number'}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006400] focus:border-transparent"
                          required
                        />
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                    {phoneError ? (
                      <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        We'll use this to save your chat history
                      </p>
                    )}
                  </div>

                  {/* Name Input (for registration only) */}
                  {!isLoginMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={authData.fullName}
                        onChange={(e) => setAuthData({...authData, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006400] focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-[#006400] text-white py-3 rounded-lg font-semibold hover:bg-[#004d00] transition-colors"
                    >
                      {isLoginMode ? 'Login & Continue Chat' : 'Register & Start Chat'}
                    </button>

                    {/* Guest Login Option */}
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-4 text-sm text-gray-500">or</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGuestLogin}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => {
                      setIsLoginMode(!isLoginMode)
                      setAuthError('')
                      setPhoneError('')
                    }}
                    className="text-[#006400] font-semibold hover:underline"
                  >
                    {isLoginMode ? 'Register here' : 'Login here'}
                  </button>
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Guest users can chat without registration
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window - Fixed position to avoid header overlap */}
      {isOpen && currentUser && (
        <div className={`
          fixed z-40 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300
          ${isMinimized 
            ? 'w-64 sm:w-80 h-16 bottom-28 right-4 sm:right-6' 
            : 'w-[calc(100vw-32px)] sm:w-[400px] md:w-full max-w-md h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 sm:bottom-28'
          }
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-[#006400] to-[#004d00] text-white rounded-t-xl">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <Bot size={14} className="sm:size-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm sm:text-base">NELFI AI</h3>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {currentUser.isGuest ? 'Guest' : currentUser.fullName?.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-white/80">
                  {currentUser.isGuest ? 'Chat not saved' : 'Chat saved to your account'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {!currentUser.isGuest && (
                <button
                  onClick={handleLogout}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              )}
              <button
                onClick={minimizeChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label={isMinimized ? "Restore chat" : "Minimize chat"}
              >
                <Minimize2 size={16} className="sm:size-5" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Close chat"
              >
                <X size={16} className="sm:size-5" />
              </button>
            </div>
          </div>

          {/* Chat Interface - Only show when not minimized */}
          {!isMinimized && (
            <div className="h-[calc(100%-56px)] sm:h-[calc(100%-64px)]">
              <ChatInterface 
                currentUser={currentUser} 
                onShowAuth={() => {
                  setIsOpen(false)
                  setShowAuthModal(true)
                }}
              />
            </div>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Chat minimized. Click restore button or the floating icon to continue.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Welcome Popup */}
      {!isOpen && !currentUser && showTooltip && (
        <div className="fixed bottom-40 right-6 z-40 animate-slideUp">
          <div className="bg-white rounded-xl shadow-xl p-4 max-w-xs border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#006400] flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Need help with NELFUND?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Chat with our AI assistant. No registration needed for guests.
                </p>
                <button
                  onClick={toggleChat}
                  className="text-xs bg-[#006400] text-white px-3 py-1.5 rounded-md hover:bg-[#004d00] transition-colors"
                >
                  Ask NELFI AI
                </button>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget