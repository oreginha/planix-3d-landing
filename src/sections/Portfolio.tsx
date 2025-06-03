import React, { useRef, useState } from 'react'
import { ExternalLink, Github, Eye, Filter, X } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { ProjectItem } from '@/types'

const Portfolio: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(sectionRef, { 
    threshold: 0.2,
    triggerOnce: true 
  })

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const projects: ProjectItem[] = [
    {
      id: 'ecommerce-3d',
      title: 'TechStore 3D',
      description: 'Tienda online con visualizador 3D de productos electrónicos. Los usuarios pueden rotar, hacer zoom y ver productos en detalle antes de comprar.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Three.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      liveUrl: 'https://techstore3d.demo.com',
      githubUrl: 'https://github.com/planix/techstore-3d',
      category: 'ecommerce'
    },
    {
      id: 'fitness-app',
      title: 'FitTracker Pro',
      description: 'Aplicación móvil para seguimiento de ejercicios con realidad aumentada para verificar la forma correcta de los ejercicios.',
      image: '/api/placeholder/600/400',
      technologies: ['React Native', 'TypeScript', 'AR Kit', 'Firebase'],
      liveUrl: 'https://fittracker.demo.com',
      category: 'app'
    },
    {
      id: 'architecture-viz',
      title: 'ArchiViz Studio',
      description: 'Plataforma web para visualización arquitectónica en 3D con recorridos virtuales y configuración en tiempo real.',
      image: '/api/placeholder/600/400',
      technologies: ['Three.js', 'WebGL', 'Blender', 'React', 'Express'],
      liveUrl: 'https://archiviz.demo.com',
      githubUrl: 'https://github.com/planix/archiviz-studio',
      category: '3d'
    },
    {
      id: 'learning-platform',
      title: 'EduPlatform',
      description: 'Plataforma de aprendizaje online con sistema de videoconferencias, evaluaciones automáticas y seguimiento de progreso.',
      image: '/api/placeholder/600/400',
      technologies: ['Next.js', 'WebRTC', 'MongoDB', 'Socket.io', 'AWS'],
      liveUrl: 'https://eduplatform.demo.com',
      category: 'web'
    },
    {
      id: 'restaurant-pos',
      title: 'RestaurantPOS',
      description: 'Sistema POS completo para restaurantes con gestión de mesas, comandas, inventario y analytics en tiempo real.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      liveUrl: 'https://restaurantpos.demo.com',
      githubUrl: 'https://github.com/planix/restaurant-pos',
      category: 'web'
    },
    {
      id: 'crypto-dashboard',
      title: 'CryptoTracker',
      description: 'Dashboard avanzado para trading de criptomonedas con gráficos en tiempo real, alertas y portfolio management.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'D3.js', 'WebSocket', 'Python', 'Django'],
      liveUrl: 'https://cryptotracker.demo.com',
      category: 'web'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todos', count: projects.length },
    { id: 'web', name: 'Web Apps', count: projects.filter(p => p.category === 'web').length },
    { id: 'app', name: 'Mobile Apps', count: projects.filter(p => p.category === 'app').length },
    { id: '3d', name: 'Experiencias 3D', count: projects.filter(p => p.category === '3d').length },
    { id: 'ecommerce', name: 'E-commerce', count: projects.filter(p => p.category === 'ecommerce').length },
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const openProjectModal = (project: ProjectItem) => {
    setSelectedProject(project)
    document.body.style.overflow = 'hidden'
  }

  const closeProjectModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <section 
      id="portfolio" 
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
            <Eye className="w-4 h-4 text-planix-secondary" />
            <span className="text-sm text-gray-300 font-medium">
              Nuestro Trabajo
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Proyectos <span className="text-gradient">Destacados</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Una selección de nuestros trabajos más recientes que demuestran 
            nuestra capacidad para crear soluciones innovadoras y efectivas.
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-planix-primary to-planix-secondary text-white'
                  : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-opacity-70 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{category.name}</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 card-hover cursor-pointer ${
                hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: hasIntersected ? `${index * 100}ms` : '0ms' 
              }}
              onClick={() => openProjectModal(project)}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-planix-primary to-planix-secondary overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-20">
                    {project.title.charAt(0)}
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <div className="flex space-x-4">
                      <button className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300">
                        <Eye className="w-6 h-6 text-white" />
                      </button>
                      {project.liveUrl && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.liveUrl, '_blank')
                          }}
                          className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                        >
                          <ExternalLink className="w-6 h-6 text-white" />
                        </button>
                      )}
                      {project.githubUrl && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.githubUrl, '_blank')
                          }}
                          className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300"
                        >
                          <Github className="w-6 h-6 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs bg-planix-primary text-white px-2 py-1 rounded-full">
                      +{project.technologies.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="relative glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Modal Content */}
              <div className="p-8">
                {/* Project Image */}
                <div className="relative h-64 bg-gradient-to-br from-planix-primary to-planix-secondary rounded-xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-8xl font-bold opacity-20">
                      {selectedProject.title.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <h3 className="text-3xl font-bold text-white mb-4">
                  {selectedProject.title}
                </h3>
                
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Tecnologías Utilizadas
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {selectedProject.liveUrl && (
                    <button 
                      onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Ver Demo</span>
                    </button>
                  )}
                  {selectedProject.githubUrl && (
                    <button 
                      onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Github className="w-5 h-5" />
                      <span>Ver Código</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-300 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <p className="text-gray-400 mb-6">
            ¿Tienes un proyecto en mente? Trabajemos juntos para hacerlo realidad.
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Iniciar Proyecto
          </button>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
