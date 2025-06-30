import React, { useRef } from 'react'
import { ChevronDown, Rocket, Sparkles, Globe } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { motion, AnimatePresence } from 'framer-motion'

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(heroRef, { 
    threshold: 0.3,
    triggerOnce: true 
  })

  const scrollToServices = () => {
    const servicesSection = document.querySelector('#services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-planix-dark via-planix-gray to-planix-dark opacity-90"></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
      </motion.div>

      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div className="absolute top-1/4 left-1/4 w-64 h-64 bg-planix-primary rounded-full opacity-5 animate-float" initial={{ y: -40 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.4 }} />
        <motion.div className="absolute top-3/4 right-1/4 w-48 h-48 bg-planix-secondary rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }} initial={{ x: 40 }} animate={{ x: 0 }} transition={{ duration: 1.2, delay: 0.6 }} />
        <motion.div className="absolute top-1/2 left-3/4 w-32 h-32 bg-planix-accent rounded-full opacity-8 animate-float" style={{ animationDelay: '4s' }} initial={{ y: 40 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.8 }} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatePresence>
          {hasIntersected && (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-planix-secondary" />
                <span className="text-sm text-gray-300 font-medium">
                  Experiencias Digitales del Futuro
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6"
              >
                <span className="text-white">Creamos</span>
                <br />
                <span className="text-gradient">Soluciones Web</span>
                <br />
                <span className="text-white">Extraordinarias</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                Transformamos ideas innovadoras en experiencias digitales inmersivas 
                utilizando las últimas tecnologías 3D, React y diseño moderno.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="flex flex-wrap justify-center items-center gap-8 mb-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">100+</div>
                  <div className="text-sm text-gray-400">Proyectos Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">50+</div>
                  <div className="text-sm text-gray-400">Clientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">3</div>
                  <div className="text-sm text-gray-400">Años de Experiencia</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <button 
                  onClick={scrollToServices}
                  className="btn-primary group flex items-center space-x-2"
                >
                  <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Explorar Servicios</span>
                </button>
                <button 
                  onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary group flex items-center space-x-2"
                >
                  <Globe className="w-5 h-5 group-hover:animate-spin-slow" />
                  <span>Ver Portafolio</span>
                </button>
              </motion.div>

              {/* Technology Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="inline-flex items-center space-x-6 text-sm text-gray-400"
              >
                <span>Construido con:</span>
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-800 px-3 py-1 rounded-full">React</span>
                  <span className="bg-gray-800 px-3 py-1 rounded-full">Three.js</span>
                  <span className="bg-gray-800 px-3 py-1 rounded-full">TypeScript</span>
                  <span className="bg-gray-800 px-3 py-1 rounded-full">WebGL</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={scrollToServices}
          className="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm font-medium mb-2">Descubre más</span>
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-planix-secondary" />
        </button>
      </motion.div>

      {/* Floating Particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-planix-primary rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${10 + Math.random() * 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </motion.div>
    </section>
  )
}

export default Hero
