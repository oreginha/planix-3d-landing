import React, { useRef } from 'react'
import { Code2, Database, Palette, Smartphone, Globe, Zap, Star, TrendingUp } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { TechnologyItem } from '@/types'

const Technology: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(sectionRef, { 
    threshold: 0.2,
    triggerOnce: true 
  })

  const technologies: TechnologyItem[] = [
    // Frontend
    {
      id: 'react',
      name: 'React',
      category: 'frontend',
      icon: 'Code2',
      description: 'Biblioteca para interfaces de usuario modernas y reactivas',
      proficiency: 95
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      category: 'frontend',
      icon: 'Globe',
      description: 'Framework de React para aplicaciones web de producción',
      proficiency: 90
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'frontend',
      icon: 'Code2',
      description: 'JavaScript tipado para desarrollo más robusto',
      proficiency: 88
    },
    {
      id: 'threejs',
      name: 'Three.js',
      category: '3d',
      icon: 'Zap',
      description: 'Biblioteca 3D para WebGL y experiencias inmersivas',
      proficiency: 85
    },
    
    // Backend
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      icon: 'Database',
      description: 'Runtime de JavaScript para el servidor',
      proficiency: 92
    },
    {
      id: 'python',
      name: 'Python',
      category: 'backend',
      icon: 'Database',
      description: 'Lenguaje versátil para backend y data science',
      proficiency: 87
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      category: 'backend',
      icon: 'Database',
      description: 'Query language para APIs eficientes',
      proficiency: 83
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      category: 'backend',
      icon: 'Database',
      description: 'Base de datos relacional avanzada',
      proficiency: 89
    },

    // Tools
    {
      id: 'figma',
      name: 'Figma',
      category: 'tools',
      icon: 'Palette',
      description: 'Herramienta de diseño colaborativo',
      proficiency: 91
    },
    {
      id: 'blender',
      name: 'Blender',
      category: '3d',
      icon: 'Zap',
      description: 'Software de modelado y animación 3D',
      proficiency: 78
    },
    {
      id: 'react-native',
      name: 'React Native',
      category: 'frontend',
      icon: 'Smartphone',
      description: 'Framework para aplicaciones móviles nativas',
      proficiency: 86
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'tools',
      icon: 'Database',
      description: 'Containerización para deployment consistente',
      proficiency: 84
    }
  ]

  const getIcon = (iconName: string) => {
    const iconMap = {
      Code2,
      Database,
      Palette,
      Smartphone,
      Globe,
      Zap
    }
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Code2
    return IconComponent
  }

  const getCategoryColor = (category: TechnologyItem['category']) => {
    const colors = {
      frontend: 'from-blue-500 to-cyan-500',
      backend: 'from-green-500 to-emerald-500',
      '3d': 'from-purple-500 to-pink-500',
      tools: 'from-orange-500 to-red-500'
    }
    return colors[category]
  }

  const getCategoryName = (category: TechnologyItem['category']) => {
    const names = {
      frontend: 'Frontend',
      backend: 'Backend',
      '3d': '3D & WebGL',
      tools: 'Herramientas'
    }
    return names[category]
  }

  const getCategoryIcon = (category: TechnologyItem['category']) => {
    const icons = {
      frontend: Code2,
      backend: Database,
      '3d': Zap,
      tools: Palette
    }
    return icons[category]
  }

  const categories = ['frontend', 'backend', '3d', 'tools'] as const

  return (
    <section 
      id="technology" 
      ref={sectionRef}
      className="relative py-24 bg-planix-gray"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-planix-gray via-planix-dark to-planix-gray opacity-95"></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-planix-secondary" />
            <span className="text-sm text-gray-300 font-medium">
              Stack Tecnológico
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Tecnologías <span className="text-gradient">Avanzadas</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Utilizamos las herramientas más modernas y eficientes para crear 
            soluciones que escalan y perduran en el tiempo.
          </p>
        </div>

        {/* Technology Categories */}
        {categories.map((category, categoryIndex) => {
          const categoryTechs = technologies.filter(tech => tech.category === category)
          const CategoryIcon = getCategoryIcon(category)
          
          return (
            <div
              key={category}
              className={`mb-16 transition-all duration-1000 ${
                hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: hasIntersected ? `${categoryIndex * 200}ms` : '0ms' 
              }}
            >
              {/* Category Header */}
              <div className="flex items-center mb-8">
                <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(category)} rounded-xl flex items-center justify-center mr-4`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {getCategoryName(category)}
                </h3>
              </div>

              {/* Technology Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryTechs.map((tech, techIndex) => {
                  const IconComponent = getIcon(tech.icon)
                  
                  return (
                    <div
                      key={tech.id}
                      className={`group glass rounded-xl p-6 hover:scale-105 transition-all duration-300 card-hover ${
                        hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                      }`}
                      style={{ 
                        transitionDelay: hasIntersected ? `${(categoryIndex * 200) + (techIndex * 50)}ms` : '0ms' 
                      }}
                    >
                      {/* Icon and Name */}
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(category)} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-gradient transition-all duration-300">
                          {tech.name}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                        {tech.description}
                      </p>

                      {/* Proficiency Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400">Experiencia</span>
                          <span className="text-xs text-planix-secondary font-semibold">
                            {tech.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getCategoryColor(category)} rounded-full transition-all duration-1000 ease-out`}
                            style={{ 
                              width: hasIntersected ? `${tech.proficiency}%` : '0%',
                              transitionDelay: hasIntersected ? `${(categoryIndex * 200) + (techIndex * 50) + 300}ms` : '0ms'
                            }}
                          />
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3 h-3 mr-1 transition-all duration-300 ${
                              starIndex < Math.floor(tech.proficiency / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                            style={{
                              transitionDelay: hasIntersected ? `${(categoryIndex * 200) + (techIndex * 50) + (starIndex * 50) + 500}ms` : '0ms'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Bottom Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 transition-all duration-1000 delay-500 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">12+</div>
            <div className="text-sm text-gray-400">Tecnologías Dominadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">5+</div>
            <div className="text-sm text-gray-400">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">100+</div>
            <div className="text-sm text-gray-400">Proyectos Completados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
            <div className="text-sm text-gray-400">Soporte Continuo</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Technology
