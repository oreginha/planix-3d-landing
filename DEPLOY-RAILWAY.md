# 🚀 Deploy de Planix Landing + Backend Node.js en Railway

## ✅ **Estado actual del Deploy:**

### **🌐 Frontend:**

- **Servicio:** planix-3d-landing
- **URL:** https://planix-3d-landing-production.up.railway.app
- **Estado:** ✅ Funcionando

### **⚙️ Backend Node.js:**

- **Servicio:** planix-backend-nodejs
- **URL:** https://planix-backend-nodejs-production.up.railway.app
- **Estado:** 🔄 En deploy
- **Directorio:** `/backend`
- **Rama:** `backend-nodejs`

## 📋 **Configuración completada:**

### **Variables de entorno del backend:**

```env
PORT=3001
NODE_ENV=production
EMAIL_TO=hola@planix.com.ar
EMAIL_FROM_NAME=Planix Web
EMAIL_FROM_EMAIL=noreply@planix.com.ar
TEST_MODE=false
DEBUG_LOGS=true
RATE_LIMIT_ENABLED=true
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app,https://planix.com.ar
```

### **Endpoints del backend:**

- **Health:** `GET /health`
- **Contact:** `POST /api/contact`
- **Chat:** `POST /api/chat/message`
- **Email Test:** `GET /api/contact/test`

## 🔧 **Próximos pasos:**

1. **✅ Backend creado y configurado**
2. **🔄 Deploy automático en progreso**
3. **⏳ Actualizar frontend para usar nueva API**
4. **⏳ Configurar credenciales SMTP reales**
5. **⏳ Testing completo en producción**

## 🌍 **URLs de producción:**

- **Frontend:** https://planix-3d-landing-production.up.railway.app
- **Backend API:** https://planix-backend-nodejs-production.up.railway.app
- **Health Check:** https://planix-backend-nodejs-production.up.railway.app/health

## 📝 **Notas importantes:**

- El backend está configurado para usar el directorio `/backend`
- Las variables SMTP están vacías (necesitan configuración real)
- CORS configurado para permitir el frontend de Railway
- Rate limiting activado en producción
- Logs detallados activados para debugging

## 🔄 **Siguiente iteración:**

Una vez que el deploy termine automáticamente, necesitamos:

1. Verificar que el backend responda correctamente
2. Actualizar el frontend para usar la nueva API
3. Configurar credenciales SMTP reales para emails
4. Testing completo de la integración
