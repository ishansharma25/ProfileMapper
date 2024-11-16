import React, { useState } from 'react';
import { Menu, X, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path ? "text-blue-600" : "text-gray-600";
  };

  return (
    <nav className="w-screen bg-white shadow-md fixed top-0 left-0 right-0">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}

          <div className="flex-shrink-0 flex items-center">
  <Link to="/profile" className="text-5xl font-bold text-blue-600 flex items-center">
    <img src="/logo.png" alt="Logo" className="h-16 mr-4" />
    
  </Link>
</div>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
        
            <Link 
              to="/admin/profile" 
              className={`${isActive('/admin/profile')} hover:text-blue-600 transition-colors`}
            >
              Admin Profile
            </Link>
            <Link 
              to="/profile" 
              className={`${isActive('/profile')} hover:text-blue-600 transition-colors`}
            >
              Public Profile
            </Link>
          </div>

          {/* Right side items *
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <User size={20} />
            </button>
          </div>*/}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full">
            <div className="px-2 pt-2 pb-3 space-y-1">
            
              <Link 
                to="/admin/profile" 
                className={`block px-3 py-2 ${isActive('/admin/profile')} hover:text-blue-600`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Profile
              </Link>
              <Link 
                to="/profile" 
                className={`block px-3 py-2 ${isActive('/profile')} hover:text-blue-600`}
                onClick={() => setIsMenuOpen(false)}
              >
                Public Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;