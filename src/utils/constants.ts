// Constants for the Planix project

export const SITE_CONFIG = {
  name: 'Planix',
  title: 'Planix - Soluciones Web Innovadoras',
  description: 'Empresa tecnológica líder especializada en soluciones web innovadoras, desarrollo de aplicaciones y experiencias digitales 3D.',
  url: 'https://planix.tech',
  email: 'info@planix.tech',
  phone: '+54 11 1234-5678',
  address: 'Buenos Aires, Argentina',
  social: {
    github: 'https://github.com/planix',
    linkedin: 'https://linkedin.com/company/planix',
    twitter: 'https://twitter.com/planix'
  }
} as const

export const COLORS = {
  primary: '#0066FF',
  secondary: '#00D4FF',
  dark: '#0A0A0B',
  gray: '#1A1A1B',
  light: '#F8F9FA',
  accent: '#00D4FF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000
} as const

export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const

export const PERFORMANCE_CONFIG = {
  particleCount: {
    high: 100,
    medium: 50,
    low: 25
  },
  frameRate: {
    high: 60,
    medium: 30,
    low: 15
  },
  quality: {
    high: 2,
    medium: 1,
    low: 0.5
  }
} as const

export const SECTIONS = [
  { id: 'hero', name: 'Inicio' },
  { id: 'services', name: 'Servicios' },
  { id: 'technology', name: 'Tecnología' },
  { id: 'portfolio', name: 'Portafolio' },
  { id: 'about', name: 'Nosotros' },
  { id: 'contact', name: 'Contacto' }
] as const

export const SERVICES = [
  'Desarrollo Web',
  'Aplicaciones Móviles',
  'Experiencias 3D',
  'E-commerce',
  'Diseño UI/UX',
  'Backend & APIs'
] as const

export const TECHNOLOGIES = [
  'React',
  'Next.js',
  'TypeScript',
  'Three.js',
  'Node.js',
  'Python',
  'GraphQL',
  'PostgreSQL',
  'Figma',
  'Blender',
  'React Native',
  'Docker'
] as const

export const PROJECT_CATEGORIES = [
  'web',
  'app',
  '3d',
  'ecommerce'
] as const

export const CONTACT_REASONS = [
  'Nuevo Proyecto',
  'Consultoría',
  'Soporte',
  'Colaboración',
  'Otro'
] as const

export const BUDGET_RANGES = [
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k+', label: '$50,000+' },
  { value: 'not-sure', label: 'No estoy seguro' }
] as const

export const TIMELINE_OPTIONS = [
  { value: '1-2-weeks', label: '1-2 semanas' },
  { value: '1-month', label: '1 mes' },
  { value: '2-3-months', label: '2-3 meses' },
  { value: '3-6-months', label: '3-6 meses' },
  { value: '6-months+', label: '6+ meses' }
] as const

export const LOADING_MESSAGES = [
  'Cargando recursos...',
  'Preparando modelos 3D...',
  'Aplicando texturas...',
  'Optimizando performance...',
  '¡Listo para la experiencia!'
] as const

export const SEO_KEYWORDS = [
  'desarrollo web',
  'aplicaciones móviles',
  'experiencias 3D',
  'React',
  'Three.js',
  'TypeScript',
  'soluciones web',
  'empresa tecnológica',
  'Buenos Aires',
  'Argentina'
] as const

export const PERFORMANCE_METRICS = {
  // Core Web Vitals thresholds
  LCP_THRESHOLD: 2500, // Largest Contentful Paint
  FID_THRESHOLD: 100,  // First Input Delay
  CLS_THRESHOLD: 0.1,  // Cumulative Layout Shift
  FCP_THRESHOLD: 1800, // First Contentful Paint
  TTI_THRESHOLD: 3800, // Time to Interactive
} as const

export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  projects: '/api/projects',
  testimonials: '/api/testimonials'
} as const
