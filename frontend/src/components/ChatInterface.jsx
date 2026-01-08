import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, FileText, Mic, Square, History, Save, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { sendMessage, getSessionHistory, resetSession, getFallbackResponse } from '../services/api.js'

const ChatInterface = ({ currentUser, onShowAuth }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [backendConnected, setBackendConnected] = useState(true)
  const messagesEndRef = useRef(null)

  // Local storage functions
  const saveChatMessage = (message, sender, citations = []) => {
    if (!currentUser) return null
    
    const chatKey = `nelfi_chats_${currentUser.id || 'guest'}`
    const chats = JSON.parse(localStorage.getItem(chatKey) || '[]')
    
    const newMessage = {
      id: Date.now() + Math.random(),
      text: message,
      sender,
      citations,
      timestamp: new Date().toISOString()
    }
    
    chats.push(newMessage)
    localStorage.setItem(chatKey, JSON.stringify(chats))
    
    return newMessage
  }

  const getUserChatHistory = () => {
    if (!currentUser) return []
    
    const chatKey = `nelfi_chats_${currentUser.id || 'guest'}`
    return JSON.parse(localStorage.getItem(chatKey) || '[]')
  }

  const clearUserChatHistory = () => {
    if (!currentUser) return
    
    const chatKey = `nelfi_chats_${currentUser.id || 'guest'}`
    localStorage.removeItem(chatKey)
  }

  // Load chat history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      if (currentUser && !currentUser.isGuest && currentUser.phone) {
        try {
          const sessionData = await getSessionHistory(currentUser.phone)
          
          if (sessionData.messages && sessionData.messages.length > 0) {
            // Convert backend session messages to frontend format
            const formattedMessages = sessionData.messages.map(msg => ({
              id: Date.now() + Math.random(),
              text: msg.content,
              sender: msg.role === 'user' ? 'user' : 'ai',
              timestamp: msg.timestamp || new Date().toISOString(),
              citations: []
            }))
            setMessages(formattedMessages)
            setBackendConnected(true)
          } else {
            // Load from local storage if no backend session
            const localHistory = getUserChatHistory()
            if (localHistory.length > 0) {
              setMessages(localHistory)
            } else {
              // Default welcome message for registered users
              setMessages([
                {
                  id: Date.now(),
                  text: `Hello ${currentUser?.fullName?.split(' ')[0] || 'Student'}! I'm your NELFUND AI Assistant. I can help you with information about student loans, eligibility, application process, and more. How can I assist you today?`,
                  sender: 'ai',
                  timestamp: new Date().toISOString(),
                  citations: []
                }
              ])
            }
          }
        } catch (error) {
          console.error('Failed to load session history:', error)
          setBackendConnected(false)
          // Fallback to local storage
          const localHistory = getUserChatHistory()
          if (localHistory.length > 0) {
            setMessages(localHistory)
          } else {
            // Default welcome message
            setMessages([
              {
                id: Date.now(),
                text: `Hello ${currentUser?.fullName?.split(' ')[0] || 'Student'}! I'm your NELFUND AI Assistant. I can help you with information about student loans, eligibility, application process, and more. How can I assist you today?`,
                sender: 'ai',
                timestamp: new Date().toISOString(),
                citations: []
              }
            ])
          }
        }
      } else {
        // Default welcome message for guest users
        setMessages([
          {
            id: Date.now(),
            text: "Hello! I'm your NELFUND AI Assistant. I can help you with information about student loans, eligibility, application process, and more. You're chatting as a guest. Register to save your conversation.",
            sender: 'ai',
            timestamp: new Date().toISOString(),
            citations: []
          }
        ])
      }
    }

    loadHistory()
  }, [currentUser])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onresult = (event) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setTranscript(currentTranscript)
        setInput(currentTranscript)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }
      
      recognitionInstance.onend = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognitionInstance)
    }
  }, [])

  const startRecording = () => {
    if (recognition) {
      setTranscript('')
      setInput('')
      recognition.start()
      setIsRecording(true)
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
    }
  }

  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      citations: []
    }

    // Save user message
    saveChatMessage(input, 'user')

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setTranscript('')
    setIsLoading(true)

    try {
      // Use real API call with phone number or guest identifier
      const phoneNumber = currentUser?.phone || 'guest-' + Date.now().toString()
      const apiResponse = await sendMessage(phoneNumber, input)

      // Check if we got a fallback response
      if (apiResponse.isFallback) {
        setBackendConnected(false)
      } else {
        setBackendConnected(true)
      }

      // Format citations from backend response
      const aiCitations = apiResponse.sources.map(source => ({
        document: source.source || 'NELFUND Document',
        section: source.page || 'Section',
        content_preview: source.content_preview || ''
      }))

      const aiResponse = {
        id: Date.now() + 1,
        text: apiResponse.answer,
        sender: 'ai',
        timestamp: apiResponse.timestamp || new Date().toISOString(),
        citations: aiCitations,
        used_retrieval: apiResponse.used_retrieval || false,
        isFallback: apiResponse.isFallback || false
      }

      // Save AI response
      saveChatMessage(apiResponse.answer, 'ai', aiCitations)

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Failed to send message:', error)
      setBackendConnected(false)
      
      // Use fallback response generator
      const fallbackResponse = getFallbackResponse(input)
      const aiResponse = {
        id: Date.now() + 1,
        text: fallbackResponse.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        citations: fallbackResponse.sources,
        used_retrieval: false,
        isFallback: true
      }
      
      saveChatMessage(fallbackResponse.answer, 'ai', fallbackResponse.sources)
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString([], { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      try {
        if (currentUser && !currentUser.isGuest && currentUser.phone) {
          await resetSession(currentUser.phone)
        }
        
        clearUserChatHistory()
        setMessages([
          {
            id: Date.now(),
            text: `Hello ${currentUser?.fullName?.split(' ')[0] || 'Student'}! I'm your NELFUND AI Assistant. How can I assist you today?`,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            citations: []
          }
        ])
        setShowHistory(false)
      } catch (error) {
        console.error('Failed to clear session:', error)
        alert('Failed to clear session. Please try again.')
      }
    }
  }

  const groupMessagesByDate = () => {
    const groups = {}
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  // Check if user has chat history
  const hasHistory = getUserChatHistory().length > 0

  // Handle login/register from guest
  const handleGuestAuth = () => {
    if (onShowAuth) {
      onShowAuth()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Auth Options for Guests */}
      <div className="border-b border-gray-200 p-2 flex justify-between items-center">
        {currentUser?.isGuest ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Guest</span>
              <span className="text-xs text-gray-600">Chat not saved</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handleGuestAuth()}
                className="flex items-center space-x-1 text-xs bg-[#006400] text-white px-2 py-1 rounded hover:bg-[#004d00] transition-colors"
              >
                <LogIn size={12} />
                <span>Login</span>
              </button>
              <button
                onClick={() => handleGuestAuth()}
                className="flex items-center space-x-1 text-xs bg-white border border-[#006400] text-[#006400] px-2 py-1 rounded hover:bg-green-50 transition-colors"
              >
                <UserPlus size={12} />
                <span>Register</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <Save size={12} />
              <span className="text-xs">Chat saved for {currentUser?.fullName?.split(' ')[0] || 'you'}</span>
            </div>
            
            {hasHistory && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#006400] px-2 py-1 rounded hover:bg-gray-100"
              >
                <History size={14} />
                <span>History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Backend Connection Warning */}
      {!backendConnected && !showHistory && (
        <div className="px-4 py-2 bg-yellow-50 border-y border-yellow-200">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle size={16} className="text-yellow-600" />
            <span className="text-sm text-yellow-600 font-medium">Backend not connected - Using fallback responses</span>
            <button 
              onClick={() => window.open('http://localhost:8000', '_blank')}
              className="text-xs text-yellow-800 underline hover:text-yellow-900"
            >
              Check backend
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 chat-scrollbar sm:p-4 sm:space-y-4">
        {showHistory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Chat History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Back to Chat
              </button>
            </div>
            
            {Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-50 py-2 px-3 rounded-lg mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 text-center">
                    {formatDate(date)}
                  </h3>
                </div>
                <div className="space-y-3">
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`w-full max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                          message.sender === 'user'
                            ? 'bg-[#006400] text-white rounded-br-none sm:rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none sm:rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="mt-0.5 flex-shrink-0">
                            {message.sender === 'ai' ? (
                              <Bot className="text-[#006400] sm:size-4" size={14} />
                            ) : (
                              <User className="text-white sm:size-4" size={14} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm break-words">{message.text}</p>
                            <div className="flex justify-between items-center mt-1 sm:mt-2">
                              <span className="text-[10px] sm:text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.isFallback && (
                                <span className="text-[10px] sm:text-xs text-yellow-600">(Fallback)</span>
                              )}
                            </div>
                            
                            {/* Citations */}
                            {message.sender === 'ai' && message.citations && message.citations.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200/50 sm:mt-3 sm:pt-3">
                                <div className="flex items-center text-[10px] sm:text-xs text-gray-600 mb-1">
                                  <FileText size={10} className="mr-1 sm:size-3" />
                                  <span className="font-medium">Sources:</span>
                                  {message.used_retrieval && (
                                    <span className="ml-1 text-green-600">(Retrieved from documents)</span>
                                  )}
                                  {message.isFallback && (
                                    <span className="ml-1 text-yellow-600">(Sample data)</span>
                                  )}
                                </div>
                                <div className="space-y-0.5 sm:space-y-1">
                                  {message.citations.map((citation, idx) => (
                                    <div 
                                      key={idx} 
                                      className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-1.5 py-1 sm:px-2 sm:py-1 rounded cursor-help"
                                      title={citation.content_preview || 'No preview available'}
                                    >
                                      {citation.document} – {citation.section}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center pt-4 border-t">
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Clear Chat History
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Registration Prompt for Guests (after 2 messages) */}
            {currentUser?.isGuest && messages.length >= 3 && (
              <div className="flex justify-center">
                <div className="w-full max-w-[85%] sm:max-w-[80%] rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#006400] flex items-center justify-center">
                        <Save size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Save your conversation</h4>
                        <p className="text-xs text-gray-600">Register to access your chat history on any device</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleGuestAuth()}
                        className="text-xs bg-[#006400] text-white px-3 py-1.5 rounded hover:bg-[#004d00] transition-colors"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`w-full max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                    message.sender === 'user'
                      ? 'bg-[#006400] text-white rounded-br-none sm:rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none sm:rounded-bl-none'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5 flex-shrink-0">
                      {message.sender === 'ai' ? (
                        <Bot className="text-[#006400] sm:size-4" size={14} />
                      ) : (
                        <User className="text-white sm:size-4" size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm break-words">{message.text}</p>
                      <div className="flex justify-between items-center mt-1 sm:mt-2">
                        <span className="text-[10px] sm:text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.isFallback && (
                          <span className="text-[10px] sm:text-xs text-yellow-600">(Fallback)</span>
                        )}
                      </div>
                      
                      {/* Citations */}
                      {message.sender === 'ai' && message.citations && message.citations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200/50 sm:mt-3 sm:pt-3">
                          <div className="flex items-center text-[10px] sm:text-xs text-gray-600 mb-1">
                            <FileText size={10} className="mr-1 sm:size-3" />
                            <span className="font-medium">Sources:</span>
                            {message.used_retrieval && (
                              <span className="ml-1 text-green-600">(Retrieved from documents)</span>
                            )}
                            {message.isFallback && (
                              <span className="ml-1 text-yellow-600">(Sample data)</span>
                            )}
                          </div>
                          <div className="space-y-0.5 sm:space-y-1">
                            {message.citations.map((citation, idx) => (
                              <div 
                                key={idx} 
                                className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-1.5 py-1 sm:px-2 sm:py-1 rounded cursor-help"
                                title={citation.content_preview || 'No preview available'}
                              >
                                {citation.document} – {citation.section}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-full max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-bl-none bg-gray-100 px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="text-[#006400] sm:size-4" size={14} />
                    <Loader2 className="animate-spin text-[#006400] sm:size-4" size={14} />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {backendConnected ? 'Thinking...' : 'Generating fallback response...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Status */}
      {isRecording && !showHistory && (
        <div className="px-4 py-2 bg-red-50 border-y border-red-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <span className="text-sm text-red-600 font-medium">Recording... Speak now</span>
          </div>
          {transcript && (
            <p className="text-xs text-gray-600 mt-1 text-center">
              "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Input Form */}
      {!showHistory && (
        <div className="border-t border-gray-200 p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Ask about student loans or click mic to speak..."}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#006400] focus:border-transparent"
                disabled={isLoading}
              />
              {/* Mic Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? (
                  <Square size={18} className="sm:size-5" />
                ) : (
                  <Mic size={18} className="sm:size-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#006400] text-white p-2.5 sm:p-3 rounded-lg hover:bg-[#004d00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={18} className="sm:size-5" />
            </button>
          </form>
          
          <div className="flex items-center justify-between mt-2">
            <div className="text-[10px] sm:text-xs">
              {currentUser?.isGuest ? (
                <button
                  onClick={() => handleGuestAuth()}
                  className="text-[#006400] hover:text-[#004d00] underline flex items-center space-x-1"
                >
                  <LogIn size={10} />
                  <span>Register to save your chat</span>
                </button>
              ) : (
                <span className="text-green-600">Chat saved for {currentUser?.fullName?.split(' ')[0] || 'you'}</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${currentUser?.isGuest ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-[10px] sm:text-xs text-gray-400">
                {currentUser?.isGuest ? 'Guest mode' : 'Auto-save'}
              </span>
              {!backendConnected && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-[10px] sm:text-xs text-yellow-600">Fallback mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface