import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered';
  userName?: string;
  userEmail?: string;
}

export const useChatStorage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    text: '¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?',
    isUser: false,
    timestamp: new Date(),
    status: 'delivered'
  }]);
  const [userInfo, setUserInfo] = useState<{name?: string, email?: string}>({});
  const [lastMessageCount, setLastMessageCount] = useState(1);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessageStatus = (messageId: string, status: ChatMessage['status']) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const sendMessageToServer = async (message: ChatMessage) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://planix-backend-node-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.text,
          userName: userInfo.name || 'Usuario Anónimo',
          userEmail: userInfo.email || '',
          isFirstMessage: false,
          sessionId: localStorage.getItem('chatSessionId') || undefined
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        updateMessageStatus(message.id, 'delivered');
        
        // Guardar sessionId si es la primera vez
        if (result.data?.sessionId) {
          localStorage.setItem('chatSessionId', result.data.sessionId);
        }
        
        // Agregar respuesta del bot si existe
        if (result.data?.botResponse) {
          const botMessage: ChatMessage = {
            id: result.data.botResponse.id || Date.now().toString(),
            text: result.data.botResponse.message,
            isUser: false,
            timestamp: new Date(result.data.botResponse.timestamp),
            status: 'delivered'
          };
          setMessages(prev => [...prev, botMessage]);
        }
        
        return true;
      } else {
        throw new Error(result.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      updateMessageStatus(message.id, 'sent'); // Marcarlo como enviado localmente
      return false;
    }
  };

  const checkForNewMessages = useCallback(async () => {
    const sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) return;

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://planix-backend-node-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/chat/session/${sessionId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.messages) {
          const serverMessages = result.data.messages;
          
          // Solo agregar mensajes nuevos
          if (serverMessages.length > lastMessageCount) {
            const newMessages = serverMessages.slice(lastMessageCount);
            
            newMessages.forEach((msg: any) => {
              if (msg.sender === 'admin') {
                const adminMessage: ChatMessage = {
                  id: msg.id,
                  text: msg.message,
                  isUser: false,
                  timestamp: new Date(msg.timestamp),
                  status: 'delivered'
                };
                setMessages(prev => {
                  // Evitar duplicados
                  if (!prev.find(m => m.id === adminMessage.id)) {
                    return [...prev, adminMessage];
                  }
                  return prev;
                });
              }
            });
            
            setLastMessageCount(serverMessages.length);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }, [lastMessageCount]);

  // Polling para nuevos mensajes cada 3 segundos
  useEffect(() => {
    const sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) return;

    const interval = setInterval(checkForNewMessages, 3000);
    return () => clearInterval(interval);
  }, [checkForNewMessages]);

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: '¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date(),
      status: 'delivered'
    }]);
    setLastMessageCount(1);
    localStorage.removeItem('chatSessionId');
  };

  return {
    messages,
    userInfo,
    setUserInfo,
    addMessage,
    updateMessageStatus,
    sendMessageToServer,
    clearChat,
    checkForNewMessages
  };
};