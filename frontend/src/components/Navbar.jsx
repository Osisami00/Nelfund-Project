import React from 'react';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const loginUrl = "https://portal.nelf.gov.ng/auth/login";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-gray-800">NEL</span>
                <span className="bg-gradient-to-t from-green-900 via-green-500 to-green-900 bg-clip-text text-transparent">FUND</span>
              </h1>
              <p className="text-[10px] text-gray-600 uppercase tracking-wide -mt-1">
                Nigerian Education Loan Fund
              </p>
              <p className="text-[9px] text-gray-500 italic -mt-0.5">
                ...increasing access to higher education
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-1 text-gray-800 font-medium hover:text-green-600 transition">
              <span>HOME</span>
              <ArrowRight className="text-xs" />
            </a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
                <span>ABOUT US</span>
                <ChevronDown className="text-xs" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
                <span>IMPACT</span>
                <ChevronDown className="text-xs" />
              </button>
            </div>
            <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
              <span>FAQS</span>
              <ArrowRight className="text-xs" />
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition">
              <span>CONTACT US</span>
              <ArrowRight className="text-xs" />
            </a>
          </div>

          {/* Login Button */}
          <div className="hidden lg:flex items-center">
            <a 
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:border-green-500 hover:text-green-600 transition"
            >
              <span className="font-medium">LOGIN</span>
              <ArrowRight className="text-sm" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-700 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="flex items-center justify-between text-gray-800 font-medium py-2">
                <span>HOME</span>
                <ArrowRight className="text-xs" />
              </a>
              <button className="flex items-center justify-between text-gray-700 py-2">
                <span>ABOUT US</span>
                <ChevronDown className="text-xs" />
              </button>
              <button className="flex items-center justify-between text-gray-700 py-2">
                <span>IMPACT</span>
                <ChevronDown className="text-xs" />
              </button>
              <a href="#" className="flex items-center justify-between text-gray-700 py-2">
                <span>FAQS</span>
                <ArrowRight className="text-xs" />
              </a>
              <a href="#" className="flex items-center justify-between text-gray-700 py-2">
                <span>CONTACT US</span>
                <ArrowRight className="text-xs" />
              </a>
              
              <div className="pt-4 border-t">
                <a 
                  href={loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded hover:border-green-500 hover:text-green-600 transition"
                >
                  <span className="font-medium">LOGIN</span>
                  <ArrowRight className="text-sm" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;