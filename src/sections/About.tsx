import React, { useRef } from 'react'
import { Users, Target, Award, Heart, Lightbulb } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { TeamMember } from '@/types'

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(sectionRef, { 
    threshold: 0.2,
    triggerOnce: true 
  })

  const team: TeamMember[] = [
    {
      id: 'ceo',
      name: 'Alex Rodriguez',
      role: 'CEO & Full Stack Developer',
      description: 'Experto en arquitecturas web modernas y liderazgo técnico con más de 8 años de experiencia.',
      image: '/api/placeholder/300/300',
      social: {
        linkedin: 'https://linkedin.com/in/alexrodriguez',
        github: 'https://github.com/alexrodriguez',
        twitter: 'https://twitter.com/alexrodriguez'
      }
    },
    {
      id: 'cto',
      name: 'María González',
      role: 'CTO & 3D Specialist',
      description: 'Especialista en Three.js y WebGL con background en diseño 3D y animación digital.',
      image: '/api/placeholder/300/300',
      social: {
        linkedin: 'https://linkedin.com/in/mariagonzalez',
        github: 'https://github.com/mariagonzalez'
      }
    },
    {
      id: 'lead-designer',
      name: 'Carlos Martinez',
      role: 'Lead UI/UX Designer',
      description: 'Diseñador con enfoque en experiencias de usuario excepcionales y interfaces modernas.',
      image: '/api/placeholder/300/300',
      social: {
        linkedin: 'https://linkedin.com/in/carlosmartinez',
        twitter: 'https://twitter.com/carlosmartinez'
      }
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Innovación Constante',
      description: 'Siempre exploramos nuevas tecnologías y metodologías para ofrecer soluciones de vanguardia.'
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Trabajamos estrechamente con nuestros clientes como socios en cada proyecto.'
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Nos comprometemos a entregar código limpio, diseños impecables y experiencias excepcionales.'
    },
    {
      icon: Heart,
      title: 'Pasión',
      description: 'Amamos lo que hacemos y se refleja en cada línea de código y cada pixel diseñado.'
    }
  ]

  const stats = [
    { number: '100+', label: 'Proyectos Completados' },
    { number: '50+', label: 'Clientes Satisfechos' },
    { number: '5+', label: 'Años de Experiencia' },
    { number: '24/7', label: 'Soporte Disponible' }
  ]

  return (
    <section 
      id="about" 
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
            <Lightbulb className="w-4 h-4 text-planix-secondary" />
            <span className="text-sm text-gray-300 font-medium">
              Conoce a Planix
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Sobre <span className="text-gradient">Nosotros</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Somos un equipo apasionado de desarrolladores, diseñadores y estrategas 
            digitales comprometidos con transformar ideas en experiencias digitales extraordinarias.
          </p>
        </div>

        {/* Company Story */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Nuestra Historia
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Planix nació en 2019 con una visión clara: democratizar el acceso 
                  a tecnologías web avanzadas y experiencias 3D inmersivas. Comenzamos 
                  como un pequeño equipo de desarrolladores apasionados por la innovación.
                </p>
                <p>
                  Hoy, hemos crecido hasta convertirnos en una empresa reconocida 
                  por nuestra expertise en React, Three.js y desarrollo web moderno. 
                  Nuestro enfoque siempre ha sido la calidad, la innovación y la 
                  satisfacción del cliente.
                </p>
                <p>
                  Cada proyecto es una oportunidad para superar expectativas y 
                  crear soluciones que no solo funcionan, sino que inspiran y 
                  transforman la manera en que nuestros clientes interactúan con 
                  sus audiencias.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="glass rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-gradient mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Nuestros Valores
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              
              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-1000 ${
                    hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ 
                    transitionDelay: hasIntersected ? `${300 + (index * 100)}ms` : '0ms' 
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-planix-primary to-planix-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team */}
        <div className={`transition-all duration-1000 delay-400 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Nuestro Equipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id}
                className={`group glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-500 card-hover ${
                  hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ 
                  transitionDelay: hasIntersected ? `${400 + (index * 100)}ms` : '0ms' 
                }}
              >
                {/* Avatar */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-planix-primary to-planix-secondary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-planix-primary to-planix-secondary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                  {member.name}
                </h4>
                <p className="text-planix-secondary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <button 
                      onClick={() => window.open(member.social.linkedin, '_blank')}
                      className="w-8 h-8 bg-gray-700 hover:bg-planix-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-xs text-white">in</span>
                    </button>
                  )}
                  {member.social.github && (
                    <button 
                      onClick={() => window.open(member.social.github, '_blank')}
                      className="w-8 h-8 bg-gray-700 hover:bg-planix-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-xs text-white">gh</span>
                    </button>
                  )}
                  {member.social.twitter && (
                    <button 
                      onClick={() => window.open(member.social.twitter, '_blank')}
                      className="w-8 h-8 bg-gray-700 hover:bg-planix-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-xs text-white">tw</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${
          hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <p className="text-gray-400 mb-6">
            ¿Quieres conocer más sobre cómo podemos ayudarte?
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Hablemos
          </button>
        </div>
      </div>
    </section>
  )
}

export default About
