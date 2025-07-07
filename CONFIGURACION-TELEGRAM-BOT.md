# 🤖 CONFIGURACIÓN DE TELEGRAM BOT PARA PLANIX

## 📋 Guía Paso a Paso para Conectar Telegram al Chatbot

Esta guía te ayudará a configurar completamente la integración de Telegram con el chatbot de Planix para recibir notificaciones y gestionar conversaciones desde Telegram.

---

## 🎯 **PASO 1: CREAR EL BOT DE TELEGRAM**

### 1.1 Acceder a BotFather

1. Abre Telegram (web, móvil o desktop)
2. Busca y abre una conversación con **@BotFather**
3. Inicia la conversación enviando `/start`

### 1.2 Crear el Bot

1. Envía el comando: `/newbot`
2. BotFather te pedirá un **nombre** para tu bot:
   ```
   Ejemplo: Planix Assistant
   ```
3. Luego te pedirá un **username** (debe terminar en 'bot'):
   ```
   Ejemplo: planix_assistant_bot
   ```
4. **¡IMPORTANTE!** BotFather **token**. 7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM
   ```
    7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM
   ```

### 1.3 Configurar el Bot (Opcional)

```
/setdescription - Descripción del bot
/setabouttext - Texto "Acerca de"
/setuserpic - Foto de perfil
/setcommands - Comandos disponibles
```

---

## 🔧 **PASO 2: OBTENER CHAT IDS DE ADMINISTRADORES**

### 2.1 Obtener tu Chat ID

1. Busca y abre **@userinfobot** en Telegram
2. Envía `/start`
3. El bot te responderá con tu **Chat ID**:
   `Id: 6111613750
   First: Facundo
   Last: Alvarez
   Lang: es

   ```

   ```

### 2.2 Crear Grupo de Administradores (Recomendado)

1. Crea un **grupo** en Telegram
2. Añade tu bot al grupo:
   - Ir a configuración del grupo
   - "Añadir miembros"
   - Buscar tu bot y añadirlo
3. **Hacer administrador al bot:**
   - Configuración → Administradores
   - Añadir tu bot como administrador
4. **Obtener Chat ID del grupo (3 métodos):**

   **MÉTODO 1: Con getUpdates (Más fácil)**

   - Envía cualquier mensaje en el grupo donde está tu bot
   - Ve a esta URL en tu navegador (reemplaza TOKEN por tu token real):
     ```
     https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getUpdates
     ```
   - Busca en la respuesta JSON el campo `"chat":{"id":-XXXXXXX}`
   - El Chat ID del grupo será **negativo** (ejemplo: -123456789)

   **MÉTODO 2: Con @userinfobot en el grupo**

   - Añade **@userinfobot** al grupo
   - Escribe `/start` en el grupo
   - El bot responderá con la información del grupo incluyendo el Chat ID

   **MÉTODO 3: Reenviar mensaje**

   - Reenvía cualquier mensaje del grupo a **@userinfobot**
   - Te responderá con toda la información incluyendo el Chat ID del grupo original

   ```
   Ejemplo de Chat ID de grupo: -1001234567890
   ```

---

## 🚀 **GUÍA RÁPIDA: OBTENER CHAT ID DEL GRUPO**

### Método Más Fácil (Paso a Paso):

1. **Crea un grupo** en Telegram
2. **Añade tu bot** al grupo (busca: @tu_bot_username)
3. **Haz al bot administrador** del grupo
4. **Envía cualquier mensaje** en el grupo (ejemplo: "Hola bot")
5. **Abre esta URL** en tu navegador:
   ```
   https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getUpdates
   ```
6. **Busca en el JSON** el número negativo que aparece como `"id":`
   ```json
   "chat": {
     "id": -1001234567890  ← Este es tu Chat ID del grupo
   }
   ```
7. **Copia ese número** (incluye el signo menos)

### Configuración Final en .env:

```env
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM
TELEGRAM_ADMIN_CHAT_IDS=6111613750,-1002781646438
```

✅ **¡Ya tienes todos los datos necesarios!**

- **Tu Chat ID personal:** `6111613750`
- **Chat ID del grupo:** `-1002781646438`
- **Nombre del grupo:** "Facundo & Planix.Devteam, Damián Filo"

---

### 3.1 Editar el archivo `.env`

Abre el archivo `backend/.env` y actualiza estas variables:

```env
# ===========================================
# CONFIGURACIÓN DE TELEGRAM
# ===========================================
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM
TELEGRAM_ADMIN_CHAT_IDS=6111613750,-1002781646438
TELEGRAM_WEBHOOK_URL=https://tu-dominio.com/api/chat/telegram/webhook
```

### 3.2 Explicación de Variables

| Variable                  | Descripción                    | Ejemplo                      |
| ------------------------- | ------------------------------ | ---------------------------- |
| `TELEGRAM_ENABLED`        | Activar/desactivar Telegram    | `true`                       |
| `TELEGRAM_BOT_TOKEN`      | Token del bot de BotFather     | `123456789:ABC...`           |
| `TELEGRAM_ADMIN_CHAT_IDS` | IDs separados por comas        | `123456789,-987654321`       |
| `TELEGRAM_WEBHOOK_URL`    | URL para webhooks (producción) | `https://planix.com/api/...` |

