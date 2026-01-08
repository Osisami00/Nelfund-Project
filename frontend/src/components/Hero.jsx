import React, { useState } from 'react'
import { Bot, MessageSquare, ChevronRight, Sparkles } from 'lucide-react'

const Hero = () => {
  const applyUrl = "https://portal.nelf.gov.ng/auth/register"
  const loginUrl = "https://portal.nelf.gov.ng/auth/login"
  const [isHoveringAI, setIsHoveringAI] = useState(false)

  // Handle click on AI Assistant
  const handleAIClick = () => {
    const chatButton = document.querySelector('button[aria-label="Chat with AI Assistant"]')
    if (chatButton) {
      chatButton.click()
    }
  }

  return (
    <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
      <div className="container mx-auto px-6 py-20 md:py-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Main Content (Your existing content) */}
          <div className="lg:w-1/2">
            {/* Mobile-only AI Assistant Box */}
            <div className="mb-8 lg:hidden">
              <div 
                onClick={handleAIClick}
                onMouseEnter={() => setIsHoveringAI(true)}
                onMouseLeave={() => setIsHoveringAI(false)}
                className="bg-white rounded-2xl p-5 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#006400] to-[#004d00] rounded-xl flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageSquare size={10} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <Sparkles size={14} className="text-[#006400]" />
                        <span className="text-xs font-semibold text-[#006400]">AI ASSISTANT</span>
                      </div>
                      <h3 className="text-lg font-bold text-green-900">Ask NELFI AI</h3>
                      <p className="text-sm text-gray-600">Get instant help with your questions</p>
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`text-[#006400] transform transition-transform ${isHoveringAI ? 'translate-x-1' : ''}`} 
                  />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Increasing Access to all Education
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed max-w-2xl">
              More than a financial aid program, the Student Loan initiative set up by the federal Government of Nigeria, is a beacon of hope for Nigerian Students pursuing higher education.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl text-center"
              >
                APPLY NOW
              </a>
              <a 
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-800 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-center"
              >
                LOGIN
              </a>
            </div>
          </div>

          {/* Right Column: Desktop-only AI Assistant Box */}
          <div className="lg:w-1/2 hidden lg:block">
            <div 
              onClick={handleAIClick}
              onMouseEnter={() => setIsHoveringAI(true)}
              onMouseLeave={() => setIsHoveringAI(false)}
              className="max-w-md ml-auto bg-white rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg border border-gray-200"
            >
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1.5 bg-green-50 rounded-full mb-3">
                  <Sparkles size={14} className="mr-2 text-[#006400]" />
                  <span className="text-sm font-semibold text-[#006400]">AI-POWERED ASSISTANT</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confused about NELFUND?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI Assistant is here to help you understand eligibility, application process, required documents, and answer all your questions instantly.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <div className="text-[#006400] font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Check Eligibility</h4>
                    <p className="text-sm text-gray-600">Find out if you qualify instantly</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <div className="text-[#006400] font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Step-by-Step Guide</h4>
                    <p className="text-sm text-gray-600">Clear application instructions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <div className="text-[#006400] font-bold">✓</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Document Help</h4>
                    <p className="text-sm text-gray-600">Know exactly what you need</p>
                  </div>
                </div>
              </div>

              <div 
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                  isHoveringAI ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006400] to-[#004d00] flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Ask NELFI AI</h3>
                      <p className="text-sm text-gray-600">Click to start chatting</p>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={`text-[#006400] transform transition-transform ${isHoveringAI ? 'translate-x-2' : ''}`} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                {/* <p className="text-xs text-gray-500">
                  No registration needed to try. Ask your first question now!
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero