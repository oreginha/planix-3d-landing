import React from 'react';
import { Smartphone, Code, Zap, Palette, Database, Box } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  isDarkMode: boolean;
}

const ServicesSection: React.FC<ServicesProps> = ({ isDarkMode }) => {
  const services: ServiceItem[] = [
    {
      id: 'web-development',
      title: 'Desarrollo Web',
      description: 'Sitios web modernos y responsivos que destacan por su diseño, funcionalidad y optimización para motores de búsqueda',
      icon: Smartphone,
      technologies: ['React', 'Next.js', 'WordPress'],
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'web-applications',
      title: 'Aplicaciones Web',
      description: 'Plataformas web complejas y sistemas personalizados que automatizan procesos y mejoran la eficiencia empresarial',
      icon: Code,
      technologies: ['Vue.js', 'Laravel', 'Node.js'],
      gradient: 'from-green-500 to-blue-600'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Tiendas online completas con sistemas de pago, gestión de inventario y análisis de ventas integrados',
      icon: Zap,
      technologies: ['Shopify', 'WooCommerce', 'Magento'],
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'ux-ui-design',
      title: 'Diseño UX/UI',
      description: 'Interfaces intuitivas y atractivas que mejoran la experiencia del usuario y aumentan las conversiones',
      icon: Palette,
      technologies: ['Figma', 'Adobe XD', 'Sketch'],
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'backend-apis',
      title: 'Backend y APIs',
      description: 'Arquitecturas robustas y APIs escalables que soportan aplicaciones complejas y alta demanda',
      icon: Database,
      technologies: ['Node.js', 'Python', 'GraphQL'],
      gradient: 'from-teal-500 to-green-600'
    },
    {
      id: '3d-experiences',
      title: 'Experiencias 3D',
      description: 'Visualizaciones inmersivas y experiencias interactivas en 3D que capturan la atención del usuario',
      icon: Box,
      technologies: ['Three.js', 'WebGL', 'Blender'],
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <section id="servicios" className="py-[100px] md:py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
            Creamos experiencias digitales que
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              impulsan tu crecimiento
            </span>
          </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 max-w-6xl mx-auto">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="text-center group relative">
                <div className="relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>{service.title}</h3>
                <p className={`leading-relaxed mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{service.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {service.technologies.map((tech, index) => (
                    <span key={index} className={`px-3 py-1 text-sm rounded-full transition-all duration-300 cursor-pointer ${
                      isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>{tech}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;