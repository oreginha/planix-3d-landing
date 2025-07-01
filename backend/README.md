# 🚀 Backend Planix - Node.js + Express

Backend moderno en Node.js para la landing page de Planix con funcionalidades de email y chat.

## ✨ Características

- **📧 Sistema de Email**: Envío de formularios de contacto via SMTP
- **💬 Chat Inteligente**: Manejo de mensajes de chat con derivación a email
- **🔒 Seguridad**: CORS, Helmet, Rate Limiting
- **✅ Validación**: Validación robusta de datos de entrada
- **🧪 Modo Test**: Configuración para desarrollo y testing
- **📝 TypeScript**: Tipado fuerte y mejor DX

## 🏗️ Tecnologías

- **Node.js** + **Express** (servidor HTTP)
- **TypeScript** (tipado fuerte)
- **Nodemailer** (envío de emails SMTP)
- **Express Validator** (validación de datos)
- **Helmet** + **CORS** (seguridad)
- **Winston** (logs avanzados)

## 📋 Configuración

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno

Copia \`.env\` y configura tus valores:

\`\`\`bash

# Email principal donde recibirás mensajes

EMAIL_TO=hola@planix.com.ar

# Configuración SMTP (Gmail ejemplo)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Para development

TEST_MODE=true
TEST_EMAIL=tu-email-personal@gmail.com
\`\`\`

### 3. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

### 4. Build para producción

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔗 Endpoints

### Salud del servidor

- **GET** \`/health\` - Estado del backend

### Contacto

- **POST** \`/api/contact\` - Enviar formulario de contacto
- **GET** \`/api/contact/test\` - Probar conexión SMTP

### Chat

- **POST** \`/api/chat/message\` - Enviar mensaje de chat

## 📤 Ejemplos de uso

### Formulario de contacto

\`\`\`bash
curl -X POST http://localhost:3001/api/contact \\
-H "Content-Type: application/json" \\
-d '{
"name": "Juan Pérez",
"email": "juan@empresa.com",
"message": "Necesito una página web para mi negocio",
"company": "Mi Empresa SRL",
"phone": "+54 11 1234-5678"
}'
\`\`\`

### Mensaje de chat

\`\`\`bash
curl -X POST http://localhost:3001/api/chat/message \\
-H "Content-Type: application/json" \\
-d '{
"userName": "María",
"userEmail": "maria@email.com",
"message": "¿Cuánto cuesta un sitio web?",
"isFirstMessage": true
}'
\`\`\`

## 🚀 Deploy

### Railway (Recomendado)

1. Conecta el repo a Railway
2. Configura las variables de entorno
3. Deploy automático

### Render

1. Conecta el repo a Render
2. Configura build command: \`npm run build\`
3. Configura start command: \`npm start\`

### VPS propio

1. Clona el repo: \`git clone ...\`
2. Instala dependencias: \`npm install\`
3. Build: \`npm run build\`
4. Usa PM2: \`pm2 start dist/server.js\`

## 🔧 Configuración avanzada

### Variables de entorno disponibles

| Variable               | Descripción          | Ejemplo                   |
| ---------------------- | -------------------- | ------------------------- |
| \`PORT\`               | Puerto del servidor  | \`3001\`                  |
| \`NODE_ENV\`           | Entorno de ejecución | \`production\`            |
| \`EMAIL_TO\`           | Email destinatario   | \`hola@planix.com.ar\`    |
| \`SMTP_HOST\`          | Servidor SMTP        | \`smtp.gmail.com\`        |
| \`SMTP_PORT\`          | Puerto SMTP          | \`587\`                   |
| \`SMTP_USER\`          | Usuario SMTP         | \`email@gmail.com\`       |
| \`SMTP_PASS\`          | Contraseña SMTP      | \`app-password\`          |
| \`TEST_MODE\`          | Modo de prueba       | \`true\`                  |
| \`TEST_EMAIL\`         | Email para testing   | \`test@email.com\`        |
| \`DEBUG_LOGS\`         | Logs detallados      | \`true\`                  |
| \`ALLOWED_ORIGINS\`    | Dominios CORS        | \`http://localhost:3000\` |
| \`RATE_LIMIT_ENABLED\` | Rate limiting        | \`true\`                  |

## 📝 Scripts disponibles

- \`npm run dev\` - Desarrollo con hot reload
- \`npm run build\` - Build para producción
- \`npm start\` - Ejecutar en producción
- \`npm run test\` - Ejecutar tests (por implementar)

## ⚠️ Notas importantes

1. **Gmail SMTP**: Usa "App Passwords", no tu contraseña normal
2. **CORS**: Configura \`ALLOWED_ORIGINS\` en producción
3. **Rate Limiting**: Actívalo en producción para evitar spam
4. **Logs**: Revisa la consola para debugging
5. **SSL**: Usa HTTPS en producción siempre

## 🔗 Integración con Frontend

El frontend debe apuntar a este backend:

\`\`\`typescript
// En el frontend React
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Enviar formulario de contacto
const response = await fetch(\`\${API_BASE_URL}/api/contact\`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(formData)
});
\`\`\`
