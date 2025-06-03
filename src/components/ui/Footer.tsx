import React from 'react'
import { Github, Linkedin, Twitter, Mail, Code, Heart } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: 'Desarrollo Web', href: '#services' },
      { name: 'Aplicaciones Móviles', href: '#services' },
      { name: 'Experiencias 3D', href: '#services' },
      { name: 'E-commerce', href: '#services' },
    ],
    company: [
      { name: 'Sobre Nosotros', href: '#about' },
      { name: 'Portafolio', href: '#portfolio' },
      { name: 'Tecnologías', href: '#technology' },
      { name: 'Contacto', href: '#contact' },
    ],
    social: [
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Email', href: 'mailto:info@planix.tech', icon: Mail },
    ]
  }

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <footer className="relative bg-planix-gray border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-planix-primary to-planix-secondary rounded-xl flex items-center justify-center glow-blue">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-display font-bold text-gradient">
                  Planix
                </span>
              </div>
              
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Creamos experiencias digitales innovadoras que transforman ideas en 
                soluciones web de vanguardia. Especialistas en desarrollo moderno, 
                diseño 3D y tecnologías emergentes.
              </p>

              <div className="flex space-x-4">
                {footerLinks.social.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <button
                      key={social.name}
                      onClick={() => handleLinkClick(social.href)}
                      className="w-10 h-10 bg-gray-800 hover:bg-planix-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:glow-blue"
                      title={social.name}
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Servicios
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-gray-400 hover:text-planix-secondary transition-colors duration-300 block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Empresa
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-gray-400 hover:text-planix-secondary transition-colors duration-300 block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Mantente actualizado
              </h3>
              <p className="text-gray-400 mb-4 lg:mb-0">
                Recibe las últimas noticias sobre tecnología y desarrollo web
              </p>
            </div>
            <div className="lg:flex-1 lg:max-w-md lg:ml-8">
              <div className="flex">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-planix-primary to-planix-secondary text-white font-semibold rounded-r-lg hover:from-planix-secondary hover:to-planix-primary transition-all duration-300">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} Planix. Todos los derechos reservados.
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center justify-center lg:justify-end space-x-6">
              <button className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Política de Privacidad
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Términos de Servicio
              </button>
              <div className="flex items-center text-gray-400 text-sm">
                <span>Hecho con</span>
                <Heart className="w-4 h-4 mx-1 text-planix-secondary" />
                <span>en Argentina</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-planix-primary via-planix-secondary to-planix-accent"></div>
    </footer>
  )
}

export default Footer
