import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface TechLightingProps {
  intensity?: number
  color?: string
}

const TechLighting: React.FC<TechLightingProps> = ({ 
  intensity = 1,
  color = '#0066FF'
}) => {
  const lightGroupRef = useRef<Group>(null)
  const spotLight1Ref = useRef<THREE.SpotLight>(null)
  const spotLight2Ref = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotación suave del grupo de luces
    if (lightGroupRef.current) {
      lightGroupRef.current.rotation.y = time * 0.1
    }

    // Movimiento dinámico de las luces spotlight
    if (spotLight1Ref.current) {
      spotLight1Ref.current.position.x = Math.sin(time * 0.5) * 3
      spotLight1Ref.current.position.z = Math.cos(time * 0.5) * 3
    }

    if (spotLight2Ref.current) {
      spotLight2Ref.current.position.x = Math.cos(time * 0.3) * 4
      spotLight2Ref.current.position.z = Math.sin(time * 0.3) * 4
    }
  })

  return (
    <group ref={lightGroupRef}>
      {/* Luz ambiente suave */}
      <ambientLight intensity={0.2} color="#1a1a2e" />
      
      {/* Luz direccional principal */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={intensity * 0.8}
        color={color}
        castShadow
      />
      
      {/* Luces spotlight dinámicas para crear ambiente tecnológico */}
      <spotLight
        ref={spotLight1Ref}
        position={[3, 5, 3]}
        intensity={intensity * 0.6}
        color="#00D4FF"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={10}
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        ref={spotLight2Ref}
        position={[-3, 5, -3]}
        intensity={intensity * 0.4}
        color="#10B981"
        angle={Math.PI / 8}
        penumbra={0.8}
        distance={12}
        target-position={[0, 0, 0]}
      />
      
      {/* Luz de relleno */}
      <pointLight
        position={[0, -2, 2]}
        intensity={intensity * 0.3}
        color="#F59E0B"
        distance={8}
      />
      
      {/* Luces de acento para los modelos 3D */}
      <pointLight
        position={[4, 2, -2]}
        intensity={intensity * 0.5}
        color="#EF4444"
        distance={6}
      />
      
      <pointLight
        position={[-4, -1, 2]}
        intensity={intensity * 0.4}
        color="#8B5CF6"
        distance={7}
      />
    </group>
  )
}

export default TechLighting
