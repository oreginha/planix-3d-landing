import { ChatSession, ChatMessage } from '../types/chat';
import telegramService from './telegram';

interface AutoResponse {
  id: string;
  trigger: string;
  message: string;
  delay: number;
  shouldTransferToAdmin?: boolean;
}

class ChatService {
  processClientMessage(id: string, message: any) {
      throw new Error('Method not implemented.');
  }
  processAdminMessage(sessionId: any, message: any, adminTelegramId: any, adminName: any) {
      throw new Error('Method not implemented.');
  }
  getActiveSessions() {
      throw new Error('Method not implemented.');
  }
  private sessions: Map<string, ChatSession> = new Map();
  private autoResponses: AutoResponse[];

  constructor() {
    // Respuestas automáticas predefinidas del bot
    this.autoResponses = [
      {
        id: 'greeting',
        trigger: 'greeting',
        message: '¡Hola! 👋 Soy el asistente virtual de Planix. ¿En qué puedo ayudarte hoy?',
        delay: 1000
      },
      {
        id: 'services',
        trigger: 'services',
        message: 'Ofrecemos desarrollo web, aplicaciones móviles, consultoría tecnológica y más. ¿Te interesa algún servicio en particular?',
        delay: 1500
      },
      {
        id: 'pricing',
        trigger: 'pricing',
        message: 'Los precios varían según el proyecto. Te conectaré con un especialista para una cotización personalizada.',
        delay: 1200
      },
      {
        id: 'contact',
        trigger: 'contact',
        message: 'Perfecto, un miembro de nuestro equipo se comunicará contigo pronto. ¿Hay algo específico que quieras que sepamos?',
        delay: 1000
      },
      {
        id: 'default',
        trigger: 'default',
        message: 'Gracias por tu mensaje. Un especialista revisará tu consulta y te responderá personalmente muy pronto.',
        delay: 1500
      }
    ];

    console.log('💬 [CHAT] Servicio inicializado con', this.autoResponses.length, 'respuestas automáticas');
  }

  generateSessionId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createSession(userIp: string, userAgent?: string, clientId?: string): Promise<ChatSession> {
    const sessionId = this.generateSessionId();
    
    const session: ChatSession = {
      id: sessionId,
      clientId: clientId || `client_${Date.now()}`,
      clientInfo: {
        userAgent: userAgent || 'Unknown',
        ip: userIp
      },
      startTime: new Date(),
      status: 'active',
      messages: [],
      isAdminConnected: false,
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);

    if (process.env.DEBUG_LOGS === 'true') {
      console.log('💬 [CHAT] Nueva sesión creada:', sessionId);
    }

    return session;
  }

  async addMessage(sessionId: string, message: string, sender: 'client' | 'bot' | 'admin'): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Sesión de chat no encontrada');
    }

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId,
      message,
      sender,
      timestamp: new Date(),
      metadata: {
        isAutomatic: sender === 'bot',
        clientRead: false,
        adminRead: false
      }
    };

    session.messages.push(chatMessage);
    session.lastActivity = new Date();

    // Notificar a Telegram sobre el nuevo mensaje
    if (sender === 'client') {
      await telegramService.notifyNewMessage(session, chatMessage);
    }

    if (process.env.DEBUG_LOGS === 'true') {
      console.log('💬 [CHAT] Mensaje agregado:', { sessionId, sender, messageLength: message.length });
    }

    return chatMessage;
  }

  async processUserMessage(sessionId: string, userMessage: string, userIp: string, userAgent?: string): Promise<{ userMessage: ChatMessage; botResponse?: ChatMessage }> {
    let session = this.sessions.get(sessionId);
    
    // Si no existe la sesión, crearla
    if (!session) {
      session = await this.createSession(userIp, userAgent);
      sessionId = session.id;
      
      // Notificar nueva sesión a Telegram
      await telegramService.notifyNewChatSession(session);
    }

    // Agregar mensaje del usuario
    const userChatMessage = await this.addMessage(sessionId, userMessage, 'client');

    // Si hay conexión administrativa, no responder automáticamente
    if (session.isAdminConnected) {
      console.log('💬 [CHAT] Administrador conectado - no se envía respuesta automática');
      return { userMessage: userChatMessage };
    }

    // Generar respuesta automática del bot
    const botResponse = await this.generateBotResponse(sessionId, userMessage);

    return { userMessage: userChatMessage, botResponse };
  }

  private async generateBotResponse(sessionId: string, userMessage: string): Promise<ChatMessage> {
    const responseType = this.determineResponseType(userMessage);
    const autoResponse = this.autoResponses.find(r => r.trigger === responseType) || 
                        this.autoResponses.find(r => r.trigger === 'default')!;

    // Simular delay de respuesta para parecer más natural
    await new Promise(resolve => setTimeout(resolve, autoResponse.delay));

    return await this.addMessage(sessionId, autoResponse.message, 'bot');
  }

  private determineResponseType(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('saludos')) {
      return 'greeting';
    }
    
    if (lowerMessage.includes('servicio') || lowerMessage.includes('que hacen') || lowerMessage.includes('ofrecen')) {
      return 'services';
    }
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotiz')) {
      return 'pricing';
    }
    
    if (lowerMessage.includes('contacto') || lowerMessage.includes('comunicar') || lowerMessage.includes('hablar')) {
      return 'contact';
    }

    return 'default';
  }

  async enableAdminIntervention(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.isAdminConnected = true;
    session.status = 'admin_connected';
    await telegramService.notifyAdminIntervention(sessionId);

    console.log('💬 [CHAT] Intervención administrativa habilitada para sesión:', sessionId);
    return true;
  }

  async addAdminMessage(sessionId: string, message: string, adminTelegramId?: string): Promise<ChatMessage | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    // Habilitar intervención administrativa si no está activa
    if (!session.isAdminConnected) {
      await this.enableAdminIntervention(sessionId);
    }

    const adminMessage = await this.addMessage(sessionId, message, 'admin');
    
    // Agregar información del admin si se proporciona
    if (adminTelegramId) {
      adminMessage.adminInfo = {
        telegramId: adminTelegramId,
        name: 'Admin'
      };
      session.adminTelegramId = adminTelegramId;
    }

    return adminMessage;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllActiveSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  async endSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.status = 'closed';

    // Enviar resumen final a Telegram
    const summary = telegramService.formatChatSession(session);
    await telegramService.sendMessage(`🏁 <b>Chat Finalizado</b>\n\n${summary}`);

    console.log('💬 [CHAT] Sesión finalizada:', sessionId);
    return true;
  }

  // Limpiar sesiones antiguas (llamar periódicamente)
  cleanupOldSessions(): number {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now.getTime() - session.lastActivity.getTime();
      if (age > maxAge) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log('💬 [CHAT] Limpieza automática:', cleaned, 'sesiones eliminadas');
    }

    return cleaned;
  }
}

const chatService = new ChatService();

// Limpiar sesiones antiguas cada hora
setInterval(() => {
  chatService.cleanupOldSessions();
}, 60 * 60 * 1000);

export default chatService;
