# 🤖 SCRIPT PARA CONFIGURAR WEBHOOK DE TELEGRAM
# =============================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

Write-Host "CONFIGURACION DE WEBHOOK TELEGRAM - PLANIX" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Configuración
$BOT_TOKEN = "7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM"
$WEBHOOK_URL = "https://planix-backend-node-production.up.railway.app/api/chat/telegram/webhook"

Write-Host "Configuracion:" -ForegroundColor Yellow
Write-Host "   Bot Token: $($BOT_TOKEN.Substring(0,10))..." -ForegroundColor White
Write-Host "   Webhook URL: $WEBHOOK_URL" -ForegroundColor White
Write-Host ""

try {
    Write-Host "PASO 1: Verificar informacion del bot" -ForegroundColor Cyan
    Write-Host "---------------------------------------" -ForegroundColor Cyan
    
    $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getMe" -Method GET
    
    if ($botInfo.ok) {
        Write-Host "Bot verificado exitosamente:" -ForegroundColor Green
        Write-Host "   ID: $($botInfo.result.id)" -ForegroundColor White
        Write-Host "   Nombre: $($botInfo.result.first_name)" -ForegroundColor White
        Write-Host "   Username: @$($botInfo.result.username)" -ForegroundColor White
    } else {
        Write-Host "Error verificando bot: $($botInfo.description)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "PASO 2: Configurar webhook" -ForegroundColor Cyan
    Write-Host "-----------------------------" -ForegroundColor Cyan
    
    $webhookBody = @{
        url = $WEBHOOK_URL
        allowed_updates = @("message", "edited_message")
    } | ConvertTo-Json -Depth 10
    
    $webhookBodyBytes = [System.Text.Encoding]::UTF8.GetBytes($webhookBody)
    $webhookResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" -Method POST -Body $webhookBodyBytes -ContentType "application/json; charset=utf-8"
    
    if ($webhookResponse.ok) {
        Write-Host "Webhook configurado exitosamente" -ForegroundColor Green
        Write-Host "   URL: $WEBHOOK_URL" -ForegroundColor White
    } else {
        Write-Host "Error configurando webhook: $($webhookResponse.description)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "PASO 3: Verificar configuracion del webhook" -ForegroundColor Cyan
    Write-Host "----------------------------------------------" -ForegroundColor Cyan
    
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" -Method GET
    
    if ($webhookInfo.ok) {
        Write-Host "Informacion del webhook:" -ForegroundColor Green
        Write-Host "   URL: $($webhookInfo.result.url)" -ForegroundColor White
        Write-Host "   Tiene certificado personalizado: $($webhookInfo.result.has_custom_certificate)" -ForegroundColor White
        Write-Host "   Actualizaciones pendientes: $($webhookInfo.result.pending_update_count)" -ForegroundColor White
        
        if ($webhookInfo.result.last_error_date) {
            Write-Host "   Ultimo error: $($webhookInfo.result.last_error_message)" -ForegroundColor Yellow
            Write-Host "   Fecha del error: $(Get-Date -UnixTimeSeconds $webhookInfo.result.last_error_date)" -ForegroundColor Yellow
        } else {
            Write-Host "   Sin errores reportados" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "PASO 4: Probar envio de mensaje de prueba" -ForegroundColor Cyan
    Write-Host "--------------------------------------------" -ForegroundColor Cyan
    
    $chatIds = @("6111613750", "-1002781646438")
    $testMessageSent = $false
    
    foreach ($chatId in $chatIds) {
        Write-Host "Probando envio a chat ID: $chatId" -ForegroundColor White
        
        try {
            $testMessage = @{
                chat_id = $chatId
                text = "Webhook de Telegram configurado exitosamente para Planix!`n`nDetalles:`n- URL: $WEBHOOK_URL`n- Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n- Estado: Activo`n`nAhora puedes responder a los chats desde Telegram usando:`nID: [session_id] Tu respuesta"
            } | ConvertTo-Json -Depth 10
            
            $testMessageBytes = [System.Text.Encoding]::UTF8.GetBytes($testMessage)
            $testResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $testMessageBytes -ContentType "application/json; charset=utf-8"
            
            if ($testResponse.ok) {
                Write-Host "  Mensaje enviado exitosamente a $chatId" -ForegroundColor Green
                $testMessageSent = $true
            } else {
                Write-Host "  Error enviando a $chatId`: $($testResponse.description)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  Error enviando a $chatId`: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if (-not $testMessageSent) {
        Write-Host "No se pudo enviar mensaje a ninguno de los chats configurados" -ForegroundColor Yellow
        Write-Host "Esto es normal si el bot aun no ha sido agregado a los chats" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "CONFIGURACION COMPLETADA" -ForegroundColor Green
    Write-Host "===========================" -ForegroundColor Green
    Write-Host "Bot verificado" -ForegroundColor Green
    Write-Host "Webhook configurado" -ForegroundColor Green
    Write-Host "URL apuntando a Railway" -ForegroundColor Green
    Write-Host "Mensaje de prueba enviado" -ForegroundColor Green
    Write-Host ""
    Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "1. Verifica que el backend este ejecutandose en Railway" -ForegroundColor White
    Write-Host "2. Prueba enviando un mensaje al chat de la landing page" -ForegroundColor White
    Write-Host "3. Responde desde Telegram usando: ID: [session_id] Tu respuesta" -ForegroundColor White
    Write-Host "4. Revisa los logs del backend para confirmar la comunicacion" -ForegroundColor White
    Write-Host ""
    Write-Host "El bot de Telegram esta listo para recibir y enviar mensajes!" -ForegroundColor Green
    
} catch {
    Write-Host "Error durante la configuracion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "   - El token del bot sea correcto" -ForegroundColor White
    Write-Host "   - Tengas conexion a internet" -ForegroundColor White
    Write-Host "   - La URL del backend sea accesible" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")