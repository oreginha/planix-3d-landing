import { ProjectItem } from '../types/portfolio';

export const projects: ProjectItem[] = [
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