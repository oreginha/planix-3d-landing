import React, { memo } from 'react'
import { usePreloader } from '@/hooks/usePreloader'

const LoadingScreen: React.FC = memo(() => {
  const { progress, stage } = usePreloader()

  const getStageText = (currentStage: string) => {
    switch (currentStage) {
      case 'assets':
        return 'Cargando recursos...'
      case 'models':
        return 'Preparando modelos 3D...'
      case 'textures':
        return 'Aplicando texturas...'
      case 'complete':
        return '¡Listo para la experiencia!'
      default:
        return 'Iniciando Planix...'
    }
  }

  return (
    <div className="fixed inset-0 bg-planix-dark flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-planix-primary rounded-full opacity-10 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-planix-secondary rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-planix-accent rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-planix-primary to-planix-secondary rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
            <div className="text-3xl font-bold text-white">P</div>
          </div>
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            Planix
          </h1>
          <p className="text-gray-400 text-sm">
            Soluciones Web Innovadoras
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-planix-primary to-planix-secondary rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.round(progress)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
            </div>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Stage Text */}
        <div className="mb-8">
          <p className="text-white font-medium animate-fade-in">
            {getStageText(stage)}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2 bg-planix-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-planix-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-planix-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Tech Stack Hint */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Impulsado por React Three Fiber & WebGL</p>
        </div>
      </div>

      {/* Loading Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-planix-primary rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${8 + Math.random() * 4}s infinite linear`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
