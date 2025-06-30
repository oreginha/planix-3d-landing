import React, { useState, useEffect } from 'react'
import { Menu, X, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>('')

  const navItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Servicios', href: '#services' },
    { name: 'Tecnología', href: '#technology' },
    { name: 'Portafolio', href: '#portfolio' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Contacto', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      // Detectar sección activa
      for (const item of navItems) {
        const el = document.querySelector(item.href)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(item.href)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass backdrop-blur-xl py-2' : 'bg-transparent py-4'
      }`}
    >
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
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group ${
                  activeSection === item.href ? 'text-white' : ''
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                {item.name}
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-planix-primary to-planix-secondary"
                  animate={{ width: activeSection === item.href ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                  style={{ width: activeSection === item.href ? '100%' : '0%' }}
                />
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              Comenzar Proyecto
            </motion.button>
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="md:hidden overflow-hidden bg-black/90 rounded-b-xl shadow-xl"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2 ${
                      activeSection === item.href ? 'text-white' : ''
                    }`}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-primary w-full mt-4"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Comenzar Proyecto
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 space-y-4 z-40">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => handleNavClick(item.href)}
            className={`block w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === item.href
                ? 'bg-planix-primary scale-125 shadow-lg'
                : 'bg-gray-600 hover:bg-planix-primary'
            }`}
            title={item.name}
            whileHover={{ scale: 1.25 }}
          />
        ))}
      </div>
    </motion.nav>
  )
}

export default Navbar
