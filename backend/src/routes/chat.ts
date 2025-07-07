import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import chatService from '../services/chat';
import telegramService from '../services/telegram';
import { ApiResponse } from '../types';

const router = Router();

// Validaciones para mensaje de chat
const chatValidation = [
  body('userName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre de usuario debe tener entre 1 y 100 caracteres'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('El mensaje debe tener entre 1 y 2000 caracteres'),
  
  body('userEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email debe ser válido si se proporciona'),
  
  body('sessionId')
    .optional()
    .isString()
    .withMessage('Session ID debe ser string'),
    
  body('isFirstMessage')
    .optional()
    .isBoolean()
    .withMessage('isFirstMessage debe ser booleano')
];

// POST /api/chat/message - Enviar mensaje del cliente
router.post('/message', chatValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Datos de entrada inválidos',
        error: errors.array().map(e => e.msg).join(', ')
      };
      res.status(400).json(response);
      return;
    }

    const { message, sessionId, userName, userEmail, isFirstMessage } = req.body;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const userIp = req.ip || req.connection.remoteAddress || 'Unknown';

    // Procesar mensaje del usuario
    const result = await chatService.processUserMessage(
      sessionId || '',
      message,
      userIp,
      userAgent
    );

    const response: ApiResponse = {
      success: true,
      message: 'Mensaje procesado exitosamente',
      data: {
        sessionId: result.userMessage.sessionId,
        userMessage: {
          id: result.userMessage.id,
          message: result.userMessage.message,
          timestamp: result.userMessage.timestamp,
          sender: result.userMessage.sender
        },
        botResponse: result.botResponse ? {
          id: result.botResponse.id,
          message: result.botResponse.message,
          timestamp: result.botResponse.timestamp,
          sender: result.botResponse.sender
        } : undefined
      }
    };

    res.json(response);
  } catch (error) {
    console.error('❌ [CHAT] Error en /message:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    };
    res.status(500).json(response);
  }
});

// GET /api/chat/session/:sessionId - Obtener información de sesión
router.get('/session/:sessionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      const response: ApiResponse = {
        success: false,
        message: 'Session ID requerido'
      };
      res.status(400).json(response);
      return;
    }

    const session = await chatService.getSession(sessionId);
    
    if (!session) {
      const response: ApiResponse = {
        success: false,
        message: 'Sesión no encontrada'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Sesión encontrada',
      data: {
        sessionId: session.id,
        status: session.status,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        isAdminConnected: session.isAdminConnected,
        messageCount: session.messages.length,
        messages: session.messages.map(msg => ({
          id: msg.id,
          message: msg.message,
          sender: msg.sender,
          timestamp: msg.timestamp,
          metadata: msg.metadata
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('❌ [CHAT] Error en /session:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    };
    res.status(500).json(response);
  }
});

// POST /api/chat/admin/message - Enviar mensaje de administrador
router.post('/admin/message', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, message, adminTelegramId, adminName } = req.body;

    if (!sessionId || !message) {
      const response: ApiResponse = {
        success: false,
        message: 'Session ID y mensaje son requeridos'
      };
      res.status(400).json(response);
      return;
    }

    const adminMessage = await chatService.addAdminMessage(sessionId, message, adminTelegramId);
    
    if (!adminMessage) {
      const response: ApiResponse = {
        success: false,
        message: 'Sesión no encontrada'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Mensaje de administrador enviado',
      data: {
        messageId: adminMessage.id,
        sessionId: adminMessage.sessionId,
        message: adminMessage.message,
        timestamp: adminMessage.timestamp,
        sender: adminMessage.sender
      }
    };

    res.json(response);
  } catch (error) {
    console.error('❌ [CHAT] Error en /admin/message:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    };
    res.status(500).json(response);
  }
});

// POST /api/chat/telegram/webhook - Webhook de Telegram
router.post('/telegram/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    await telegramService.handleWebhook(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ [TELEGRAM] Error en webhook:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/chat/admin/sessions - Obtener todas las sesiones activas
router.get('/admin/sessions', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await chatService.getAllActiveSessions();
    
    const response: ApiResponse = {
      success: true,
      message: 'Sesiones activas obtenidas',
      data: {
        count: sessions.length,
        sessions: sessions.map(session => ({
          id: session.id,
          clientId: session.clientId,
          status: session.status,
          startTime: session.startTime,
          lastActivity: session.lastActivity,
          isAdminConnected: session.isAdminConnected,
          messageCount: session.messages.length,
          lastMessage: session.messages.length > 0 ? {
            message: session.messages[session.messages.length - 1].message,
            sender: session.messages[session.messages.length - 1].sender,
            timestamp: session.messages[session.messages.length - 1].timestamp
          } : null
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('❌ [CHAT] Error en /admin/sessions:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    };
    res.status(500).json(response);
  }
});

export default router;
