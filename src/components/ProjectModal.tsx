import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import ProjectContactModal from './ProjectContactModal';

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
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  isDarkMode: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  project, 
  isDarkMode
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProjectContactOpen, setIsProjectContactOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Guardar posición actual del scroll
      const scrollY = window.scrollY;
      
      // Desactivar transiciones temporalmente
      const originalTransition = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Fijar el body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar el body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        
        // Restaurar scroll sin transición
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        
        // Restaurar comportamiento de scroll original
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = originalTransition;
        }, 0);
      };
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  // Placeholder images for carousel
  const projectImages = project.images || [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600', 
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleContactClick = () => {
    setIsProjectContactOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              {project.category}
            </span>
            
            <h2 className={`text-2xl md:text-3xl font-bold text-center transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
              {project.title}
            </h2>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative mx-6 mb-6">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">
            
            {/* Project Image */}
            <div className={`w-full h-full bg-cover bg-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{backgroundImage: `url(${projectImages[currentImageIndex]})`}}>
              {/* Fallback if image doesn't load */}
              {!projectImages[currentImageIndex].startsWith('./images/') && !projectImages[currentImageIndex].startsWith('/images/') && (
                <div className={`w-full h-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div className={`text-center ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <ExternalLink className="text-white" size={24} />
                    </div>
                    <p className="text-sm">Imagen {currentImageIndex + 1} del Proyecto</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {projectImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Image Indicators */}
          {projectImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {projectImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-blue-600 w-6'
                      : isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          
          {/* Description */}
          <div className="mb-6">
            <div 
              className={`text-lg leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              dangerouslySetInnerHTML={{
                __html: project.fullDescription || project.description
              }}
            />
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tecnologías utilizadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleContactClick}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Quiero algo como esto
            </button>
          </div>
        </div>
      </div>

      {/* Project Contact Modal */}
      <ProjectContactModal 
        isOpen={isProjectContactOpen}
        onClose={() => setIsProjectContactOpen(false)}
        isDarkMode={isDarkMode}
        projectReference={project ? {
          title: project.title,
          category: project.category
        } : undefined}
      />
    </div>
  );
};

export default ProjectModal;