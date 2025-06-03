// Optimized types for Planix 3D Landing Page

// Mouse Position
export interface MousePosition {
  x: number
  y: number
}

// Scroll Progress
export interface ScrollProgress {
  progress: number
}

// Intersection Observer
export interface IntersectionOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

export interface IntersectionResult {
  hasIntersected: boolean
  isIntersecting: boolean
  intersectionRatio: number
}

// Loading States
export type LoadingStage = 'assets' | 'models' | 'textures' | 'complete'

export interface LoadingState {
  isLoading: boolean
  progress: number
  stage: LoadingStage
}

// 3D Components Props
export interface ParticleSystemProps {
  count?: number
  size?: number
  speed?: number
}

export interface FloatingElementsProps {
  mousePosition: MousePosition
}

export interface InteractiveOrbProps {
  scrollProgress: number
}

// Team Member
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

// Portfolio Project
export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  category: 'web' | 'mobile' | '3d' | 'ecommerce'
}

// Service
export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

// Technology
export interface Technology {
  id: string
  name: string
  category: 'frontend' | 'backend' | '3d' | 'tools'
  proficiency: number
  icon: string
}

// Contact Form
export interface ContactFormData {
  name: string
  email: string
  company?: string
  budget: 'small' | 'medium' | 'large' | 'enterprise'
  message: string
  services: string[]
}

// Animation Variants (Framer Motion)
export interface AnimationVariants {
  initial: object
  animate: object
  exit?: object
}

// Environment Variables (for type safety)
export interface Env {
  NODE_ENV: string
  PROD: boolean
  DEV: boolean
  BASE_URL: string
  API_URL: string
  ANALYTICS_ID: string
  CONTACT_EMAIL: string
  GITHUB_URL: string
  LINKEDIN_URL: string
  TWITTER_URL: string
}
