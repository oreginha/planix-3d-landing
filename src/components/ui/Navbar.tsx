import React, { useState, useEffect } from 'react'
import { Menu, X, Code, Zap, Globe } from 'lucide-react'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Servicios', href: '#services' },
    { name: 'Tecnología', href: '#technology' },
    { name: 'Portafolio', href: '#portfolio' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Contacto', href: '#contact' },
  ]

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass backdrop-blur-xl py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-planix-primary to-planix-secondary rounded-lg flex items-center justify-center glow-blue">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-planix-primary to-planix-secondary rounded-lg opacity-20 animate-pulse-glow"></div>
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              Planix
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-planix-primary to-planix-secondary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => handleNavClick('#contact')}
              className="btn-primary"
            >
              Comenzar Proyecto
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => handleNavClick('#contact')}
              className="btn-primary w-full mt-4"
            >
              Comenzar Proyecto
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 space-y-4 z-40">
        {navItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.href)}
            className="block w-3 h-3 rounded-full bg-gray-600 hover:bg-planix-primary transition-all duration-300 hover:scale-125"
            title={item.name}
          />
        ))}
      </div>
    </nav>
  )
}

export default Navbar
