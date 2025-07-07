// Tipos para el sistema de chat avanzado
export interface ChatSession {
  id: string;
  clientId: string;
  clientInfo: {
    name?: string;
    email?: string;
    userAgent: string;
    ip: string;
  };
  status: 'active' | 'waiting_admin' | 'admin_connected' | 'closed';
  startTime: Date;
  lastActivity: Date;
  isAdminConnected: boolean;
  adminTelegramId?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'client' | 'bot' | 'admin';
  message: string;
  timestamp: Date;
  adminInfo?: {
    telegramId: string;
    name: string;
  };
  metadata?: {
    isAutomatic?: boolean;
    trigger?: string;
    clientRead?: boolean;
    adminRead?: boolean;
  };
}

export interface BotResponse {
  message: string;
  trigger?: string;
  shouldTransferToAdmin?: boolean;
  followUpDelay?: number;
  followUpMessage?: string;
}

export interface TelegramConfig {
  botToken: string;
  adminChatIds: string[];
  webhookUrl?: string;
  enabled: boolean;
}

export interface AdminNotification {
  sessionId: string;
  clientInfo: string;
  lastMessage: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
}