---

## 🌐 **PASO 4: CONFIGURAR WEBHOOKS (PRODUCCIÓN)**

### 4.1 Para Desarrollo Local

```bash
# No necesitas configurar webhooks para desarrollo local
# El sistema funciona con polling automático
```

### 4.2 Para Producción (Railway/Heroku/etc.)

1. **Obtener URL de producción:**

   ```
   Ejemplo: https://planix-backend.railway.app
   ```

2. **Configurar webhook manualmente:**

   ```bash
   curl -X POST "https://api.telegram.org/bot[TOKEN]/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url":"https://tu-dominio.com/api/chat/telegram/webhook"}'
   ```

3. **O usar script automático** (crear archivo `setup-telegram.js`):

   ```javascript
   const TOKEN = "tu-token-aqui";
   const WEBHOOK_URL = "https://tu-dominio.com/api/chat/telegram/webhook";

   fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ url: WEBHOOK_URL }),
   })
     .then((response) => response.json())
     .then((data) => console.log("Webhook configurado:", data));
   ```

---

## 🧪 **PASO 5: PROBAR LA CONFIGURACIÓN**

### 5.1 Verificar Token (Con tu token real)

**Para Linux/Mac (bash):**

```bash
curl "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getMe"
```

**Para Windows (PowerShell):**

```powershell
Invoke-RestMethod -Uri "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getMe"
```

**Respuesta esperada:**

```json
{
  "ok": true,
  "result": {
    "id": 7764815323,
    "is_bot": true,
    "first_name": "Tu bot name",
    "username": "tu_bot_username"
  }
}
```

### 5.2 Obtener Chat ID del Grupo (Comando listo)

1. **Primero envía un mensaje en tu grupo**
2. **Luego ejecuta este comando:**

**Para Linux/Mac (bash):**

```bash
curl "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getUpdates"
```

**Para Windows (PowerShell):**

```powershell
Invoke-RestMethod -Uri "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/getUpdates"
```

3. **Busca en la respuesta** algo como:

```json
{
  "message": {
    "chat": {
      "id": -1001234567890,  ← Este es el Chat ID del grupo
      "title": "Nombre de tu grupo",
      "type": "supergroup"
    }
  }
}
```

### 5.3 Probar Envío de Mensaje

**A tu Chat ID personal (6111613750):**

**Para Linux/Mac (bash):**

```bash
curl -X POST "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id":"6111613750","text":"¡Prueba desde el bot de Planix!"}'
```

**Para Windows (PowerShell) - VERSIÓN CORREGIDA:**

```powershell
# Forzar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$body = @{
    chat_id = "6111613750"
    text = "Prueba desde el bot de Planix!"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/sendMessage" -Method POST -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
```

**Al grupo (-1002781646438):**

**Para Linux/Mac (bash):**

```bash
curl -X POST "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id":"-1002781646438","text":"¡Prueba desde el bot de Planix al grupo!"}'
```

**Para Windows (PowerShell) - VERSIÓN CORREGIDA:**

```powershell
# Forzar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$body = @{
    chat_id = "-1002781646438"
    text = "Prueba desde el bot de Planix al grupo!"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://api.telegram.org/bot7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM/sendMessage" -Method POST -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
```

### 5.4 Script Automático de Pruebas (Recomendado)

**Para facilitar las pruebas, usa este script PowerShell:**

```powershell
.\test-telegram-bot.ps1
```

Este script automatiza todas las pruebas y te da un reporte completo del estado del bot.

### 5.5 Verificar en el Backend

1. Reinicia el servidor backend
2. Revisa los logs:
   ```
   🤖 [TELEGRAM] Servicio inicializado
   🤖 [TELEGRAM] Bot conectado: planix_assistant_bot
   🤖 [TELEGRAM] Admins configurados: 2
   ```

