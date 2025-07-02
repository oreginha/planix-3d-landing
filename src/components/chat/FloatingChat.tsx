import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Settings, Trash2 } from 'lucide-react';
import { useChatStorage, ChatMessage } from '../../hooks/useChatStorage';
import { PlanixChatbot } from '../../utils/chatbot';
import { validateEmail, extractEmailFromMessage } from '../../utils/emailUtils';

interface FloatingChatProps {
  isDarkMode: boolean;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ isDarkMode }) => {
  const {
    messages,
    userInfo,
    setUserInfo,
    addMessage,
    updateMessageStatus,
    sendMessageToServer,
    clearChat
  } = useChatStorage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [tempUserInfo, setTempUserInfo] = useState({ name: '', email: '' });
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const chatbot = useRef(new PlanixChatbot()); // TODO: Implementar chatbot

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body cuando el chat está abierto
      const scrollY = window.scrollY;
      const originalTransition = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = originalTransition;
        }, 0);
      };
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);

    // Crear y agregar mensaje del usuario
    const messageId = addMessage({
      text: messageText,
      isUser: true,
      status: 'sending',
      userName: userInfo.name,
      userEmail: userInfo.email
    });

    // Crear objeto mensaje para enviar al servidor
    const userMessage: ChatMessage = {
      id: messageId,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
      userName: userInfo.name,
      userEmail: userInfo.email
    };

    // Enviar al servidor
    const sent = await sendMessageToServer(userMessage);
    
    if (!sent) {
      updateMessageStatus(messageId, 'sent');
    }

    // Lógica de respuesta según el estado
    setTimeout(() => {
      setIsTyping(false);
      
      if (isFirstMessage) {
        // Primera respuesta: validar longitud del mensaje
        setIsFirstMessage(false);
        
        if (messageText.length <= 30) {
          // Mensaje corto (30 caracteres o menos)
          addMessage({
            text: 'Perfecto, gracias por tu consulta. Para seguir con la conversación, ¿podrías compartir tu email? 📧',
            isUser: false,
            status: 'delivered'
          });
        } else {
          // Mensaje largo (más de 30 caracteres)
          addMessage({
            text: 'Perfecto, gracias por tu consulta. Para poder darte una respuesta personalizada y encontrar un asesor disponible ¿podrías compartir tu email?',
            isUser: false,
            status: 'delivered'
          });
        }
        setWaitingForEmail(true);
      } else if (waitingForEmail) {
        // Verificar si el mensaje contiene un email
        const extractedEmail = extractEmailFromMessage(messageText);
        
        if (extractedEmail && validateEmail(extractedEmail)) {
          // Email válido encontrado
          setUserInfo(prev => ({ ...prev, email: extractedEmail }));
          setWaitingForEmail(false);
          
          addMessage({
            text: `¡Excelente! Gracias ${extractedEmail}. Ahora puedo ayudarte mejor. 🚀\n\nPuedes ampliar tu consulta o esperar una respuesta de nuestro equipo especializado. Nuestros servicios: desarrollo web, apps móviles, e-commerce, diseño, o sistemas personalizados. ¿Qué te interesa más?`,
            isUser: false,
            status: 'delivered'
          });
        } else {
          // No se encontró email válido
          addMessage({
            text: 'No pude detectar un email válido en tu mensaje. ¿Podrías escribir tu email en formato correcto? Por ejemplo: tu@email.com 📧',
            isUser: false,
            status: 'delivered'
          });
        }
      } else {
        // Después de tener email: mensaje de derivación a especialista
        addMessage({
          text: '¡Excelente! Estamos buscando un asistente especializado que se unirá pronto al chat o te responderá por email.',
          isUser: false,
          status: 'delivered'
        });
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessages(false);
      // Cargar info del usuario si existe
      if (userInfo.name || userInfo.email) {
        setTempUserInfo({
          name: userInfo.name || '',
          email: userInfo.email || ''
        });
      }
    }
  };

  const handleSaveUserInfo = () => {
    setUserInfo(tempUserInfo);
    setShowSettings(false);
  };

  const handleClearChat = () => {
    setShowConfirmClear(true);
  };

  const confirmClearChat = () => {
    clearChat();
    setIsFirstMessage(true);
    setWaitingForEmail(false);
    setShowConfirmClear(false);
    setShowSettings(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-8 right-20 z-50 flex flex-col items-center">
        <button
          onClick={toggleChat}
          className={`relative p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-700 to-gray-900 hover:shadow-white/25 border-2 border-white/30' 
              : 'bg-gradient-to-r from-gray-800 to-black hover:shadow-white/25 border-2 border-white/50'
          } text-white`}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <svg 
              className="w-6 h-6" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
          
          {/* Notification Badge */}
          {hasNewMessages && !isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
        
        {/* Texto descriptivo */}
        <span className={`mt-2 text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap ${
          isDarkMode ? 'text-white bg-gray-800/80' : 'text-gray-700 bg-white/80'
        } backdrop-blur-sm shadow-sm`}>
          Escribinos
        </span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end p-6">
          {/* Backdrop for mobile */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Settings Modal */}
          {showSettings && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className={`w-80 rounded-2xl p-6 ${
                isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Configuración del Chat
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tu nombre (opcional)
                    </label>
                    <input
                      type="text"
                      value={tempUserInfo.name}
                      onChange={(e) => setTempUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tu email (opcional)
                    </label>
                    <input
                      type="email"
                      value={tempUserInfo.email}
                      onChange={(e) => setTempUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-300">
                    <button
                      onClick={handleClearChat}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <Trash2 size={16} />
                      Borrar historial del chat
                    </button>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowSettings(false)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveUserInfo}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Clear Modal */}
          {showConfirmClear && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
              <div className={`w-80 rounded-2xl p-6 ${
                isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ¿Borrar historial?
                </h3>
                
                <p className={`text-sm mb-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  ¿Estás seguro de que quieres borrar todo el historial del chat? Esta acción no se puede deshacer.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmClearChat}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Chat Container */}
          <div className={`relative w-full max-w-sm h-[500px] md:h-[600px] rounded-2xl shadow-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          } flex flex-col mr-36`}>
            
            {/* Header */}
            <div className={`p-4 border-b rounded-t-2xl ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Planix Team
                    </h3>
                    <p className={`text-xs flex items-center gap-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      En línea
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`p-1 rounded-full transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-1 rounded-full transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-200'
                          : 'bg-gray-100 text-gray-900'
                    } ${
                      message.isUser 
                        ? 'rounded-br-md' 
                        : 'rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 px-1 ${
                      message.isUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isUser && (
                        <div className="flex items-center ml-1">
                          {message.status === 'sending' && (
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          )}
                          {message.status === 'sent' && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                          {message.status === 'delivered' && (
                            <div className="flex gap-0.5">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-2xl rounded-bl-md ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Email Required Notice */}
              {waitingForEmail && (
                <div className={`mb-3 p-3 rounded-lg border-l-4 border-blue-500 ${
                  isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                }`}>
                  <p className="text-sm font-medium flex items-center gap-2">
                    📧 Esperando tu email para continuar...
                  </p>
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    waitingForEmail 
                      ? "Escribe tu email: tu@email.com" 
                      : "Escribe tu mensaje..."
                  }
                  rows={1}
                  className={`flex-1 resize-none px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  style={{ maxHeight: '100px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;