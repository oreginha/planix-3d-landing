import React, { useRef } from 'react'
import { Code, Smartphone, Box, ShoppingCart, Zap, Globe, Palette, Database } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { ServiceItem } from '@/types'

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(sectionRef, { 
    threshold: 0.2,
    triggerOnce: true 
  })

  const services: ServiceItem[] = [
    {
      id: 'web-development',
      title: 'Desarrollo Web',
      description: 'Sitios web modernos y aplicaciones web progresivas con las últimas tecnologías.',
      icon: 'Code',
      features: [
        'React & Next.js',
        'Progressive Web Apps',
        'Responsive Design',
        'SEO Optimizado',
        'Performance Optimizado'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'mobile-apps',
      title: 'Aplicaciones Móviles',
      description: 'Apps nativas e híbridas para iOS y Android con experiencias excepcionales.',
      icon: 'Smartphone',
      features: [
        'React Native',
        'Flutter',
        'Apps Nativas',
        'Cross-platform',
        'UI/UX Avanzado'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      id: '3d-experiences',
      title: 'Experiencias 3D',
      description: 'Visualizaciones 3D inmersivas y experiencias interactivas para web.',
      icon: 'Box',
      features: [
        'Three.js & WebGL',
        'Modelos 3D Interactivos',
        'Realidad Virtual',
        'Animaciones Avanzadas',
        'Rendering en Tiempo Real'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Tiendas online completas con sistemas de pago y gestión avanzada.',
      icon: 'ShoppingCart',
      features: [
        'Shopify & WooCommerce',
        'Pasarelas de Pago',
        'Gestión de Inventario',
        'Analytics Avanzado',
        'Marketing Automation'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'ui-ux-design',
      title: 'Diseño UI/UX',
      description: 'Interfaces intuitivas y experiencias de usuario que convierten visitantes en clientes.',
      icon: 'Palette',
      features: [
        'Research & Strategy',
        'Wireframing & Prototyping',
        'Design Systems',
        'User Testing',
        'Accessibility Focus'
      ],
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'backend-apis',
      title: 'Backend & APIs',
      description: 'Arquitecturas robustas y APIs escalables para aplicaciones empresariales.',
      icon: 'Database',
      features: [
        'Node.js & Python',
        'GraphQL & REST APIs',
        'Microservicios',
        'Cloud Architecture',
        'DevOps & CI/CD'
      ],
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  const getIcon = (iconName: string) => {
    const iconMap = {
      Code,
      Smartphone,
      Box,
      ShoppingCart,
      Palette,
      Database
    }
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Code
    return IconComponent
  }

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="relative py-24 bg-planix-dark"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-planix-secondary" />
            <span className="text-sm text-gray-300 font-medium">
              Nuestros Servicios
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Soluciones <span className="text-gradient">Completas</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos un ecosistema completo de servicios tecnológicos para llevar 
            tu proyecto desde la idea hasta el éxito digital.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon)
            
            return (
              <div
                key={service.id}
                className={`group relative glass rounded-2xl p-6 md:p-6 lg:p-6 hover:scale-105 transition-all duration-500 card-hover ${
                  hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ 
                  transitionDelay: hasIntersected ? `${index * 100}ms` : '0ms',
                  transform: 'scale(0.75)',
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed text-base">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-xs text-gray-300">
                      <div className="w-1 h-1 bg-planix-secondary rounded-full mr-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-600 transition-all duration-300"></div>
                
                {/* CTA */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="text-xs font-semibold text-planix-secondary hover:text-planix-primary transition-colors duration-300 flex items-center space-x-2">
                    <span>Más información</span>
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-300 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <p className="text-gray-400 mb-6">
            ¿No encuentras lo que buscas? Hablemos sobre tu proyecto personalizado.
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Solicitar Consultoría Gratuita
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
