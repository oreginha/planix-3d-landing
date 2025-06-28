import React from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

interface CustomScrollbarProps {
  isDarkMode: boolean
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ isDarkMode }) => {
  const { progress } = useScrollProgress()

  return (
    <>
      {/* Hide native scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        html {
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Custom scrollbar track */}
      <div className="fixed right-0 top-0 z-50 w-2 h-full pointer-events-none">
        <div 
          className={`w-full h-full transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800/30' : 'bg-gray-200/30'
          }`}
        />
        
        {/* Scrollbar thumb with animated light */}
        <div 
          className="absolute right-0 top-0 w-2 rounded-full transition-all duration-100 ease-out overflow-hidden"
          style={{ 
            height: `${Math.max(progress * 100, 8)}%`,
            background: isDarkMode 
              ? 'linear-gradient(180deg, #0066FF 0%, #00D4FF 50%, #0066FF 100%)'
              : 'linear-gradient(180deg, #3B82F6 0%, #8B5CF6 50%, #3B82F6 100%)'
          }}
        >
          {/* Animated light effect */}
          <div 
            className="absolute inset-0 w-full opacity-70"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
              animation: 'scrollLight 2s ease-in-out infinite'
            }}
          />
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 w-full"
            style={{
              boxShadow: isDarkMode
                ? '0 0 10px rgba(0, 102, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.4)'
                : '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.4)',
              animation: 'scrollGlow 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes scrollLight {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
        
        @keyframes scrollGlow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.3);
          }
        }
      `}</style>
    </>
  )
}

export default CustomScrollbar