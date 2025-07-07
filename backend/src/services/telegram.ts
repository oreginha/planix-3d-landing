import { ChatSession, ChatMessage } from '../types/chat';

interface TelegramServiceConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

interface TelegramMessage {
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
}

class TelegramService {
  private config: TelegramServiceConfig | null = null;
  private baseUrl: string = '';

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

${message.sender === 'client' ? '👨‍💼 <i>¿Deseas responder desde Telegram?</i>' : ''}
`;

    await this.sendMessage(notification);
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

  // Webhook para recibir mensajes de Telegram (para implementar más adelante)
  async handleWebhook(telegramMessage: TelegramMessage): Promise<void> {
    // Esta función se implementará cuando configuremos el webhook
    console.log('🤖 [TELEGRAM] Webhook recibido:', telegramMessage);
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
