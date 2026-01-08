import React from 'react'
import { CheckCircle, FileText, Users, Clock, Banknote, Award } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: <CheckCircle />,
      title: 'Easy Eligibility',
      description: 'Open to all Nigerian students admitted into accredited institutions.'
    },
    {
      icon: <FileText />,
      title: 'Simple Application',
      description: 'Online application process with minimal documentation required.'
    },
    {
      icon: <Banknote />,
      title: 'No Collateral',
      description: 'No physical collateral or guarantor needed for loan approval.'
    },
    {
      icon: <Clock />,
      title: 'Grace Period',
      description: 'Two-year grace period after graduation before repayment begins.'
    },
    {
      icon: <Users />,
      title: 'Family Support',
      description: 'Multiple children from same family can all access loans.'
    },
    {
      icon: <Award />,
      title: 'Merit Considered',
      description: 'Academic performance considered for additional support.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose NELFUND?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide accessible, transparent, and student-friendly financing for higher education
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#006400] mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                  {React.cloneElement(feature.icon, { size: 24 })}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features