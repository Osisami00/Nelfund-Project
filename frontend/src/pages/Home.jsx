import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Footer from '../components/Footer.jsx'
import ChatWidget from '../components/ChatWidget.jsx'

const openChat = () => {
  const chatButton = document.querySelector('button[aria-label="Chat with AI Assistant"]')
  if (chatButton) {
    chatButton.click()
  }
}

const Home = () => {
  const applyUrl = "https://portal.nelf.gov.ng/auth/register";

  return (
    <div className="min-h-screen bg-white ">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* Statistics Section */}
      <section className="py-16 bg-[#006400] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
              <div className="text-gray-300">Students Funded</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">₦15B+</div>
              <div className="text-gray-300">Total Loans Disbursed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-gray-300">Covered Institutions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">36</div>
              <div className="text-gray-300">States + FCT Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center lg-px-30">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Education Journey?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of Nigerian students who have accessed higher education through NELFUND.
            Start your application today or speak with our AI assistant for guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#006400] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#004d00] transition-colors text-center"
            >
              Apply for Loan
            </a>
            <button className="bg-white text-[#006400] border-2 border-[#006400] px-8 py-3 rounded-md font-semibold hover:bg-green-50 transition-colors">
              Download Guidelines
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  )
}

export default Home