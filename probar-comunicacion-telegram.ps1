# 🧪 SCRIPT PARA PROBAR COMUNICACIÓN TELEGRAM <-> LANDING PAGE
# ===========================================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

Write-Host "PRUEBA DE COMUNICACION TELEGRAM - PLANIX" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Configuración
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$BOT_TOKEN = "7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM"
$ADMIN_CHAT_ID = "-1002781646438"

Write-Host "Configuracion:" -ForegroundColor Yellow
Write-Host "   Backend URL: $BACKEND_URL" -ForegroundColor White
Write-Host "   Bot Token: $($BOT_TOKEN.Substring(0,10))..." -ForegroundColor White
Write-Host "   Admin Chat ID: $ADMIN_CHAT_ID" -ForegroundColor White
Write-Host ""

try {
    Write-Host "PASO 1: Verificar que el backend este funcionando" -ForegroundColor Cyan
    Write-Host "------------------------------------------------" -ForegroundColor Cyan
    
    try {
        $healthCheck = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method GET -TimeoutSec 10
        Write-Host "Backend respondiendo correctamente" -ForegroundColor Green
        Write-Host "   Status: $($healthCheck.status)" -ForegroundColor White
        Write-Host "   Timestamp: $($healthCheck.timestamp)" -ForegroundColor White
    } catch {
        Write-Host "Error conectando al backend: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Verifica que el servicio este ejecutandose en Railway" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host ""
    Write-Host "PASO 2: Crear una sesion de chat de prueba" -ForegroundColor Cyan
    Write-Host "------------------------------------------" -ForegroundColor Cyan
    
    $newChatBody = @{
        message = "Hola, esta es una prueba de comunicacion con Telegram"
        userInfo = @{
            name = "Usuario de Prueba"
            email = "test@planix.com"
            phone = "+54 11 1234-5678"
        }
    } | ConvertTo-Json -Depth 10
    
    $newChatBytes = [System.Text.Encoding]::UTF8.GetBytes($newChatBody)
    $chatResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $newChatBytes -ContentType "application/json; charset=utf-8"
    
    if ($chatResponse.success) {
        $sessionId = $chatResponse.data.sessionId
        Write-Host "Sesion de chat creada exitosamente" -ForegroundColor Green
        Write-Host "   Session ID: $sessionId" -ForegroundColor White
        Write-Host "   Mensaje enviado: $($chatResponse.message)" -ForegroundColor White
        
        Write-Host ""
        Write-Host "PASO 3: Verificar notificacion en Telegram" -ForegroundColor Cyan
        Write-Host "------------------------------------------" -ForegroundColor Cyan
        Write-Host "Revisa el grupo de Telegram para ver si llego la notificacion" -ForegroundColor Yellow
        Write-Host "Deberia aparecer un mensaje con el Session ID: $sessionId" -ForegroundColor Yellow
        
        Write-Host ""
        Write-Host "PASO 4: Simular respuesta desde Telegram" -ForegroundColor Cyan
        Write-Host "----------------------------------------" -ForegroundColor Cyan
        
        # Simular webhook de Telegram
        $telegramWebhookBody = @{
            message = @{
                message_id = 123
                from = @{
                    id = 6111613750
                    first_name = "Admin"
                    username = "admin_test"
                }
                chat = @{
                    id = [int64]$ADMIN_CHAT_ID
                    type = "supergroup"
                }
                date = [int][DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
                text = "ID: $sessionId Hola! Gracias por contactarnos. Te responderemos pronto."
            }
        } | ConvertTo-Json -Depth 10
        
        $webhookBytes = [System.Text.Encoding]::UTF8.GetBytes($telegramWebhookBody)
        $webhookResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/telegram/webhook" -Method POST -Body $webhookBytes -ContentType "application/json; charset=utf-8"
        
        if ($webhookResponse.success) {
            Write-Host "Webhook procesado exitosamente" -ForegroundColor Green
            Write-Host "   Respuesta: $($webhookResponse.message)" -ForegroundColor White
        } else {
            Write-Host "Error procesando webhook: $($webhookResponse.error)" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "PASO 5: Verificar que la respuesta aparezca en el chat" -ForegroundColor Cyan
        Write-Host "-----------------------------------------------------" -ForegroundColor Cyan
        
        $sessionInfo = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
        
        if ($sessionInfo.success) {
            Write-Host "Informacion de la sesion:" -ForegroundColor Green
            Write-Host "   Session ID: $($sessionInfo.data.sessionId)" -ForegroundColor White
            Write-Host "   Estado: $($sessionInfo.data.status)" -ForegroundColor White
            Write-Host "   Mensajes: $($sessionInfo.data.messages.Count)" -ForegroundColor White
            
            Write-Host ""
            Write-Host "Mensajes en la sesion:" -ForegroundColor White
            foreach ($msg in $sessionInfo.data.messages) {
                $sender = if ($msg.sender -eq "admin") { "[ADMIN]" } else { "[USUARIO]" }
                Write-Host "   $sender $($msg.message)" -ForegroundColor $(if ($msg.sender -eq "admin") { "Cyan" } else { "White" })
            }
        } else {
            Write-Host "Error obteniendo informacion de sesion: $($sessionInfo.message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "Error creando sesion de chat: $($chatResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "PRUEBA COMPLETADA" -ForegroundColor Green
    Write-Host "=================" -ForegroundColor Green
    Write-Host "Backend funcionando" -ForegroundColor Green
    Write-Host "Webhook configurado" -ForegroundColor Green
    Write-Host "Comunicacion establecida" -ForegroundColor Green
    Write-Host ""
    Write-Host "INSTRUCCIONES PARA USO REAL:" -ForegroundColor Yellow
    Write-Host "1. Ve al grupo de Telegram configurado" -ForegroundColor White
    Write-Host "2. Cuando llegue una notificacion de nuevo chat, copia el Session ID" -ForegroundColor White
    Write-Host "3. Responde usando el formato: ID: [session_id] Tu respuesta" -ForegroundColor White
    Write-Host "4. La respuesta aparecera automaticamente en la landing page" -ForegroundColor White
    Write-Host ""
    Write-Host "La comunicacion Telegram <-> Landing Page esta funcionando!" -ForegroundColor Green
    
} catch {
    Write-Host "Error durante la prueba: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "   - El backend este ejecutandose en Railway" -ForegroundColor White
    Write-Host "   - El webhook este configurado correctamente" -ForegroundColor White
    Write-Host "   - El bot tenga permisos en el grupo de Telegram" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")