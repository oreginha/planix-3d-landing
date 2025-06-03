import { useState, useEffect, RefObject, useCallback } from 'react'
import type { IntersectionObserverConfig } from '@/types'

interface UseIntersectionObserverReturn {
  isIntersecting: boolean
  hasIntersected: boolean
  entry: IntersectionObserverEntry | null
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverConfig = {}
): UseIntersectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
  const [hasIntersected, setHasIntersected] = useState<boolean>(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = false
  } = options

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [observerEntry] = entries
    
    setEntry(observerEntry)
    setIsIntersecting(observerEntry.isIntersecting)
    
    if (observerEntry.isIntersecting && !hasIntersected) {
      setHasIntersected(true)
    }
  }, [hasIntersected])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(element)
    
    return () => {
      observer.unobserve(element)
    }
  }, [ref, threshold, rootMargin, handleIntersection])

  useEffect(() => {
    // If triggerOnce is true and element has intersected, clean up
    if (triggerOnce && hasIntersected && ref.current) {
      // This effect will clean up the observer if needed
    }
  }, [triggerOnce, hasIntersected, ref])

  return { isIntersecting, hasIntersected, entry }
}
