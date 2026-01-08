import React from 'react'
import { UserCheck, FileSearch, Send, CheckCircle } from 'lucide-react'

const HowItWorks = () => {
  const applyUrl = "https://portal.nelf.gov.ng/auth/register";
  
  const steps = [
    {
      number: '01',
      icon: <UserCheck />,
      title: 'Check Eligibility',
      description: 'Verify you meet basic requirements including Nigerian citizenship and admission status.'
    },
    {
      number: '02',
      icon: <FileSearch />,
      title: 'Prepare Documents',
      description: 'Gather required documents: admission letter, ID, and bank verification number.'
    },
    {
      number: '03',
      icon: <Send />,
      title: 'Submit Application',
      description: 'Complete online application form and upload necessary documents.'
    },
    {
      number: '04',
      icon: <CheckCircle />,
      title: 'Get Approval',
      description: 'Receive loan approval and disbursement directly to your institution.'
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to secure your educational funding
          </p>
        </div>
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#006400] text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                      {step.number}
                    </div>
                    <div className="text-[#006400]">
                      {React.cloneElement(step.icon, { size: 32 })}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#006400] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#004d00] transition-colors"
          >
            Start Your Application
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks