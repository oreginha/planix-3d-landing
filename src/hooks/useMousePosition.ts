import { useState, useEffect, useCallback } from 'react'
import type { MousePosition } from '@/types'

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const newPosition = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    }
    
    // Only update if position actually changed to avoid unnecessary renders
    setMousePosition(prevPosition => {
      if (Math.abs(prevPosition.x - newPosition.x) > 0.01 || 
          Math.abs(prevPosition.y - newPosition.y) > 0.01) {
        return newPosition
      }
      return prevPosition
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [updateMousePosition])

  return mousePosition
}
