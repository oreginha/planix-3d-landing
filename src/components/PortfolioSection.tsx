import React from 'react';

interface PortfolioSectionProps {
  isDarkMode: boolean;
  onContactClick: () => void;
  onProjectClick: (project: any) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  isDarkMode, 
  onContactClick, 
  onProjectClick 
}) => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plataforma de comercio electrónico moderna con React y Node.js",
      image: "/api/placeholder/400/300",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "web"
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Aplicación móvil de banca digital con React Native",
      image: "/api/placeholder/400/300", 
      technologies: ["React Native", "Firebase", "Redux"],
      category: "mobile"
    },
    {
      id: 3,
      title: "Data Analytics Dashboard",
      description: "Dashboard de análisis de datos en tiempo real",
      image: "/api/placeholder/400/300",
      technologies: ["Vue.js", "D3.js", "Python", "PostgreSQL"],
      category: "dashboard"
    }
  ];

  return (
    <section id="portfolio" className={`py-32 px-6 transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Nuestros 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Proyectos
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Descubre algunos de los proyectos innovadores que hemos desarrollado para nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onProjectClick(project)}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gray-800 hover:shadow-white/10' 
                  : 'bg-white hover:shadow-gray-900/10'
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-white/20 text-white' : 'bg-white/80 text-gray-900'
                  }`}>
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={onContactClick}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-white text-gray-900 hover:bg-gray-100' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Ver Más Proyectos
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
