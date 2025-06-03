import { Vector3 } from 'three'

export interface MousePosition {
  x: number
  y: number
}

export interface ScrollProgress {
  progress: number
  direction: 'up' | 'down'
}

export interface ThreeScene {
  camera: {
    position: Vector3
    fov: number
  }
  lights: {
    ambient: {
      intensity: number
    }
    directional: {
      position: Vector3
      intensity: number
      color: string
    }[]
  }
}

export interface ParticleSystemProps {
  count?: number
  size?: number
  speed?: number
  color?: string
  opacity?: number
}

export interface FloatingElementsProps {
  mousePosition: MousePosition
  count?: number
  radius?: number
}

export interface InteractiveOrbProps {
  scrollProgress: number
  position?: Vector3
  scale?: number
  color?: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  color: string
}

export interface TechnologyItem {
  id: string
  name: string
  category: 'frontend' | 'backend' | '3d' | 'tools'
  icon: string
  description: string
  proficiency: number
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  category: 'web' | 'app' | '3d' | 'ecommerce'
}

export interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  image: string
  social: {
    linkedin?: string
    github?: string
    twitter?: string
  }
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  message: string
  budget?: string
  timeline?: string
}

export interface AnimationConfig {
  duration: number
  ease: string
  delay?: number
  repeat?: number
}

export interface LoadingState {
  isLoading: boolean
  progress: number
  stage: 'assets' | 'models' | 'textures' | 'complete'
}

export interface IntersectionObserverConfig {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}
