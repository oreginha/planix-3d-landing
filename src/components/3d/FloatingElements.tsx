import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { Group, Mesh } from 'three'
import type { FloatingElementsProps } from '@/types'

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  mousePosition, 
  count = 5,
  radius = 3
}) => {
  const groupRef = useRef<Group>(null)
  const sphere1Ref = useRef<Mesh>(null)
  const sphere2Ref = useRef<Mesh>(null)
  const sphere3Ref = useRef<Mesh>(null)
  const torus1Ref = useRef<Mesh>(null)
  const torus2Ref = useRef<Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    }

    // Interactive movement based on mouse position
    if (sphere1Ref.current) {
      sphere1Ref.current.position.x = Math.sin(time) * 2 + mousePosition.x * 0.5
      sphere1Ref.current.position.y = Math.cos(time) * 1.5 + mousePosition.y * 0.3
      sphere1Ref.current.rotation.x = time * 0.5
      sphere1Ref.current.rotation.y = time * 0.3
    }

    if (sphere2Ref.current) {
      sphere2Ref.current.position.x = Math.cos(time * 1.2) * 1.5 - mousePosition.x * 0.3
      sphere2Ref.current.position.z = Math.sin(time * 0.8) * 2
      sphere2Ref.current.rotation.z = time * 0.4
    }

    if (sphere3Ref.current) {
      sphere3Ref.current.position.y = Math.sin(time * 0.9) * 1.8 + mousePosition.y * 0.4
      sphere3Ref.current.position.x = Math.cos(time * 0.7) * 2.5
      sphere3Ref.current.rotation.x = time * 0.6
    }

    if (torus1Ref.current) {
      torus1Ref.current.position.x = Math.sin(time * 0.6) * 3
      torus1Ref.current.position.y = Math.cos(time * 0.4) * 2
      torus1Ref.current.rotation.x = time * 0.8
      torus1Ref.current.rotation.z = time * 0.2
    }

    if (torus2Ref.current) {
      torus2Ref.current.position.z = Math.sin(time * 0.5) * 2.5
      torus2Ref.current.position.x = Math.cos(time * 1.1) * 1.8
      torus2Ref.current.rotation.y = time * 0.7
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floating Sphere 1 */}
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <mesh ref={sphere1Ref} position={[2, 0, -3]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color="#0066FF"
            transparent
            opacity={0.7}
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Floating Sphere 2 */}
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.7}
      >
        <mesh ref={sphere2Ref} position={[-3, 2, 1]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshDistortMaterial
            color="#00D4FF"
            transparent
            opacity={0.6}
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* Floating Sphere 3 */}
      <Float
        speed={1.8}
        rotationIntensity={0.4}
        floatIntensity={0.6}
      >
        <mesh ref={sphere3Ref} position={[1, -2, 2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial
            color="#10B981"
            transparent
            opacity={0.5}
            distort={0.2}
            speed={2.5}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Floating Torus 1 */}
      <Float
        speed={1.2}
        rotationIntensity={0.6}
        floatIntensity={0.4}
      >
        <mesh ref={torus1Ref} position={[-1, 1, -2]}>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.8}
            emissive="#F59E0B"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Floating Torus 2 */}
      <Float
        speed={2.2}
        rotationIntensity={0.7}
        floatIntensity={0.8}
      >
        <mesh ref={torus2Ref} position={[3, -1, 0]}>
          <torusGeometry args={[0.8, 0.2, 16, 32]} />
          <meshStandardMaterial
            color="#EF4444"
            transparent
            opacity={0.3}
            roughness={0.2}
            metalness={0.9}
            emissive="#EF4444"
            emissiveIntensity={0.05}
          />
        </mesh>
      </Float>
    </group>
  )
}

export default FloatingElements
