import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mailerService from '../utils/mailer';
import { ContactFormData, ApiResponse, ValidationError } from '../types';

const router = Router();

// Validaciones para el formulario de contacto
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('El mensaje debe tener entre 10 y 5000 caracteres'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre de la empresa no puede exceder 100 caracteres'),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres')
];

// POST /api/contact - Enviar formulario de contacto
router.post('/contact', contactValidation, async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors: ValidationError[] = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg
      }));

      const response: ApiResponse = {
        success: false,
        message: 'Datos de entrada inválidos',
        error: 'validation_error',
        data: { errors: validationErrors }
      };

      res.status(400).json(response);
      return;
    }

    const contactData: ContactFormData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      company: req.body.company || undefined,
      phone: req.body.phone || undefined
    };

    // Log para debugging
    if (process.env.DEBUG_LOGS === 'true') {
      console.log('📧 Nuevo contacto recibido:', {
        name: contactData.name,
        email: contactData.email,
        hasCompany: !!contactData.company,
        hasPhone: !!contactData.phone,
        messageLength: contactData.message.length
      });
    }

    // Enviar email
    const emailSent = await mailerService.sendContactEmail(contactData);

    if (emailSent) {
      const response: ApiResponse = {
        success: true,
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
        data: { 
          timestamp: new Date().toISOString(),
          contactId: `contact_${Date.now()}`
        }
      };

      res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: 'Error interno al enviar el mensaje. Inténtalo de nuevo.',
        error: 'email_send_failed'
      };

      res.status(500).json(response);
    }

  } catch (error) {
    console.error('❌ Error en endpoint de contacto:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error interno del servidor',
      error: 'internal_server_error'
    };

    res.status(500).json(response);
  }
});

// GET /api/contact/test - Endpoint de prueba
router.get('/contact/test', async (req: Request, res: Response) => {
  try {
    const isConnected = await mailerService.testConnection();
    
    const response: ApiResponse = {
      success: isConnected,
      message: isConnected ? 'Conexión SMTP funcionando correctamente' : 'Error en conexión SMTP',
      data: {
        timestamp: new Date().toISOString(),
        testMode: process.env.TEST_MODE === 'true',
        nodeEnv: process.env.NODE_ENV
      }
    };

    res.status(isConnected ? 200 : 500).json(response);
  } catch (error) {
    console.error('❌ Error en test de conexión:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Error al probar la conexión',
      error: 'connection_test_failed'
    };

    res.status(500).json(response);
  }
});

export default router;
