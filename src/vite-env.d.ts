/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_PHONE: string
  readonly VITE_ADDRESS: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_GTM_ID: string
  readonly VITE_LINKEDIN: string
  readonly VITE_TWITTER: string
  readonly VITE_GITHUB: string
  readonly VITE_ENABLE_3D: string
  readonly VITE_ENABLE_PARTICLES: string
  readonly VITE_PERFORMANCE_MODE: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
