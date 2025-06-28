import React, { useState } from 'react';
import { ExternalLink, Github, Check } from 'lucide-react';

interface PortfolioProps {
  isDarkMode: boolean;
  onContactClick: () => void;
  onProjectClick: (project: ProjectItem) => void;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
  github?: string;
  images?: string[];
  fullDescription?: string;
  status: {
    type: 'completed' | 'progress';
    value?: number;
  };
}

const PortfolioSection: React.FC<PortfolioProps> = ({ isDarkMode, onContactClick, onProjectClick }) => {

  const projects: ProjectItem[] = [
    {
      id: 'project-1',
      title: 'Ona Saez',
      description: 'Plataforma de comercio electrónico con sistema de pagos integrado y panel de administración completo.',
      image: './images/onasaez-thumb.jpg',
      category: 'E-commerce',
      technologies: ['HTML/CSS', 'JavaScript', 'PrestaShop'],
      link: '#',
      github: '#',
      fullDescription: 'Plataforma de comercio electrónico con sistema de pagos integrado y panel de administración completo.',
      images: ['./images/onasaez-1.jpg', './images/onasaez-2.jpg', './images/onasaez-3.jpg'],
      status: { type: 'completed' }
    },
    {
      id: 'project-2',
      title: 'Wellness app',
      description: 'Sistema de gestión empresarial con analytics en tiempo real y reportes automatizados.',
      image: './images/wellness-thumb.jpg',
      category: 'Aplicaciones',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Chart.js'],
      link: '#',
      github: '#',
      fullDescription: 'Sistema integral de gestión empresarial con dashboard interactivo y reportes automatizados. Incluye módulos de CRM, gestión de proyectos, control de inventario y analytics en tiempo real. La aplicación cuenta con un sistema de roles y permisos avanzado, notificaciones push y sincronización en la nube.',
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      status: { type: 'progress', value: 75 }
    },
    {
      id: 'project-3',
      title: 'Ferresys',
      description: 'Sistema web integral para ferreterías con inventario, proveedores, facturación y reportes.',
      image: './images/ferresys-thumb.jpg',
      category: 'Sistemas web',
      technologies: ['Blazor', '.NET 9', 'Entity Framework'],
      link: '#',
      github: '#',
      fullDescription: 'Sistema completo de gestión para ferreterías con control de inventario, administración de proveedores, sistema de presupuestos y facturación, reportes avanzados y dashboard interactivo. Incluye diferentes niveles de usuario y herramientas de búsqueda para optimizar las operaciones diarias.',
      images: ['./images/ferresys-1.jpg', './images/ferresys-2.jpg', './images/ferresys-3.jpg'],
      status: { type: 'completed' }
    },
    {
      id: 'project-4',
      title: '¿Quién para? app',
      description: 'Aplicación multiplataforma orientada a mobile para encontrar gente para tus planes!',
      image: './images/quien-para-thumb.jpg',
      category: 'Aplicaciones',
      technologies: ['React', 'Firebase', 'Stripe', 'PWA'],
      link: '#',
      fullDescription: 'Aplicación web progresiva para reservas online de restaurantes con gestión completa de mesas y notificaciones en tiempo real. Incluye sistema de pagos, gestión de menús, programa de fidelidad y analytics avanzados. Compatible con dispositivos móviles y funciona offline.',
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      status: { type: 'progress', value: 45 }
    },
    {
      id: 'project-5',
      title: 'SUBE canal',
      description: 'Aplicación web para manejo de contenido y suscriptores. Animación mosca del logo.',
      image: './images/sube2.gif',
      category: 'Sistemas web',
      technologies: ['React', '.NET', 'API REST', 'After Effects'],
      link: '#',
      fullDescription: 'Aplicación web para manejo de contenido y suscriptores con animación mosca del logo. <a href="https://sube-web.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline">Visitar el avance del proyecto</a>',
      images: ['./images/sube-1.jpg', './images/sube-2.jpg'],
      status: { type: 'progress', value: 90 }
    },
    {
      id: 'project-6',
      title: 'Microsoftware Corporativo',
      description: 'Aplicaciones livianas y específicas para resolver tareas particulares de tu empresa.',
      image: './images/software-thumb.jpg',
      category: 'Procesos',
      technologies: ['React', 'Express', 'PostgreSQL', 'Redis'],
      link: '#',
      github: '#',
      fullDescription: 'Plataforma completa de marketplace con sistema de vendedores múltiples, gestión automática de comisiones y panel de control avanzado. Incluye sistema de pagos seguro, gestión de disputas, programa de afiliados y analytics detallados para vendedores y administradores.',
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      status: { type: 'completed' }
    }
  ];

  const categories = ['Todos', 'Sistemas web', 'Aplicaciones', 'E-commerce', 'Procesos'];
  const [activeCategory, setActiveCategory] = React.useState('Todos');

  const filteredProjects = activeCategory === 'Todos' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const openProjectModal = (project: ProjectItem) => {
    onProjectClick(project);
  };

  return (
    <section id="portfolio" className="py-[100px] md:py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
            Nuestro
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-12 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Explora algunos de nuestros proyectos más destacados. Cada trabajo refleja nuestro 
            compromiso con la excelencia, la innovación y los resultados excepcionales.
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-black shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project) => (
            <div key={project.id} className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 ${
              isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'
            } shadow-lg hover:shadow-2xl cursor-pointer`}
            onClick={() => openProjectModal(project)}>
              
              {/* Project Image */}
              <div className={`h-48 relative overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {project.image.startsWith('./images/') || project.image.startsWith('/images/') ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = target.parentElement?.querySelector('.fallback-placeholder');
                      if (fallback) {
                        target.style.display = 'none';
                        fallback.classList.remove('hidden');
                        fallback.classList.add('flex');
                      }
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{backgroundImage: `url(${project.image})`}}
                  />
                )}
                
                {/* Fallback if image doesn't load */}
                <div className={`fallback-placeholder absolute inset-0 items-center justify-center ${
                  project.image.startsWith('./images/') || project.image.startsWith('/images/') ? 'hidden' : 'flex'
                } ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <ExternalLink className="text-white" size={24} />
                    </div>
                    <p className="text-sm">Imagen del Proyecto</p>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectModal(project);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </button>
                    {project.github && (
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Github size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.category}
                    </span>
                    {project.status.type === 'completed' ? (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                        isDarkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                      }`}>
                        <Check size={12} />
                        Completado
                      </span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isDarkMode ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {project.status.value}%
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                  {project.title}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded transition-all duration-300 ${
                      isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technologies Used */}
        <div className="text-center">
          <h3 className={`text-2xl font-bold mb-8 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
            Tecnologías implementadas
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 text-center max-w-6xl mx-auto">
            {/* React */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="url(#reactGrad)" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)"/>
                  <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="url(#reactGrad)" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)"/>
                  <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="url(#reactGrad)" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="url(#reactGrad)"/>
                  <defs>
                    <linearGradient id="reactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                React
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Frontend
              </div>
            </div>

            {/* Node.js */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="url(#nodeGrad)" strokeWidth="2" fill="none"></path>
                  <path d="M3 7l9 5 9-5M12 22V12" stroke="url(#nodeGrad)" strokeWidth="2"></path>
                  <defs>
                    <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                Node.js
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Backend
              </div>
            </div>

            {/* Python */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 100 100" fill="none">
                  <g transform="translate(-25, 0) scale(0.15, 0.15)">
                    <path d="M484,16.7c-24.1,0.1-47.2,2.2-67.5,5.8c-59.7,10.6-70.6,32.6-70.6,73.4v53.8h141.2v17.9H293
                      c-41,0-77,24.7-88.2,71.6c-13,53.8-13.5,87.3,0,143.5c10,41.8,34,71.6,75,71.6h48.5v-64.5c0-46.6,40.3-87.7,88.2-87.7h141
                      c39.3,0,70.6-32.3,70.6-71.7V95.9c0-38.3-32.3-67-70.6-73.4C533.3,18.4,508.1,16.6,484,16.7L484,16.7z M407.6,60
                      c14.6,0,26.5,12.1,26.5,27c0,14.8-11.9,26.8-26.5,26.8c-14.6,0-26.5-12-26.5-26.8C381.2,72.1,393,60,407.6,60L407.6,60z" fill="url(#pythonGrad1)"/>
                    <path d="M645.7,167.6v62.7c0,48.6-41.2,89.5-88.2,89.5h-141c-38.6,0-70.6,33.1-70.6,71.7V526
                      c0,38.3,33.3,60.8,70.6,71.7c44.7,13.1,87.5,15.5,141,0c35.5-10.3,70.6-31,70.6-71.7v-53.8h-141v-17.9h211.6
                      c41,0,56.3-28.6,70.6-71.6c14.7-44.2,14.1-86.8,0-143.5c-10.1-40.8-29.5-71.6-70.6-71.6H645.7z M566.4,508c14.6,0,26.5,12,26.5,26.8
                      c0,14.9-11.9,27-26.5,27c-14.6,0-26.5-12.1-26.5-27C539.9,520,551.8,508,566.4,508z" fill="url(#pythonGrad2)"/>
                  </g>
                  <defs>
                    <linearGradient id="pythonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                    <linearGradient id="pythonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                Python
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Backend
              </div>
            </div>

            {/* Flutter */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 1999 2474.2" fill="none">
                  <path d="M381,1618L0,1237L1237.1,0H1999 M1999,1141.5h-761.9l-285.4,285.4l381,381" fill="url(#flutterGrad)" opacity="0.8"/>
                  <path d="M951.7,2188.8l285.4,285.4H1999l-666.3-666.3" fill="url(#flutterGradDark)"/>
                  <path d="M571.6,1808.1L952,1427.6l380.4,380.4L952,2188.5L571.6,1808.1z" fill="url(#flutterGrad)"/>
                  <path d="M952,2188.5l380.4-380.4l53.1,53.1l-380.4,380.4L952,2188.5z" fill="url(#flutterShadow)" opacity="0.3"/>
                  <path d="M951.7,2188.8l565.3-195.3l-184.3-185.7" fill="url(#flutterShadow)" opacity="0.5"/>
                  <defs>
                    <linearGradient id="flutterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                    <linearGradient id="flutterGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af"></stop>
                      <stop offset="100%" stopColor="#6d28d9"></stop>
                    </linearGradient>
                    <linearGradient id="flutterShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.4"></stop>
                      <stop offset="100%" stopColor="#616161" stopOpacity="0.1"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                Flutter
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Mobile
              </div>
            </div>

            {/* Figma */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 1667 2500" fill="none">
                  <path d="M416.8,2500c230,0,416.7-186.7,416.7-416.7v-416.7H416.8c-230,0-416.7,186.7-416.7,416.7C0.2,2313.3,186.8,2500,416.8,2500z" fill="url(#figmaGrad)"/>
                  <path d="M0.2,1250c0-230,186.7-416.7,416.7-416.7h416.7v833.3H416.8C186.8,1666.7,0.2,1480,0.2,1250z" fill="url(#figmaGradDark)"/>
                  <path d="M0.2,416.7C0.2,186.7,186.8,0,416.8,0h416.7v833.3H416.8C186.8,833.3,0.2,646.7,0.2,416.7z" fill="url(#figmaGradLight)"/>
                  <path d="M833.5,0h416.7c230,0,416.7,186.7,416.7,416.7s-186.7,416.7-416.7,416.7H833.5V0z" fill="url(#figmaGradMid)"/>
                  <path d="M1666.8,1250c0,230-186.7,416.7-416.7,416.7S833.5,1480,833.5,1250s186.7-416.7,416.7-416.7S1666.8,1020,1666.8,1250z" fill="url(#figmaGradAccent)"/>
                  <defs>
                    <linearGradient id="figmaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                    <linearGradient id="figmaGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af"></stop>
                      <stop offset="100%" stopColor="#6d28d9"></stop>
                    </linearGradient>
                    <linearGradient id="figmaGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa"></stop>
                      <stop offset="100%" stopColor="#a78bfa"></stop>
                    </linearGradient>
                    <linearGradient id="figmaGradMid" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb"></stop>
                      <stop offset="100%" stopColor="#7c3aed"></stop>
                    </linearGradient>
                    <linearGradient id="figmaGradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                Figma
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Design
              </div>
            </div>

            {/* Adobe */}
            <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 1800 2000" fill="none">
                  <path d="M0.2,0h685.7L0.2,1670V0z" fill="url(#adobeGrad1)" fillRule="evenodd" clipRule="evenodd"/>
                  <path d="M1153.1,0h694.3v1648.5L1153.1,0z" fill="url(#adobeGrad2)" fillRule="evenodd" clipRule="evenodd"/>
                  <path d="M927.4,638.6L1305.9,1640h-234.3l-161.4-317.1H653.1L927.4,638.6z" fill="url(#adobeGrad3)" fillRule="evenodd" clipRule="evenodd"/>
                  <defs>
                    <linearGradient id="adobeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#6366f1"></stop>
                    </linearGradient>
                    <linearGradient id="adobeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                    <linearGradient id="adobeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"></stop>
                      <stop offset="100%" stopColor="#8b5cf6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                Adobe
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Arte
              </div>
            </div>
          </div>
          
          <p className={`text-sm mt-8 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Tecnologías modernas para soluciones escalables y eficientes
          </p>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSection;