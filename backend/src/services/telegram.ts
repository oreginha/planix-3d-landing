import { ChatSession, ChatMessage } from '../types/chat';

interface TelegramServiceConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

interface TelegramWebhook {
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
    };
    text?: string;
  };
}

class TelegramService {
  private config: TelegramServiceConfig | null = null;
  private baseUrl: string = '';
  // Caché para asociar usuarios de Telegram con sesiones de chat activas
  private userSessionCache: Map<number, string> = new Map();
  // Caché para recordar la última sesión activa por usuario
  private lastActiveSession: Map<number, { sessionId: string, timestamp: number }> = new Map();

  constructor() {
    // No inicializar aquí, hacerlo lazy
    console.log('🤖 [TELEGRAM] Constructor llamado - inicialización lazy');
  }

  private initializeConfig(): void {
    if (this.config) return; // Ya inicializado

    // Obtener el primer chat ID de la lista de admin chat IDs
    const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS || '';
    const firstChatId = adminChatIds.split(',')[0]?.trim() || '';
    
    this.config = {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: firstChatId,
      enabled: process.env.TELEGRAM_ENABLED === 'true' && !!(process.env.TELEGRAM_BOT_TOKEN && firstChatId)
    };
    
    this.baseUrl = `https://api.telegram.org/bot${this.config.botToken}`;
    
    // Mostrar log de inicialización real
    console.log('🤖 [TELEGRAM] Servicio inicializado:', {
      enabled: this.config.enabled,
      hasBotToken: !!this.config.botToken,
      hasChatId: !!this.config.chatId,
      telegramEnabled: process.env.TELEGRAM_ENABLED,
      botToken: this.config.botToken ? 'SET' : 'NOT_SET',
      chatId: this.config.chatId || 'NOT_SET'
    });
  }

  async sendMessage(text: string): Promise<boolean> {
    this.initializeConfig(); // Inicializar config la primera vez que se use
    if (!this.config!.enabled) {
      console.log('🤖 [TELEGRAM] Deshabilitado - mensaje no enviado');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config!.chatId,
          text: text,
          parse_mode: 'HTML'
        }),
      });

      if (response.ok) {
        console.log('🤖 [TELEGRAM] Mensaje enviado exitosamente');
        return true;
      } else {
        console.error('🤖 [TELEGRAM] Error al enviar mensaje:', response.status);
        return false;
      }
    } catch (error) {
      console.error('🤖 [TELEGRAM] Error de conexión:', error);
      return false;
    }
  }

  // Métodos para gestionar el caché de sesiones
  private setUserSession(telegramUserId: number, sessionId: string): void {
    this.userSessionCache.set(telegramUserId, sessionId);
    this.lastActiveSession.set(telegramUserId, {
      sessionId,
      timestamp: Date.now()
    });
    console.log(`🤖 [TELEGRAM] Usuario ${telegramUserId} asociado con sesión ${sessionId}`);
  }

  private getUserSession(telegramUserId: number): string | null {
    return this.userSessionCache.get(telegramUserId) || null;
  }

  private getLastActiveSession(telegramUserId: number): string | null {
    const lastSession = this.lastActiveSession.get(telegramUserId);
    if (lastSession) {
      // Considerar sesión válida si fue activa en las últimas 24 horas
      const isRecent = (Date.now() - lastSession.timestamp) < (24 * 60 * 60 * 1000);
      if (isRecent) {
        return lastSession.sessionId;
      }
    }
    return null;
  }

  private clearUserSession(telegramUserId: number): void {
    this.userSessionCache.delete(telegramUserId);
    console.log(`🤖 [TELEGRAM] Sesión del usuario ${telegramUserId} eliminada del caché`);
  }

  private async handleCommand(command: string, telegramUserId: number): Promise<void> {
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case '/sessions':
      case '/session':
        await this.handleSessionsCommand(telegramUserId);
        break;
        
      case '/clear':
      case '/reset':
        await this.handleClearCommand(telegramUserId);
        break;
        
      case '/help':
      case '/start':
        await this.handleHelpCommand();
        break;
        
      case '/status':
        await this.handleStatusCommand(telegramUserId);
        break;
        
      default:
        await this.sendMessage(`❓ Comando no reconocido: ${command}\n\nUsa /help para ver los comandos disponibles.`);
    }
  }

  private async handleSessionsCommand(telegramUserId: number): Promise<void> {
    try {
      // Importar chatService dinámicamente
      const { default: chatService } = await import('./chat');
      const activeSessions = chatService.getAllActiveSessions();
      
      if (activeSessions.length === 0) {
        await this.sendMessage('📭 No hay sesiones de chat activas en este momento.');
        return;
      }
      
      const currentSession = this.getUserSession(telegramUserId);
      let message = '📋 <b>Sesiones de Chat Activas:</b>\n\n';
      
      activeSessions.forEach((session, index) => {
        const isCurrentSession = session.id === currentSession;
        const indicator = isCurrentSession ? '👉' : '📝';
        const status = isCurrentSession ? ' <b>(Tu sesión actual)</b>' : '';
        
        message += `${indicator} <code>${session.id}</code>${status}\n`;
        message += `   👤 Cliente: ${session.clientId}\n`;
        message += `   💬 Mensajes: ${session.messages.length}\n`;
        message += `   ⏰ Iniciado: ${new Date(session.startTime).toLocaleString('es-AR')}\n\n`;
      });
      
      message += '💡 <i>Para cambiar de sesión, usa: </i><code>chat_ID_SESION tu mensaje</code>';
      
      await this.sendMessage(message);
    } catch (error) {
      console.error('🤖 [TELEGRAM] Error al obtener sesiones:', error);
      await this.sendMessage('❌ Error al obtener las sesiones activas.');
    }
  }

  private async handleClearCommand(telegramUserId: number): Promise<void> {
    const hadSession = this.getUserSession(telegramUserId) !== null;
    this.clearUserSession(telegramUserId);
    
    if (hadSession) {
      await this.sendMessage('✅ Tu sesión asociada ha sido eliminada.\n\n💡 Responde a una nueva notificación de chat para asociarte con una sesión activa.');
    } else {
      await this.sendMessage('ℹ️ No tenías ninguna sesión asociada.');
    }
  }

  private async handleStatusCommand(telegramUserId: number): Promise<void> {
    const currentSession = this.getUserSession(telegramUserId);
    const lastSession = this.getLastActiveSession(telegramUserId);
    
    let message = '📊 <b>Tu Estado Actual:</b>\n\n';
    
    if (currentSession) {
      message += `✅ <b>Sesión Activa:</b> <code>${currentSession}</code>\n`;
      message += '💬 Puedes responder directamente sin especificar Chat ID\n\n';
    } else {
      message += '❌ <b>Sin sesión activa</b>\n\n';
    }
    
    if (lastSession && lastSession !== currentSession) {
      message += `🕒 <b>Última sesión:</b> <code>${lastSession}</code>\n`;
      message += '💡 Se reactivará automáticamente si envías un mensaje\n\n';
    }
    
    message += '<b>Comandos disponibles:</b>\n';
    message += '/sessions - Ver sesiones activas\n';
    message += '/clear - Limpiar tu sesión\n';
    message += '/status - Ver este estado\n';
    message += '/help - Ayuda completa';
    
    await this.sendMessage(message);
  }

  private async handleHelpCommand(): Promise<void> {
    const helpMessage = `
🤖 <b>Ayuda del Bot de Chat</b>

<b>📝 Responder a Chats:</b>
• Responde directamente a las notificaciones
• Tu sesión se asocia automáticamente
• No necesitas incluir el Chat ID

<b>🔧 Comandos Disponibles:</b>
/sessions - Ver todas las sesiones activas
/clear - Limpiar tu sesión asociada
/status - Ver tu estado actual
/help - Mostrar esta ayuda

<b>🆘 Método Manual:</b>
Si necesitas especificar una sesión:
<code>chat_123456789 Tu mensaje</code>
<code>ID: 123456789 Tu mensaje</code>

<b>💡 Consejos:</b>
• Las sesiones se asocian automáticamente por 24 horas
• Puedes cambiar de sesión especificando un nuevo Chat ID
• Usa /clear si tienes problemas con la sesión actual`;
    
    await this.sendMessage(helpMessage);
  }

  async notifyNewChatSession(session: ChatSession): Promise<void> {
    const message = `
🆕 <b>Nueva Conversación de Chat</b>

📝 <b>ID:</b> ${session.id}
👤 <b>Cliente:</b> ${session.clientId}
🌐 <b>IP:</b> ${session.clientInfo.ip}
📱 <b>User Agent:</b> ${session.clientInfo.userAgent?.substring(0, 50)}...
⏰ <b>Iniciado:</b> ${new Date(session.startTime).toLocaleString('es-AR')}

💬 <b>Primer mensaje:</b>
"${session.messages[0]?.message || 'Sin mensaje inicial'}"

📊 <b>Estado:</b> ${session.status}

💡 <i>Responde directamente sin incluir el Chat ID. Esta sesión se asociará automáticamente contigo.</i>
`;

    await this.sendMessage(message);
  }

  async notifyNewMessage(session: ChatSession, message: ChatMessage): Promise<void> {
    const notification = `
💬 <b>Nuevo Mensaje</b>

📝 <b>Chat ID:</b> ${session.id}
👤 <b>De:</b> ${message.sender === 'client' ? 'Cliente' : message.sender === 'bot' ? 'Bot' : 'Admin'}
⏰ <b>Hora:</b> ${new Date(message.timestamp).toLocaleString('es-AR')}

💭 <b>Mensaje:</b>
"${message.message}"

${message.sender === 'client' ? '👨‍💼 <i>Responde directamente - esta sesión se asociará contigo automáticamente.</i>' : ''}
`;

    await this.sendMessage(notification);
    
    // Si es un mensaje del cliente, asociar esta sesión con todos los admins autorizados
    // para que puedan responder directamente sin especificar el Chat ID
    if (message.sender === 'client') {
      const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(',').map(id => parseInt(id.trim())) || [];
      adminChatIds.forEach(adminId => {
        this.setUserSession(adminId, session.id);
      });
    }
  }

  async notifyAdminIntervention(sessionId: string): Promise<void> {
    const message = `
🙋‍♂️ <b>Administrador Interviniendo</b>

📝 <b>Chat ID:</b> ${sessionId}
⏰ <b>Hora:</b> ${new Date().toLocaleString('es-AR')}

ℹ️ El administrador ha tomado el control de la conversación.
`;

    await this.sendMessage(message);
  }

  formatChatSession(session: ChatSession): string {
    const messagesList = session.messages
      .map(msg => `${msg.sender === 'client' ? '👤' : msg.sender === 'bot' ? '🤖' : '👨‍💼'} ${msg.message}`)
      .join('\n');

    return `
📋 <b>Resumen de Chat</b>

📝 <b>ID:</b> ${session.id}
⏰ <b>Duración:</b> ${Math.round((new Date().getTime() - new Date(session.startTime).getTime()) / 1000 / 60)} minutos
📊 <b>Mensajes:</b> ${session.messages.length}
🎯 <b>Estado:</b> ${session.status}

💬 <b>Conversación:</b>
${messagesList}
`;
  }

  // Webhook para recibir mensajes de Telegram
  async handleWebhook(telegramWebhook: TelegramWebhook): Promise<void> {
    console.log('🤖 [TELEGRAM] Webhook recibido:', telegramWebhook);
    
    // Verificar que el webhook tenga un mensaje
    if (!telegramWebhook.message) {
      console.log('🤖 [TELEGRAM] Webhook sin mensaje, ignorando');
      return;
    }

    const telegramMessage = telegramWebhook.message;
    
    // Verificar que el mensaje tenga texto
    if (!telegramMessage.text) {
      console.log('🤖 [TELEGRAM] Mensaje sin texto, ignorando');
      return;
    }

    // Verificar que el mensaje venga de un chat autorizado
    const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(',').map(id => parseInt(id.trim())) || [];
    if (!adminChatIds.includes(telegramMessage.chat.id)) {
      console.log('🤖 [TELEGRAM] Mensaje de chat no autorizado:', telegramMessage.chat.id);
      return;
    }

    const telegramUserId = telegramMessage.from.id;
    let sessionId: string | null = null;
    let messageText = telegramMessage.text;

    // Manejar comandos especiales
    if (messageText.startsWith('/')) {
      await this.handleCommand(messageText, telegramUserId);
      return;
    }

    // Buscar si el mensaje contiene un ID de sesión explícito
    const sessionIdMatch = telegramMessage.text.match(/(?:(chat_[a-zA-Z0-9_]+)|ID:\s*(chat_[a-zA-Z0-9_]+|[a-zA-Z0-9_]+))/i);
    
    if (sessionIdMatch) {
      // Mensaje con ID de sesión explícito
      sessionId = sessionIdMatch[1] || sessionIdMatch[2];
      
      // Si el sessionId no tiene el prefijo chat_, agregarlo
      if (sessionId && !sessionId.startsWith('chat_')) {
        sessionId = 'chat_' + sessionId;
      }
      
      messageText = telegramMessage.text.replace(/(?:chat_[a-zA-Z0-9_]+|ID:\s*[a-zA-Z0-9_]+)/i, '').trim();
      
      // Asociar este usuario con esta sesión para futuros mensajes
      this.setUserSession(telegramUserId, sessionId);
      
      console.log('🤖 [TELEGRAM] SessionId extraído explícitamente:', sessionId);
    } else {
      // Buscar sesión en caché para este usuario
      sessionId = this.getUserSession(telegramUserId);
      
      if (!sessionId) {
        // Si no hay sesión en caché, buscar la última sesión activa
        sessionId = this.getLastActiveSession(telegramUserId);
        if (sessionId) {
          // Reactivar la sesión en el caché
          this.setUserSession(telegramUserId, sessionId);
          console.log('🤖 [TELEGRAM] Sesión reactivada desde historial:', sessionId);
        }
      } else {
        console.log('🤖 [TELEGRAM] Usando sesión del caché:', sessionId);
      }
    }
    
    if (sessionId && messageText.trim()) {
      console.log('🤖 [TELEGRAM] Mensaje original:', telegramMessage.text);
      console.log('🤖 [TELEGRAM] Mensaje limpio:', messageText);
      console.log('🤖 [TELEGRAM] Sesión objetivo:', sessionId);
      
      // Importar chatService dinámicamente para evitar dependencias circulares
      const { default: chatService } = await import('./chat');
      
      // Enviar mensaje del admin al chat
      const adminMessage = await chatService.addAdminMessage(
        sessionId, 
        messageText, 
        telegramUserId.toString()
      );
      
      if (adminMessage) {
        console.log('🤖 [TELEGRAM] Mensaje de admin enviado al chat:', sessionId);
        
        // Confirmar recepción en Telegram
        await this.sendMessage(`✅ Mensaje enviado al chat ${sessionId}:\n"${messageText}"`);
      } else {
        // Si la sesión no existe, limpiar el caché y mostrar error
        this.clearUserSession(telegramUserId);
        await this.sendMessage(`❌ No se pudo enviar el mensaje. Sesión ${sessionId} no encontrada o expirada.\n\n💡 Responde a una nueva notificación de chat para asociarte con una sesión activa.`);
      }
    } else if (!sessionId) {
      // Si no hay sesión asociada, mostrar ayuda
      const helpMessage = `
🤖 <b>No tienes una sesión de chat asociada</b>

💡 <b>Opciones:</b>

1️⃣ <b>Responde a una notificación de nuevo chat</b> - Se asociará automáticamente

2️⃣ <b>Especifica el Chat ID manualmente:</b>
<code>chat_123456789 Tu respuesta aquí</code>
<code>ID: 123456789 Tu respuesta</code>

3️⃣ <b>Usa comandos:</b>
<code>/sessions</code> - Ver sesiones activas
<code>/clear</code> - Limpiar tu sesión asociada`;
      
      await this.sendMessage(helpMessage);
    } else {
      await this.sendMessage('❌ Mensaje vacío. Escribe tu respuesta para el cliente.');
    }
  }
}

// Función para crear y exportar el servicio solo cuando se necesite
let telegramServiceInstance: TelegramService | null = null;

export const getTelegramService = (): TelegramService => {
  if (!telegramServiceInstance) {
    telegramServiceInstance = new TelegramService();
  }
  return telegramServiceInstance;
};

// Inicializar automáticamente para compatibilidad
const telegramService = getTelegramService();
export default telegramService;
