import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mailerService from '../utils/mailer';
import { ChatMessage, ApiResponse } from '../types';

const router = Router();

// Validaciones para mensaje de chat
const chatValidation = [
  body('userName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre de usuario es requerido'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('El mensaje debe tener entre 1 y 2000 caracteres'),
  
  body('userEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email debe ser válido si se proporciona'),
  
  body('isFirstMessage')
    .optional()
    .isBoolean()
    .withMessage('isFirstMessage debe ser booleano')
];

// POST /api/chat/message - Enviar mensaje de chat
router.post('/message', chatValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Datos de entrada inválidos',
        error: 'validation_error'
      };

      res.status(400).json(response);
      return;
    }

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userName: req.body.userName,
      userEmail: req.body.userEmail || undefined,
      message: req.body.message,
      timestamp: new Date(),
      isFirstMessage: req.body.isFirstMessage || false
    };

    // Log para debugging
    if (process.env.DEBUG_LOGS === 'true') {
      console.log('💬 Nuevo mensaje de chat:', {
        userName: chatMessage.userName,
        hasEmail: !!chatMessage.userEmail,
        isFirstMessage: chatMessage.isFirstMessage,
        messageLength: chatMessage.message.length
      });
    }

    // Enviar email
    const emailSent = await mailerService.sendChatMessage(chatMessage);

    if (emailSent) {
      const response: ApiResponse = {
        success: true,
        message: 'Mensaje recibido correctamente',
        data: { 
          messageId: chatMessage.id,
          timestamp: chatMessage.timestamp.toISOString()
        }
      };

      res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: 'Error interno al procesar el mensaje',
        error: 'email_send_failed'
      };

      res.status(500).json(response);
    }

  } catch (error) {
    console.error('❌ Error en endpoint de chat:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: 'internal_server_error'
    };

    res.status(500).json(response);
  }
});

export default router;
