import React, { useRef, useState } from 'react'
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { ContactForm } from '@/types'

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { hasIntersected } = useIntersectionObserver(sectionRef, { 
    threshold: 0.2,
    triggerOnce: true 
  })

  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: '',
    timeline: ''
  })

  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error'
    message: string
  }>({
    type: 'idle',
    message: ''
  })

  const budgetOptions = [
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k+', label: '$50,000+' },
    { value: 'not-sure', label: 'No estoy seguro' }
  ]

  const timelineOptions = [
    { value: '1-2-weeks', label: '1-2 semanas' },
    { value: '1-month', label: '1 mes' },
    { value: '2-3-months', label: '2-3 meses' },
    { value: '3-6-months', label: '3-6 meses' },
    { value: '6-months+', label: '6+ meses' }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@planix.tech',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+54 11 1234-5678',
      description: 'Lun - Vie 9:00 - 18:00'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      value: 'Buenos Aires, Argentina',
      description: 'También trabajamos remotamente'
    },
    {
      icon: Clock,
      title: 'Horario',
      value: 'GMT-3 (ART)',
      description: 'Adaptamos horarios para clientes'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus({ type: 'loading', message: 'Enviando mensaje...' })

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your backend
      console.log('Form data:', formData)
      
      setFormStatus({
        type: 'success',
        message: '¡Mensaje enviado exitosamente! Te contactaremos pronto.'
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        budget: '',
        timeline: ''
      })
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
      })
    }
  }

  const isFormValid = formData.name && formData.email && formData.message

  return (
    <section 
      id="contact" 
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
            <Send className="w-4 h-4 text-planix-secondary" />
            <span className="text-sm text-gray-300 font-medium">
              Contacto
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Hablemos de tu <span className="text-gradient">Proyecto</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            ¿Tienes una idea brillante? Estamos aquí para ayudarte a convertirla 
            en una realidad digital extraordinaria. Conversemos sobre tu visión.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-200 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Cuéntanos sobre tu proyecto
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                {/* Budget and Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                      Presupuesto estimado
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300"
                    >
                      <option value="">Seleccionar presupuesto</option>
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                      Tiempo estimado
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300"
                    >
                      <option value="">Seleccionar timeline</option>
                      {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-planix-primary focus:ring-1 focus:ring-planix-primary transition-colors duration-300 resize-none"
                    placeholder="Cuéntanos sobre tu proyecto, objetivos y cualquier detalle importante..."
                  />
                </div>

                {/* Status Message */}
                {formStatus.type !== 'idle' && (
                  <div className={`flex items-center space-x-2 p-4 rounded-lg ${
                    formStatus.type === 'success' 
                      ? 'bg-green-900 bg-opacity-50 border border-green-600' 
                      : formStatus.type === 'error'
                      ? 'bg-red-900 bg-opacity-50 border border-red-600'
                      : 'bg-blue-900 bg-opacity-50 border border-blue-600'
                  }`}>
                    {formStatus.type === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {formStatus.type === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    {formStatus.type === 'loading' && (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className={`text-sm ${
                      formStatus.type === 'success' 
                        ? 'text-green-300' 
                        : formStatus.type === 'error'
                        ? 'text-red-300'
                        : 'text-blue-300'
                    }`}>
                      {formStatus.message}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || formStatus.type === 'loading'}
                  className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                    !isFormValid || formStatus.type === 'loading' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  {formStatus.type === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>
                    {formStatus.type === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Información de contacto
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-planix-primary to-planix-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {info.title}
                        </h4>
                        <p className="text-planix-secondary font-medium mb-1">
                          {info.value}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="glass rounded-2xl p-8">
              <h4 className="text-xl font-bold text-white mb-4">
                Contacto directo
              </h4>
              
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('mailto:info@planix.tech', '_blank')}
                  className="w-full btn-secondary text-left flex items-center space-x-3"
                >
                  <Mail className="w-5 h-5" />
                  <span>Enviar Email</span>
                </button>
                
                <button 
                  onClick={() => window.open('tel:+5411123456789', '_blank')}
                  className="w-full btn-secondary text-left flex items-center space-x-3"
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar Ahora</span>
                </button>
              </div>
            </div>

            {/* Response Time */}
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-planix-success to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Respuesta garantizada
              </h4>
              <p className="text-gray-400 text-sm">
                Te contactaremos dentro de las próximas 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
