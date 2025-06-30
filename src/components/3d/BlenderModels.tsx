import React, { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import { Group } from 'three'
import type { FloatingElementsProps } from '@/types'

// Hook para cargar el modelo del chip tecnológico
function TechChip({ position, ...props }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/tech_chip_assembly.glb')
  const chipRef = useRef<Group>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (chipRef.current) {
      chipRef.current.rotation.y = time * 0.3
      chipRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
    }
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group ref={chipRef} {...props} position={position} scale={[0.8, 0.8, 0.8]}>
        <primitive object={scene.clone()} />
      </group>
    </Float>
  )
}

// Hook para cargar el modelo de la red de conexión
function NetworkAssembly({ position, ...props }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/network_assembly.glb')
  const networkRef = useRef<Group>(null)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (networkRef.current) {
      networkRef.current.rotation.y = time * 0.2
      networkRef.current.rotation.z = Math.sin(time * 0.3) * 0.05
    }
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.4}
    >
      <group ref={networkRef} {...props} position={position} scale={[0.6, 0.6, 0.6]}>
        <primitive object={scene.clone()} />
      </group>
    </Float>
  )
}

// Componente principal que combina todos los modelos
const BlenderModels: React.FC<FloatingElementsProps> = ({ mousePosition }) => {
  const groupRef = useRef<Group>(null)
  useFrame(() => {
    if (groupRef.current) {
      // Movimiento sutil del grupo principal basado en la posición del mouse
      groupRef.current.rotation.y = mousePosition.x * 0.1
      groupRef.current.rotation.x = mousePosition.y * 0.05
    }
  })

  return (
    <Suspense fallback={null}>
      <group ref={groupRef}>
        {/* Chip tecnológico principal */}
        <TechChip position={[3, 1, -2]} />
        
        {/* Red de conexión */}
        <NetworkAssembly position={[-4, -1, 1]} />
        
        {/* Segundo chip más pequeño */}
        <group scale={[0.5, 0.5, 0.5]}>
          <TechChip position={[-2, 3, -1]} />
        </group>
        
        {/* Red secundaria */}
        <group scale={[0.4, 0.4, 0.4]}>
          <NetworkAssembly position={[2, -3, 2]} />
        </group>
      </group>
    </Suspense>
  )
}

// Precargar los modelos
useGLTF.preload('/models/tech_chip_assembly.glb')
useGLTF.preload('/models/network_assembly.glb')

export default BlenderModels
