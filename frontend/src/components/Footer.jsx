import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'About NELFUND', href: '#' },
    { name: 'Eligibility Criteria', href: '#' },
    { name: 'Application Process', href: '#' },
    { name: 'Repayment Guidelines', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Contact Us', href: '#' },
  ]

  const resources = [
    { name: 'Student Loan Act 2023', href: '#' },
    { name: 'Official Guidelines', href: '#' },
    { name: 'List of Institutions', href: '#' },
    { name: 'Application Forms', href: '#' },
    { name: 'Annual Report', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#006400] font-bold text-xl">NLF</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">NELFUND</h2>
                <p className="text-sm text-gray-400">Nigerian Education Loan Fund</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering Nigerian students through accessible education financing. 
              Making higher education dreams a reality for all.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a
                    href={resource.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-1 text-gray-400" size={18} />
                <span className="text-gray-400">
                  NELFUND Headquarters,<br />
                  Central Business District,<br />
                  Abuja, Nigeria
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-gray-400" size={18} />
                <span className="text-gray-400">+234 700 NELFUND</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-gray-400" size={18} />
                <span className="text-gray-400">info@nelf.gov.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Nigerian Education Loan Fund. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer