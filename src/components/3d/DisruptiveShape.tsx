import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

// Objeto 3D disruptivo cargado desde Blender GLB
const DisruptiveShape: React.FC<{ position?: [number, number, number], scale?: [number, number, number] }> = ({ position = [0,0,0], scale = [1,1,1] }) => {
  const { scene } = useGLTF('/models/DisruptiveShape.glb')
  const ref = useRef<Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
      ref.current.rotation.x += 0.003
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

export default DisruptiveShape
