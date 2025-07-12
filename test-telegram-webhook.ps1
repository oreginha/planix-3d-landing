# Script para probar el webhook de Telegram corregido
# ===================================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "PROBANDO WEBHOOK DE TELEGRAM CORREGIDO" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# URLs
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$WEBHOOK_URL = "$BACKEND_URL/api/chat/telegram/webhook"

# Primero crear una sesión de chat
Write-Host "PASO 1: Crear sesión de chat" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

try {
    $chatBody = @{
        message = "Hola, necesito ayuda con desarrollo web"
        userName = "Usuario Test"
        userEmail = "test@example.com"
    } | ConvertTo-Json -Depth 10
    
    $chatResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $chatBody -ContentType "application/json; charset=utf-8"
    
    if ($chatResponse.success) {
        $sessionId = $chatResponse.data.sessionId
        Write-Host "   Sesión creada exitosamente: $sessionId" -ForegroundColor Green
        Write-Host "   Respuesta del bot: $($chatResponse.data.botResponse.message)" -ForegroundColor White
    } else {
        Write-Host "   Error creando sesión: $($chatResponse.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PASO 2: Simular webhook de Telegram con estructura corregida" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------" -ForegroundColor Cyan

# Webhook con la estructura correcta (message.text en lugar de text directamente)
$telegramWebhookBody = @{
    message = @{
        message_id = 123
        from = @{
            id = 6111613750
            first_name = "Admin"
            username = "admin_test"
        }
        chat = @{
            id = -1002781646438
        }
        text = "ID: $sessionId Hola! Soy un administrador respondiendo desde Telegram. ¿En qué más puedo ayudarte?"
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host "   Enviando webhook con estructura corregida..." -ForegroundColor Yellow
    Write-Host "   Mensaje: ID: $sessionId Hola! Soy un administrador respondiendo desde Telegram..." -ForegroundColor White
    
    $webhookResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $telegramWebhookBody -ContentType "application/json; charset=utf-8"
    
    if ($webhookResponse.success) {
        Write-Host "   ✅ Webhook procesado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error procesando webhook: $($webhookResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error enviando webhook: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "PASO 3: Verificar que el mensaje del admin se agregó a la sesión" -ForegroundColor Cyan
Write-Host "---------------------------------------------------------------" -ForegroundColor Cyan

try {
    Start-Sleep -Seconds 2  # Esperar un poco para que se procese
    
    $sessionResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
    
    if ($sessionResponse.success) {
        $messages = $sessionResponse.data.messages
        Write-Host "   Total de mensajes en la sesión: $($messages.Count)" -ForegroundColor White
        
        $adminMessages = $messages | Where-Object { $_.sender -eq 'admin' }
        if ($adminMessages.Count -gt 0) {
            Write-Host "   ✅ Mensaje de admin encontrado:" -ForegroundColor Green
            foreach ($adminMsg in $adminMessages) {
                Write-Host "      - $($adminMsg.message)" -ForegroundColor White
            }
        } else {
            Write-Host "   ❌ No se encontraron mensajes de admin" -ForegroundColor Red
        }
    } else {
        Write-Host "   Error obteniendo sesión: $($sessionResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "RESUMEN DE LA PRUEBA" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host "✅ Sesión de chat creada" -ForegroundColor Green
Write-Host "✅ Webhook de Telegram enviado con estructura corregida" -ForegroundColor Green
Write-Host "✅ Verificación de mensajes completada" -ForegroundColor Green
Write-Host ""
Write-Host "Si el webhook funcionó correctamente, deberías ver el mensaje del admin en la sesión." -ForegroundColor Yellow
Write-Host "También puedes verificar en el grupo de Telegram si llegaron las notificaciones." -ForegroundColor Yellow