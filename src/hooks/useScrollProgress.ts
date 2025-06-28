import { useState, useEffect, useCallback } from 'react'

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (totalHeight <= 0) return // Avoid division by zero
    
    const currentProgress = Math.min(Math.max(currentScrollY / totalHeight, 0), 1)
    
    setScrollProgress(prevProgress => {
      // Only update if progress actually changed significantly
      if (Math.abs(prevProgress - currentProgress) > 0.001) {
        return currentProgress
      }
      return prevProgress
    })
    
    setScrollDirection(prevDirection => {
      const newDirection = currentScrollY > (window as any).lastScrollY ? 'down' : 'up';
      (window as any).lastScrollY = currentScrollY
      
      return prevDirection !== newDirection ? newDirection : prevDirection
    })
  }, [])

  useEffect(() => {
    // Initialize lastScrollY
    (window as any).lastScrollY = window.scrollY
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      delete (window as any).lastScrollY
    }
  }, [handleScroll])

  return { progress: scrollProgress, direction: scrollDirection }
}