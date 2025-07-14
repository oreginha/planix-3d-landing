import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact';
import chatRoutes from './routes/chat';
import { ApiResponse } from './types';

// Cargar variables de entorno PRIMERO
dotenv.config({ path: __dirname + '/../.env' });

// Debug: verificar que las variables se carguen
if (process.env.DEBUG_LOGS === 'true') {
  console.log('🔧 [DEBUG] Variables de Telegram:', {
    TELEGRAM_ENABLED: process.env.TELEGRAM_ENABLED,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT_SET',
    TELEGRAM_ADMIN_CHAT_IDS: process.env.TELEGRAM_ADMIN_CHAT_IDS ? 'SET' : 'NOT_SET'
  });
}

// Inicializar servicio de Telegram dinámicamente DESPUÉS de cargar variables
const initializeTelegram = async () => {
  try {
    const telegramModule = await require('./services/telegram');
    // Forzar inicialización enviando un mensaje de prueba AL GRUPO
    const telegramService = telegramModule.default;
    
    // Usar todos los chat IDs para probar
    const chatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(',') || [];
    for (const chatId of chatIds) {
      const trimmedChatId = chatId.trim();
      console.log(`🤖 [TELEGRAM] Probando envío a chat: ${trimmedChatId}`);
      try {
        // Crear una instancia temporal para probar cada chat
        const testMessage = `🔥 Backend de Planix iniciado correctamente\n⏰ ${new Date().toLocaleString('es-AR')}`;
        await telegramService.sendMessage(testMessage);
        break; // Si uno funciona, no probar el resto
      } catch (error) {
        console.log(`🤖 [TELEGRAM] Chat ${trimmedChatId} no disponible:`, error);
      }
    }
    
    console.log('📱 [TELEGRAM] Servicio cargado y probado exitosamente');
  } catch (error) {
    console.error('❌ [TELEGRAM] Error al cargar servicio:', error);
  }
};

const app = express();
const PORT = process.env.PORT || 3002;

// =========================================
// CONFIGURACIÓN DE PROXY (DEBE IR PRIMERO)
// =========================================

// Configurar trust proxy para Railway ANTES de cualquier middleware
app.set('trust proxy', true);

// =========================================
// MIDDLEWARES DE SEGURIDAD
// =========================================

// Helmet para headers de seguridad
app.use(helmet());

// CORS configuración
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting (DESPUÉS de configurar trust proxy)
if (process.env.RATE_LIMIT_ENABLED === 'true') {
  const limiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15')) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
      success: false,
      message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
      error: 'rate_limit_exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Excluir el webhook de Telegram del rate limiting
    skip: (req) => {
      return req.path === '/api/chat/telegram/webhook';
    }
  });

  app.use('/api/', limiter);
}

// Parsing de JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =========================================
// RUTAS
// =========================================

// Ruta de salud (dos versiones para compatibilidad)
app.get('/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Backend Planix funcionando correctamente',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      testMode: process.env.TEST_MODE === 'true'
    }
  };
  
  res.status(200).json(response);
});

// Health check en /api/health también
app.get('/api/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Servidor funcionando correctamente',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      testMode: process.env.TEST_MODE === 'true'
    }
  };
  
  res.status(200).json(response);
});

// Rutas de API
app.use('/api', contactRoutes);
app.use('/api/chat', chatRoutes);

// Ruta para manejo de rutas no encontradas
app.use('*', (req, res) => {
  const response: ApiResponse = {
    success: false,
    message: 'Endpoint no encontrado',
    error: 'not_found'
  };
  
  res.status(404).json(response);
});

// =========================================
// MANEJO DE ERRORES
// =========================================

// Middleware global de manejo de errores
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error no manejado:', error);
  
  const response: ApiResponse = {
    success: false,
    message: 'Error interno del servidor',
    error: 'internal_server_error'
  };
  
  res.status(500).json(response);
});

// =========================================
// INICIO DEL SERVIDOR
// =========================================

app.listen(PORT, async () => {
  console.log(`🚀 Servidor Planix corriendo en puerto ${PORT}`);
  console.log(`📧 Modo test: ${process.env.TEST_MODE === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.DEBUG_LOGS === 'true') {
    console.log(`🐛 Debug logs: ACTIVADO`);
    console.log(`⚡ CORS permitido para: ${corsOptions.origin}`);
    console.log(`⚡ Rate limiting: ${process.env.RATE_LIMIT_ENABLED === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }
  
  // Inicializar Telegram después de que el servidor esté listo
  await initializeTelegram();
});

export default app;
