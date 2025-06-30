import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

const TechScene: React.FC<{ position?: [number, number, number], scale?: [number, number, number] }> = ({ position = [0,0,0], scale = [1,1,1] }) => {
  // Cambiar a la versión profesional avanzada
  const { scene } = useGLTF('/models/TechScene_Pro.glb')
  const ref = useRef<Group>(null)

  // Animación de rotación lenta para toda la escena
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

export default TechScene
