import React, { useState, useEffect } from 'react';
import { X, Send, User, Mail, MessageSquare, Tag } from 'lucide-react';

interface ProjectContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  projectReference?: {
    title: string;
    category: string;
  };
}

const ProjectContactModal: React.FC<ProjectContactModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode,
  projectReference 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        projectReference: projectReference
      };

      const response = await fetch('./contact-debug.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Auto close after 10 seconds
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          setFormData({ name: '', email: '', message: '' });
        }, 10000);
      } else {
        throw new Error(result.error || 'Error del servidor');
      }
    } catch (error) {
      console.error('Error en formulario:', error);
      setIsSubmitting(false);
      
      // Abrir cliente de email como fallback
      const subject = encodeURIComponent('Consulta sobre proyecto similar');
      const body = encodeURIComponent(
        `Hola,\n\nMe interesa un proyecto similar a: ${projectReference?.title || 'uno de sus trabajos'}\n\n${formData.message}\n\nSaludos,\n${formData.name}\n${formData.email}`
      );
      
      // eslint-disable-next-line no-restricted-globals
      if (confirm('No pudimos enviar el formulario. ¿Quieres abrir tu cliente de email para enviarnos el mensaje?')) {
        window.open(`mailto:hola@planix.com.ar?subject=${subject}&body=${body}`, '_blank');
      }
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={`relative w-full max-w-md rounded-2xl p-8 text-center transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Send className="text-white" size={24} />
          </div>
          <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
            ¡Mensaje enviado!
          </h3>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nos pondremos en contacto contigo pronto para discutir tu proyecto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
          }`}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
            Solicitar proyecto similar
          </h2>
          <p className={`text-sm mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Cuéntanos sobre tu proyecto inspirado en nuestro trabajo
          </p>

          {/* Project Reference Badge */}
          {projectReference && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Proyecto de referencia:
                </span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600/10 border-blue-600/30 text-blue-400' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <span className="font-semibold">{projectReference.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  {projectReference.category}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Name Field */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <User size={16} />
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Mail size={16} />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="tu@email.com"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <MessageSquare size={16} />
              Describe tu proyecto
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder={projectReference 
                ? `Me interesa un proyecto similar a "${projectReference.title}". Necesito...`
                : "Cuéntanos qué tienes en mente para tu proyecto..."
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70 ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={20} />
                Enviar solicitud
              </span>
            )}
          </button>

          {/* Help Text */}
          <p className={`text-xs text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Nos pondremos en contacto contigo en un plazo de 24 horas
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProjectContactModal;