import React from 'react';

interface HeroSectionProps {
  isDarkMode: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isDarkMode }) => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center px-6 pt-16 md:pt-0 overflow-hidden">
      {/* Additional geometric shapes specifically for Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Extra floating geometric shapes */}
        <div 
          className={`absolute w-20 h-20 rounded-lg transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-cyan-500/15' : 'bg-cyan-600/10'
          }`}
          style={{
            left: '10%',
            top: '30%',
            animation: 'cube3d 30s linear infinite',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className={`absolute w-36 h-36 rounded-full transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-orange-500/10' : 'bg-orange-600/8'
          }`}
          style={{
            right: '8%',
            top: '35%',
            animation: 'cube3d 28s linear infinite reverse',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className={`absolute w-16 h-16 transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-600/15'
          }`}
          style={{
            left: '25%',
            top: '60%',
            animation: 'cube3d 24s linear infinite',
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
        <div 
          className={`absolute w-24 h-24 transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-indigo-500/15' : 'bg-indigo-600/12'
          }`}
          style={{
            right: '30%',
            top: '70%',
            animation: 'cube3d 26s linear infinite reverse',
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
          }}
        />
        <div 
          className={`absolute w-32 h-32 rounded-lg transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-red-500/10' : 'bg-red-600/8'
          }`}
          style={{
            left: '70%',
            top: '20%',
            animation: 'cube3d 32s linear infinite',
            transformStyle: 'preserve-3d'
          }}
        />
        <div 
          className={`absolute w-28 h-28 transform-gpu transition-colors duration-500 ${
            isDarkMode ? 'bg-emerald-500/12' : 'bg-emerald-600/10'
          }`}
          style={{
            left: '5%',
            bottom: '30%',
            animation: 'cube3d 29s linear infinite reverse',
            transformStyle: 'preserve-3d',
            borderRadius: '30%'
          }}
        />

        {/* Additional floating orbs */}
        <div 
          className={`absolute w-72 h-72 rounded-full blur-3xl transition-colors duration-500 ${
            isDarkMode ? 'bg-cyan-400/8' : 'bg-cyan-500/6'
          }`}
          style={{
            right: '5%',
            top: '5%',
            animation: 'orbFloat 20s ease-in-out infinite 3s'
          }}
        />
        <div 
          className={`absolute w-56 h-56 rounded-full blur-2xl transition-colors duration-500 ${
            isDarkMode ? 'bg-orange-400/10' : 'bg-orange-500/8'
          }`}
          style={{
            left: '20%',
            bottom: '10%',
            animation: 'orbFloat 22s ease-in-out infinite 7s'
          }}
        />

        {/* Extra particles specifically for hero */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`hero-particle-${i}`}
            className={`absolute rounded-full transition-colors duration-500 ${
              isDarkMode ? 'bg-white/30' : 'bg-gray-700/25'
            }`}
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particleFloat ${6 + Math.random() * 6}s ease-in-out infinite ${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div className="mb-3 pb-0">
          <div className={`inline-flex items-center space-x-2 backdrop-blur-md rounded-full px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-sm font-medium mb-4 md:mb-6 shadow-lg transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800/90 text-gray-300 border border-gray-700' : 'bg-white/90 text-gray-700 border border-white/20'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="marquee-text">INNOVACIÓN DIGITAL QUE MARCA LA DIFERENCIA</div>
            </div>
          </div>
        </div>
        
        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight drop-shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
          Soluciones digitales
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            extraordinarias
          </span>
        </h1>
        
        <p className={`text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-sm transition-colors duration-300 px-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Creamos experiencias impactantes que transforman tu negocio. 
          <span className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 px-1 py-1 backdrop-blur-sm shadow-lg">
            <strong className="text-white">Desarrollamos productos completamente a medida:</strong>
          </span>{' '}
          imagina cualquier producto digital y lo construimos juntos, desde el concepto hasta la implementación.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 md:mb-24 px-4">
          <button 
            className={`px-8 py-4 border-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:border-white hover:bg-white hover:text-gray-900' 
                : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
            }`}
            onClick={() => {
              const portfolioSection = document.getElementById('portfolio');
              if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Ver nuestro trabajo
          </button>
          <button 
            className={`relative overflow-hidden px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-black hover:bg-gray-800'
            }`}
            onClick={() => {
              // Trigger modal opening - we'll need to pass this function from App.tsx
              const event = new CustomEvent('openContactModal');
              window.dispatchEvent(event);
            }}
          >
            <span className="relative z-10">Comenzar proyecto</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block">
          <div 
            className={`w-6 h-10 border-2 rounded-full flex justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 ${
              isDarkMode ? 'border-gray-400 hover:border-white' : 'border-gray-400 hover:border-black'
            }`}
            onClick={() => {
              const nextSection = document.getElementById('servicios');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;