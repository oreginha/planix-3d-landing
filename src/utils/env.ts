/// <reference types="vite/client" />

// Environment configuration
export const env = {
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  BASE_URL: import.meta.env.BASE_URL,
  
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'https://api.planix.tech',
  
  // Analytics
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID || '',
  
  // Contact
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'info@planix.tech',
  
  // Social Media
  GITHUB_URL: import.meta.env.VITE_GITHUB_URL || 'https://github.com/planix',
  LINKEDIN_URL: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/planix',
  TWITTER_URL: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/planix',
} as const

// Type-safe environment validation
export const validateEnv = () => {
  const requiredEnvVars = ['NODE_ENV', 'BASE_URL'] as const
  
  for (const envVar of requiredEnvVars) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

// Initialize environment validation in development
if (env.DEV) {
  try {
    validateEnv()
    console.log('✅ Environment variables validated successfully')
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
  }
}
