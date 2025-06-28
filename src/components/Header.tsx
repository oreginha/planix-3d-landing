import React from 'react';
import PlanixLogo from './PlanixLogo';

interface HeaderProps {
  scrollY: number;
  isDarkMode: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  scrollY, 
  isDarkMode, 
  isMenuOpen, 
  toggleMenu, 
  toggleDarkMode 
}) => {
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrollY > 50 
        ? isDarkMode 
          ? 'bg-gray-900/90 backdrop-blur-2xl shadow-lg border-b border-gray-700/50' 
          : 'bg-white/90 backdrop-blur-2xl shadow-lg border-b border-gray-200/50'
        : 'bg-transparent'
    }`} style={{
      backgroundImage: scrollY > 50 ? (
        isDarkMode 
          ? 'linear-gradient(135deg, rgba(11, 15, 25, 0.98) 0%, rgba(15, 23, 42, 0.95) 30%, rgba(30, 41, 59, 0.92) 70%, rgba(17, 24, 39, 0.95) 100%), linear-gradient(45deg, rgba(29, 78, 216, 0.08) 0%, rgba(79, 70, 229, 0.06) 50%, rgba(139, 92, 246, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.95) 100%), linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)'
      ) : 'none'
    }}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <a 
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              const inicioSection = document.getElementById('inicio');
              if (inicioSection) {
                inicioSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="focus:outline-none rounded-lg"
          >
            <PlanixLogo isDarkMode={isDarkMode} />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#inicio" className={`relative font-medium group transition-all duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
            Inicio
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#servicios" className={`relative font-medium group transition-all duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
            Servicios
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#portfolio" className={`relative font-medium group transition-all duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
            Proyectos
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contacto" className={`relative font-medium group transition-all duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
            Contacto
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <a 
              href="https://www.linkedin.com/company/planix" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`relative p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white'
              }`}
            >
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </a>
            
            <a 
              href="https://www.instagram.com/planix.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`relative p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white'
              }`}
            >
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`relative p-2 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="relative w-6 h-6">
              {/* Sun Icon */}
              <svg
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {/* Moon Icon */}
              <svg
                className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                  isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className={`md:hidden p-3 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-6 h-0.5 transition-all duration-300 transform origin-center ${
                isMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0'
              } ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}></span>
              <span className={`absolute top-3 left-0 w-6 h-0.5 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              } ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}></span>
              <span className={`absolute top-5 left-0 w-6 h-0.5 transition-all duration-300 transform origin-center ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'
              } ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full backdrop-blur-2xl border-b transition-all duration-500 overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
        <nav className="container mx-auto px-6 py-8">
          <div className="space-y-6 mb-8">
            <a 
              href="#inicio" 
              className={`block text-xl font-light transition-all duration-300 transform hover:translate-x-4 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`} 
              onClick={toggleMenu}
            >
              Inicio
            </a>
            <a 
              href="#servicios" 
              className={`block text-xl font-light transition-all duration-300 transform hover:translate-x-4 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`} 
              onClick={toggleMenu}
            >
              Servicios
            </a>
            <a 
              href="#portfolio" 
              className={`block text-xl font-light transition-all duration-300 transform hover:translate-x-4 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`} 
              onClick={toggleMenu}
            >
              Proyectos
            </a>
            <a 
              href="#contacto" 
              className={`block text-xl font-light transition-all duration-300 transform hover:translate-x-4 hover:scale-105 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`} 
              onClick={toggleMenu}
            >
              Contacto
            </a>
          </div>
          
          {/* Social Media Icons - Mobile Only */}
          <div className={`border-t pt-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-300'
          }`} style={{width: 'fit-content'}}>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/planix" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.instagram.com/planix.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;