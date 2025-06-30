import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, GodRays, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'

// Components
import { Navbar, LoadingScreen, Footer, ParticleSystem, FloatingElements, InteractiveOrb, BlenderModels } from './components'
import { Hero, Services, Technology, Portfolio, About, Contact } from './sections'
import DisruptiveShape from './components/3d/DisruptiveShape'
import TechScene from './components/3d/TechScene'

// Hooks
import { useScrollProgress, useMousePosition, usePreloader } from './hooks'

// Utils
import { isMobile, hasWebGL } from './utils'

const App: React.FC = () => {
  const { progress: scrollProgress } = useScrollProgress()
  const mousePosition = useMousePosition()
  const { isLoading } = usePreloader()
  const [performanceMode, setPerformanceMode] = useState<boolean>(false)

  // Memoize performance detection to avoid recalculating
  const shouldUsePerformanceMode = useMemo(() => {
    if (typeof window === 'undefined') return true
    
    const deviceMemory = (navigator as any).deviceMemory
    const connection = (navigator as any).connection
    
    return (
      isMobile() ||
      !hasWebGL() ||
      (deviceMemory && deviceMemory < 4) ||
      (connection && connection.effectiveType === 'slow-2g')
    )
  }, [])

  useEffect(() => {
    setPerformanceMode(shouldUsePerformanceMode)
  }, [shouldUsePerformanceMode])

  // Memoize 3D scene to prevent unnecessary re-renders
  const Scene3D = useMemo(() => {
    if (performanceMode) return null

    return (
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.3} />
            <pointLight 
              position={[10, 10, 10]} 
              intensity={1} 
              color="#0066FF"
            />
            <pointLight 
              position={[-10, -10, -10]} 
              intensity={0.5} 
              color="#00D4FF" 
            />
            <EffectComposer>
              <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.2} radius={0.8} />
              <DepthOfField focusDistance={0.01} focalLength={0.25} bokehScale={2.5} height={480} />
              <Vignette eskil={false} offset={0.2} darkness={0.7} />
              <Noise opacity={0.04} />
              <ChromaticAberration offset={[0.001, 0.001]} />
            </EffectComposer>
            <Physics 
              gravity={[0, -9.81, 0]} 
              timeStep={1/60}
            >
              <ParticleSystem 
                count={50} 
                size={0.05}
                speed={0.02}
              />
              <FloatingElements 
                mousePosition={mousePosition} 
              />
              {/* Objeto 3D disruptivo animado */}
              <DisruptiveShape position={[0, 0, 0]} scale={[1.6, 1.6, 1.6]} />
              {/* Escena 3D profesional y animada */}
              <TechScene position={[0, 0, 0]} scale={[1.7, 1.7, 1.7]} />
              {/* Modelos 3D de Blender */}
              <BlenderModels mousePosition={mousePosition} />
              <InteractiveOrb 
                scrollProgress={scrollProgress} 
              />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    )
  }, [performanceMode, mousePosition, scrollProgress])

  // Memoize fallback particles
  const FallbackParticles = useMemo(() => {
    if (!performanceMode) return null

    return (
      <div className="fixed inset-0 z-0 particles-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    )
  }, [performanceMode])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="relative min-h-screen bg-planix-dark text-white overflow-x-hidden">
      {/* Background 3D Scene or Fallback */}
      {Scene3D}
      {FallbackParticles}

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main>
          <Hero />
          <Services />
          <Technology />
          <Portfolio />
          <About />
          <Contact />
        </main>
        
        <Footer />
      </div>

      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-planix-primary to-planix-secondary transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }} 
      />

      {/* Performance Mode Indicator */}
      {performanceMode && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 bg-opacity-90 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300">
          Modo rendimiento activado
        </div>
      )}

      {/* Skip to Content Link for Accessibility */}
      <a 
        href="#hero" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-planix-primary text-white px-4 py-2 rounded-lg font-semibold"
      >
        Saltar al contenido principal
      </a>
    </div>
  )
}

export default App
