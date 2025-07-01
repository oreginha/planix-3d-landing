import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PortfolioSection from './components/PortfolioSection';
import LoadingScreen from './components/LoadingScreen';
import ContactModal from './components/ContactModal';
import ProjectModal from './components/ProjectModal';
import ScrollToTop from './components/ScrollToTop';
import CustomScrollbar from './components/CustomScrollbar';
import FloatingChat from './components/chat/FloatingChat';
import './styles/globals.css';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    // Loading simulation
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Listen for modal opening event from HeroSection
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openContactModal', handleOpenModal);
    
    // Update html class for dark mode scrollbar
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return () => {
      clearInterval(loadingInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openContactModal', handleOpenModal);
    };
  }, [isDarkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Loading Screen
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className={`min-h-screen overflow-x-hidden relative transition-all duration-500 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* Global Futuristic 3D Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Cosmic Connection Lines - Between Hero and Services */}
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{top: 'max(calc(100vh - 250px), 750px)', zIndex: 10}}>
          {/* SVG Cosmic Lines */}
          <svg 
            width="90vw" 
            height="200"
            viewBox="0 0 700 200" 
            className="max-w-[700px] mx-auto"
            style={{ maxHeight: '250px' }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="cosmicGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'} />
                <stop offset="50%" stopColor={isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'} />
                <stop offset="100%" stopColor={isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'} />
              </linearGradient>
              <linearGradient id="cosmicGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'} />
                <stop offset="50%" stopColor={isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} />
                <stop offset="100%" stopColor={isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'} />
              </linearGradient>
              <radialGradient id="planetGradient">
                <stop offset="0%" stopColor={isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.4)'} />
                <stop offset="100%" stopColor={isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'} />
              </radialGradient>
            </defs>
            
            {/* Main connection curves - Larger */}
            <path 
              d="M30 100 Q200 40 350 100 T670 100" 
              stroke="url(#cosmicGradient1)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="8,8"
              className="animate-pulse"
            />
            <path 
              d="M60 130 Q250 60 400 130 T640 130" 
              stroke="url(#cosmicGradient2)" 
              strokeWidth="2.5" 
              fill="none" 
              strokeDasharray="6,10"
              style={{ animationDelay: '1s' }}
              className="animate-pulse"
            />
            <path 
              d="M80 70 Q300 20 450 70 T620 70" 
              stroke="url(#cosmicGradient1)" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="4,12"
              style={{ animationDelay: '2s' }}
              className="animate-pulse"
            />
            
            {/* Planet nodes - Larger */}
            <circle cx="80" cy="100" r="6" fill="url(#planetGradient)" className="animate-pulse" />
            <circle cx="350" cy="100" r="8" fill="url(#planetGradient)" style={{ animationDelay: '0.5s' }} className="animate-pulse" />
            <circle cx="620" cy="100" r="6" fill="url(#planetGradient)" style={{ animationDelay: '1.5s' }} className="animate-pulse" />
            
            {/* Large outline circles at extremes */}
            <circle cx="30" cy="100" r="12" stroke={isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'} strokeWidth="2" fill="none" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <circle cx="30" cy="100" r="18" stroke={isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'} strokeWidth="1" fill="none" strokeDasharray="2,4" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
            
            <circle cx="670" cy="100" r="12" stroke={isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'} strokeWidth="2" fill="none" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '1.3s' }} />
            <circle cx="670" cy="100" r="18" stroke={isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} strokeWidth="1" fill="none" strokeDasharray="2,4" className="animate-pulse" style={{ animationDelay: '1.8s' }} />
            
            {/* Smaller connection nodes */}
            <circle cx="180" cy="65" r="3" fill={isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'} className="animate-pulse" style={{ animationDelay: '0.8s' }} />
            <circle cx="480" cy="115" r="3" fill={isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'} className="animate-pulse" style={{ animationDelay: '1.2s' }} />
            <circle cx="260" cy="145" r="3" fill={isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'} className="animate-pulse" style={{ animationDelay: '1.8s' }} />
            <circle cx="520" cy="75" r="2" fill={isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'} className="animate-pulse" style={{ animationDelay: '2.2s' }} />
            
            {/* Orbital rings around main planets */}
            <circle cx="350" cy="100" r="15" stroke={isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'} strokeWidth="1" fill="none" strokeDasharray="2,3" className="animate-spin" style={{ animationDuration: '20s' }} />
            <circle cx="350" cy="100" r="25" stroke={isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'} strokeWidth="0.5" fill="none" strokeDasharray="1,4" className="animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
          </svg>
        </div>

        {/* CSS-based 3D Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes - larger */}
          <div 
            className={`absolute w-32 h-32 rounded-lg transform-gpu transition-colors duration-500 ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-600/15'
            }`}
            style={{
              left: '8%',
              top: '12%',
              animation: 'cube3d 20s linear infinite',
              transformStyle: 'preserve-3d'
            }}
          />
          <div 
            className={`absolute w-24 h-24 rounded-lg transform-gpu transition-colors duration-500 ${
              isDarkMode ? 'bg-purple-500/25' : 'bg-purple-600/20'
            }`}
            style={{
              right: '12%',
              top: '20%',
              animation: 'cube3d 25s linear infinite reverse',
              transformStyle: 'preserve-3d'
            }}
          />
          <div 
            className={`absolute w-40 h-40 rounded-lg transform-gpu transition-colors duration-500 ${
              isDarkMode ? 'bg-pink-500/15' : 'bg-pink-600/10'
            }`}
            style={{
              left: '15%',
              bottom: '15%',
              animation: 'cube3d 18s linear infinite',
              transformStyle: 'preserve-3d'
            }}
          />
          <div 
            className={`absolute w-28 h-28 rounded-full transform-gpu transition-colors duration-500 ${
              isDarkMode ? 'bg-green-500/15' : 'bg-green-600/12'
            }`}
            style={{
              right: '20%',
              bottom: '25%',
              animation: 'cube3d 22s linear infinite reverse',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Floating orbs */}
          <div 
            className={`absolute w-64 h-64 rounded-full blur-3xl transition-colors duration-500 ${
              isDarkMode ? 'bg-blue-400/10' : 'bg-blue-500/8'
            }`}
            style={{
              left: '5%',
              top: '10%',
              animation: 'orbFloat 15s ease-in-out infinite'
            }}
          />
          <div 
            className={`absolute w-48 h-48 rounded-full blur-2xl transition-colors duration-500 ${
              isDarkMode ? 'bg-purple-400/15' : 'bg-purple-500/10'
            }`}
            style={{
              right: '10%',
              bottom: '15%',
              animation: 'orbFloat 18s ease-in-out infinite 5s'
            }}
          />

          {/* Particles */}
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full transition-colors duration-500 ${
                isDarkMode ? 'bg-blue-400/40' : 'bg-blue-600/30'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particleFloat ${8 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Subtle gradient background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10' 
              : 'bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50'
          }`}
        />
      </div>
      
      <Header 
        scrollY={scrollY}
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="relative z-10">
        <HeroSection isDarkMode={isDarkMode} />

        <ServicesSection isDarkMode={isDarkMode} />

        {/* Divider */}
        <div className={`w-full h-px transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>

        <PortfolioSection 
          isDarkMode={isDarkMode} 
          onContactClick={() => setIsModalOpen(true)}
          onProjectClick={(project) => {
            setSelectedProject(project);
            setIsProjectModalOpen(true);
          }}
        />

        {/* Contact Section */}
        <section id="contacto" className="py-[100px] md:py-32 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative text-center">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
              ¿Listo para transformar tu
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                presencia digital?
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto mb-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Contáctanos hoy y descubre cómo podemos impulsar tu negocio al siguiente nivel
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`relative overflow-hidden px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-black hover:bg-gray-800'
              }`}
            >
              <span className="relative z-10">Iniciar conversación</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            {/* Image Placeholder */}
            <div className={`mt-12 mx-auto rounded-lg overflow-hidden transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
            } border-2 border-dashed w-[90vw] max-w-[750px] h-[250px] md:h-[350px]`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center px-4">
                  <svg className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Imagen placeholder<br className="hidden md:block" />
                    <span className="md:hidden">Responsive</span>
                    <span className="hidden md:inline">750px × 350px</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className={`relative z-20 py-12 px-6 border-t transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                © 2025 Planix. Todos los derechos reservados.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <button 
                type="button"
                onClick={() => console.log('Política de privacidad')}
                className={`transition-colors duration-300 hover:underline ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Privacidad
              </button>
              <button 
                type="button"
                onClick={() => console.log('Términos y condiciones')}
                className={`transition-colors duration-300 hover:underline ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Términos
              </button>
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`transition-colors duration-300 hover:underline ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar */}
      <CustomScrollbar isDarkMode={isDarkMode} />

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        isDarkMode={isDarkMode}
      />

      {/* Scroll to Top */}
      <ScrollToTop isDarkMode={isDarkMode} />

      {/* Floating Chat */}
      <FloatingChat isDarkMode={isDarkMode} />

    </div>
  );
};

export default App;