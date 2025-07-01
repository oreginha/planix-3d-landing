# 🚀 Planix Backend - Railway Deploy

## ✅ Configuración para Railway

Este directorio contiene el backend Node.js + Express para Planix.

### 📋 Variables de entorno requeridas:

```bash
# Servidor
NODE_ENV=production
PORT=3001

# Email
EMAIL_TO=hola@planix.com.ar
EMAIL_FROM_NAME=Planix Web
EMAIL_FROM_EMAIL=noreply@planix.com.ar

# SMTP (configurar en producción)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Seguridad
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app
RATE_LIMIT_ENABLED=true

# Test Mode (false para producción)
TEST_MODE=false
```

### 🛠️ Scripts Railway:

- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev**: `npm run dev`

### 🌐 Endpoints:

- `GET /health` - Estado del servidor
- `POST /api/contact` - Formulario de contacto
- `POST /api/chat/message` - Mensajes de chat
- `GET /api/contact/test` - Test de email

### 🔧 Configuración Railway:

1. **Root Directory**: `backend`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Port**: `3001` (auto-detectado)

### 📡 URL de producción:

https://planix-backend-node-production.up.railway.app

### 🧪 Test del deployment:

```bash
curl https://planix-backend-node-production.up.railway.app/health
```
