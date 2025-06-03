import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'
import type { ParticleSystemProps } from '@/types'

interface Particle {
  position: [number, number, number]
  velocity: [number, number, number]
  scale: number
  life: number
  maxLife: number
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 100, 
  size = 0.05, 
  speed = 0.02,
  color = '#0066FF',
  opacity = 0.6
}) => {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        velocity: [
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed
        ],
        scale: Math.random() * 0.5 + 0.5,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      })
    }
    return temp
  }, [count, speed])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    particles.forEach((particle, i) => {
      // Update particle life
      particle.life += 1
      
      // Reset particle if it dies
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.position = [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ]
      }
      
      // Update positions
      particle.position[0] += particle.velocity[0]
      particle.position[1] += particle.velocity[1]
      particle.position[2] += particle.velocity[2]
      
      // Wrap around screen bounds
      if (particle.position[0] > 10) particle.position[0] = -10
      if (particle.position[0] < -10) particle.position[0] = 10
      if (particle.position[1] > 10) particle.position[1] = -10
      if (particle.position[1] < -10) particle.position[1] = 10
      
      // Calculate alpha based on life
      const alpha = 1 - (particle.life / particle.maxLife)
      
      // Set matrix
      dummy.position.set(...particle.position)
      dummy.scale.setScalar(
        particle.scale * (0.5 + 0.5 * Math.sin(time + i)) * alpha
      )
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial 
        color={new Color(color)} 
        opacity={opacity} 
        transparent 
      />
    </instancedMesh>
  )
}

export default ParticleSystem
