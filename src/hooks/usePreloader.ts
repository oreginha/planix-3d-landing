import { useState, useEffect, useCallback } from 'react'
import type { LoadingState } from '@/types'

export const usePreloader = (): LoadingState => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    stage: 'assets'
  })

  const simulateLoading = useCallback(async () => {
    const stages = ['assets', 'models', 'textures', 'complete'] as const
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      const stageProgress = (i / (stages.length - 1)) * 100
      
      setLoadingState({
        isLoading: stage !== 'complete',
        stage,
        progress: stageProgress
      })
      
      // Simulate loading time for each stage (except last)
      if (stage !== 'complete') {
        await new Promise(resolve => setTimeout(resolve, 800))
      }
    }
  }, []) // Empty dependency array - this function doesn't depend on external values

  useEffect(() => {
    simulateLoading()
  }, [simulateLoading]) // Only run when simulateLoading changes (which it won't)

  return loadingState
}