---

## 🚀 **PASO 6: FUNCIONALIDADES DISPONIBLES**

### 6.1 Notificaciones Automáticas

- ✅ **Nuevas conversaciones**: Notifica cuando un usuario inicia chat
- ✅ **Mensajes de usuarios**: Reenvía mensajes al grupo de admins
- ✅ **Resumen de sesiones**: Estado de conversaciones activas

### 6.2 Comandos del Bot (Futuro)

```
/start - Información del bot
/help - Lista de comandos
/sessions - Ver sesiones activas
/stats - Estadísticas del chat
/broadcast - Enviar mensaje a todos los usuarios
```

### 6.3 Respuestas desde Telegram

- Los admins pueden responder directamente desde Telegram
- Las respuestas se envían automáticamente al chat web
- Sistema de threading para múltiples conversaciones

---

## ⚠️ **PASO 7: SOLUCIÓN DE PROBLEMAS**

### 7.1 Problemas Comunes

| Problema           | Causa                   | Solución                   |
| ------------------ | ----------------------- | -------------------------- |
| "Unauthorized"     | Token incorrecto        | Verificar el token en .env |
| "Chat not found"   | Chat ID incorrecto      | Verificar Chat IDs         |
| "Bot blocked"      | Usuario bloqueó el bot  | Pedir que lo desbloquee    |
| No recibe mensajes | Webhook mal configurado | Verificar URL y HTTPS      |

### 7.2 Verificar Configuración

```bash
# Verificar información del bot
curl "https://api.telegram.org/bot[TOKEN]/getMe"

# Verificar webhook
curl "https://api.telegram.org/bot[TOKEN]/getWebhookInfo"

# Eliminar webhook (para desarrollo)
curl -X POST "https://api.telegram.org/bot[TOKEN]/deleteWebhook"
```

### 7.3 Logs Útiles

```bash
# En el backend, buscar estos logs:
🤖 [TELEGRAM] Servicio inicializado
🤖 [TELEGRAM] Mensaje enviado a admin
🤖 [TELEGRAM] Webhook recibido
❌ [TELEGRAM] Error: [descripción]
```

---

## 🔐 **PASO 8: SEGURIDAD Y MEJORES PRÁCTICAS**

### 8.1 Seguridad del Token

- ✅ **Nunca** subas el token a repositorios públicos
- ✅ Usa variables de entorno
- ✅ Regenera el token si se compromete:
  ```
  /revoke en BotFather
  /newtoken para generar uno nuevo
  ```

### 8.2 Validación de Webhooks

```javascript
// El backend ya incluye validación automática
// Verifica que los mensajes vengan realmente de Telegram
```

### 8.3 Rate Limiting

```env
# En .env, configurar límites:
TELEGRAM_RATE_LIMIT=30  # mensajes por minuto
TELEGRAM_ADMIN_ONLY=true  # solo admins pueden usar comandos
```

---

## 📊 **PASO 9: MONITOREO Y MÉTRICAS**

### 9.1 Métricas Disponibles

- Número de mensajes enviados/recibidos
- Tiempo de respuesta de admins
- Sesiones activas por período
- Errores de envío

### 9.2 Dashboard (Futuro)

- Panel web para gestionar conversaciones
- Estadísticas en tiempo real
- Configuración avanzada del bot

---

## ✅ **CHECKLIST FINAL**

Antes de ir a producción, verifica que tengas:

- [ ] **Bot creado** en BotFather
- [ ] **Token guardado** en .env
- [ ] **Chat IDs obtenidos** y configurados
- [ ] **Backend configurado** con variables Telegram
- [ ] **Webhook configurado** (solo producción)
- [ ] **Pruebas realizadas** y funcionando
- [ ] **Grupo de admins** creado y bot añadido
- [ ] **Permisos de administrador** dados al bot
- [ ] **Mensajes de prueba** enviados exitosamente

---

## 🆘 **SOPORTE Y AYUDA**

Si tienes problemas:

1. **Revisa los logs** del backend
2. **Verifica las variables** de entorno
3. **Usa los comandos de verificación** de esta guía
4. **Consulta la documentación** de Telegram Bot API
5. **Prueba en modo desarrollo** antes de producción

---

## 📚 **RECURSOS ADICIONALES**

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Webhook Guide](https://core.telegram.org/bots/webhooks)
- [Telegram Bot Examples](https://core.telegram.org/bots/samples)

---

**¡Tu bot de Telegram está listo para Planix! 🎉**
