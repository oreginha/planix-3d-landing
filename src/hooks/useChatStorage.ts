import { useState } from 'react';

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
      const response = await fetch('./', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.text,
          userName: userInfo.name || 'Usuario Anónimo',
          userEmail: userInfo.email || '',
          timestamp: message.timestamp.toISOString(),
          messageId: message.id
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        updateMessageStatus(message.id, 'delivered');
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

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: '¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date(),
      status: 'delivered'
    }]);
  };

  return {
    messages,
    userInfo,
    setUserInfo,
    addMessage,
    updateMessageStatus,
    sendMessageToServer,
    clearChat
  };
};