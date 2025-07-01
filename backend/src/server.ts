import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact';
import chatRoutes from './routes/chat';
import { ApiResponse } from './types';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Rate limiting
if (process.env.RATE_LIMIT_ENABLED === 'true') {
  const limiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15')) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
    message: {
      success: false,
      message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
      error: 'rate_limit_exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use('/api/', limiter);
}

// Parsing de JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =========================================
// RUTAS
// =========================================

// Ruta de salud
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor Planix corriendo en puerto ${PORT}`);
  console.log(`📧 Modo test: ${process.env.TEST_MODE === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.DEBUG_LOGS === 'true') {
    console.log(`🐛 Debug logs: ACTIVADO`);
    console.log(`⚡ CORS permitido para: ${corsOptions.origin}`);
    console.log(`⚡ Rate limiting: ${process.env.RATE_LIMIT_ENABLED === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }
});

export default app;
