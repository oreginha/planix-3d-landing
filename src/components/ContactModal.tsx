import React, { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      
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
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      let response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        
        console.log('');
        response = await fetch('http://localhost:3001/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        try {
          result = await response.json();
        } catch (debugParseError) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }

      console.log('Respuesta del servidor:', { status: response.status, result });

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message || '¡Mensaje enviado correctamente! Te contactaremos pronto.' 
        });
        setFormData({ nombre: '', email: '', empresa: '', mensaje: '' });
        setTimeout(() => {
          onClose();
          setMessage({ type: '', text: '' });
        }, 10000);
      } else {
        // Error del servidor o validación
        throw new Error(result.error || `Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en formulario:', error);
      console.error('Status y respuesta:', error);
      setMessage({ 
        type: 'error', 
        text: 'No pudimos enviar el formulario. Por favor envía un email a hola@planix.com.ar y nos contactaremos lo más rápido posible!' 
      });
      
      // NO abrir cliente de email automáticamente - solo mostrar mensaje
      // setTimeout(() => {
      //   const subject = encodeURIComponent('Consulta desde la web');
      //   const body = encodeURIComponent(
      //     `Hola,\n\nMe gustaría hacer una consulta:\n\n${formData.mensaje}\n\nSaludos,\n${formData.nombre}\n${formData.email}`
      //   );
      //   window.open(`mailto:hola@planix.com.ar?subject=${subject}&body=${body}`, '_blank');
      // }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-md transition-all duration-500 ${
          isDarkMode ? 'bg-gray-900/80' : 'bg-black/50'
        } ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Geometric Animation Container */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6">
        
        {/* Close Button - Fixed position for mobile */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 z-10 md:hidden">
          <button
            onClick={onClose}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Animated Geometric Shape */}
        <div className={`relative transition-all duration-700 ease-out transform mt-[140px] md:mt-0 ${
          isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}>
          
          {/* Hexagon Shape */}
          <div className={`w-[90vw] max-w-[380px] h-[80vh] max-h-[450px] md:w-96 md:h-96 relative transition-all duration-700 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`} style={{
            clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
            transform: `rotate(${isOpen ? '0deg' : '60deg'})`,
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div className={`w-full h-full ${
              isDarkMode ? 'bg-gray-800/95' : 'bg-white/98'
            } backdrop-blur-xl border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300 shadow-xl'
            }`} />
          </div>

          {/* Modal Content */}
          <div className={`absolute inset-3 md:inset-6 flex flex-col justify-center items-center text-center transition-all duration-500 delay-200 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Close Button - Desktop only */}
            <div className="hidden md:flex justify-center mb-1 md:mb-2">
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Title */}
            <div className="flex justify-center mb-2 md:mb-4 mt-1 md:mt-2.5">
              <h3 className={`text-xl md:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
                ¡Hablemos!
              </h3>
            </div>

            <p className={`text-xs md:text-sm mb-4 md:mb-6 max-w-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Cuéntanos sobre tu proyecto y te contactaremos pronto
            </p>

            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-3 md:mb-4 p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium max-w-[95%] text-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-[95%] md:max-w-xs space-y-4 md:space-y-4">
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-4 text-base md:text-sm md:px-3 md:py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-400 text-gray-900 placeholder-gray-600'
                }`}
              />
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-4 text-base md:text-sm md:px-3 md:py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-400 text-gray-900 placeholder-gray-600'
                }`}
              />
              <input
                type="text"
                name="empresa"
                placeholder="Tu empresa (opcional)"
                value={formData.empresa}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 text-base md:text-sm md:px-3 md:py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-400 text-gray-900 placeholder-gray-600'
                }`}
              />
              <textarea
                name="mensaje"
                placeholder="Cuéntanos sobre tu proyecto..."
                rows={3}
                value={formData.mensaje}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-4 text-base md:text-sm md:px-3 md:py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-400 text-gray-900 placeholder-gray-600'
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-base md:py-2 md:text-sm rounded-lg font-semibold transition-all duration-300 transform ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-lg'
                } text-white`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>

            {/* Quick Contact */}
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-300/20">
              <p className={`text-xs mb-1 md:mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                O escríbenos directamente:
              </p>
              <a 
                href="mailto:hola@planix.com.ar"
                className="text-blue-500 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors duration-300"
              >
                hola@planix.com.ar
              </a>
            </div>

          </div>
        </div>

        {/* Floating Particles */}
        {isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full transition-all duration-1000 ${
                  isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/40'
                }`}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `modalParticle ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random()}s`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;