import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import type { InteractiveOrbProps } from '@/types'

const InteractiveOrb: React.FC<InteractiveOrbProps> = ({ 
  scrollProgress, 
  position = new Vector3(0, 0, 0),
  scale = 1,
  color = '#0066FF'
}) => {
  const orbRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (orbRef.current) {
      // Base rotation
      orbRef.current.rotation.x = time * 0.5
      orbRef.current.rotation.y = time * 0.3
      
      // Scale based on scroll progress
      const scaleValue = scale * (1 + scrollProgress * 0.5)
      orbRef.current.scale.setScalar(scaleValue)
      
      // Position changes based on scroll
      orbRef.current.position.y = position.y + Math.sin(scrollProgress * Math.PI * 2) * 2
      orbRef.current.position.x = position.x + Math.cos(time * 0.2) * 0.5
      
      // Material distortion based on scroll
      const material = orbRef.current.material as any
      if (material && material.distort !== undefined) {
        material.distort = 0.2 + scrollProgress * 0.3
      }
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.8
      ringRef.current.rotation.z = time * 0.4
      
      // Ring scale pulsing
      const pulseScale = 1 + Math.sin(time * 2) * 0.1
      ringRef.current.scale.setScalar(pulseScale * scale)
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main Orb */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <mesh ref={orbRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.8}
            distort={0.2}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Orbiting Ring */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.1}
      >
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[3, 0.1, 8, 32]} />
          <meshStandardMaterial
            color="#00D4FF"
            transparent
            opacity={0.4}
            emissive="#00D4FF"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Inner Particles */}
      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2,
              Math.sin((i / 8) * Math.PI * 2) * 0.5,
              Math.sin((i / 8) * Math.PI * 2) * 2
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#FFFFFF" 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default InteractiveOrb
