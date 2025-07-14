# Script para probar la corrección del webhook de Telegram
# =====================================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

Write-Host "PROBANDO CORRECCION DEL WEBHOOK DE TELEGRAM" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Configuración
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$WEBHOOK_URL = "$BACKEND_URL/api/chat/telegram/webhook"
$BOT_TOKEN = "7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM"

try {
    Write-Host "PASO 1: Verificar estado del backend" -ForegroundColor Cyan
    Write-Host "-------------------------------------" -ForegroundColor Cyan
    
    $healthResponse = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method GET -TimeoutSec 10
    
    if ($healthResponse.success) {
        Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
        Write-Host "   Timestamp: $($healthResponse.data.timestamp)" -ForegroundColor White
        Write-Host "   Environment: $($healthResponse.data.environment)" -ForegroundColor White
    } else {
        Write-Host "❌ Backend no responde correctamente" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "PASO 2: Verificar configuración del webhook en Telegram" -ForegroundColor Cyan
    Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
    
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" -Method GET
    
    if ($webhookInfo.ok) {
        Write-Host "✅ Webhook configurado en Telegram:" -ForegroundColor Green
        Write-Host "   URL: $($webhookInfo.result.url)" -ForegroundColor White
        Write-Host "   Actualizaciones pendientes: $($webhookInfo.result.pending_update_count)" -ForegroundColor White
        
        if ($webhookInfo.result.last_error_date) {
            Write-Host "⚠️  Último error: $($webhookInfo.result.last_error_message)" -ForegroundColor Yellow
            Write-Host "   Fecha del error: $(Get-Date -UnixTimeSeconds $webhookInfo.result.last_error_date)" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Sin errores reportados" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "PASO 3: Simular webhook de Telegram" -ForegroundColor Cyan
    Write-Host "------------------------------------" -ForegroundColor Cyan
    
    # Simular un mensaje de Telegram con estructura correcta
    $telegramWebhook = @{
        update_id = 123456789
        message = @{
            message_id = 1001
            from = @{
                id = 6111613750
                is_bot = $false
                first_name = "Admin"
                username = "admin_test"
            }
            chat = @{
                id = 6111613750
                first_name = "Admin"
                username = "admin_test"
                type = "private"
            }
            date = [int][double]::Parse((Get-Date -UFormat %s))
            text = "ID: chat_test_session_123 Hola, este es un mensaje de prueba desde Telegram"
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Host "Enviando webhook simulado..." -ForegroundColor White
    
    $webhookBytes = [System.Text.Encoding]::UTF8.GetBytes($telegramWebhook)
    $webhookResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $webhookBytes -ContentType "application/json; charset=utf-8" -TimeoutSec 10
    
    if ($webhookResponse.success) {
        Write-Host "✅ Webhook procesado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error procesando webhook: $($webhookResponse.error)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "PASO 4: Probar múltiples webhooks (test de rate limiting)" -ForegroundColor Cyan
    Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
    
    $successCount = 0
    $errorCount = 0
    
    for ($i = 1; $i -le 5; $i++) {
        Write-Host "Enviando webhook $i/5..." -ForegroundColor White
        
        $testWebhook = @{
            update_id = 123456789 + $i
            message = @{
                message_id = 1001 + $i
                from = @{
                    id = 6111613750
                    is_bot = $false
                    first_name = "Admin"
                    username = "admin_test"
                }
                chat = @{
                    id = 6111613750
                    first_name = "Admin"
                    username = "admin_test"
                    type = "private"
                }
                date = [int][double]::Parse((Get-Date -UFormat %s))
                text = "ID: chat_test_session_$i Mensaje de prueba número $i"
            }
        } | ConvertTo-Json -Depth 10
        
        try {
            $testBytes = [System.Text.Encoding]::UTF8.GetBytes($testWebhook)
            $testResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $testBytes -ContentType "application/json; charset=utf-8" -TimeoutSec 5
            
            if ($testResponse.success) {
                $successCount++
                Write-Host "  ✅ Webhook $i procesado" -ForegroundColor Green
            } else {
                $errorCount++
                Write-Host "  ❌ Error en webhook $i" -ForegroundColor Red
            }
        } catch {
            $errorCount++
            if ($_.Exception.Message -like "*429*" -or $_.Exception.Message -like "*Too Many Requests*") {
                Write-Host "  ❌ Rate limit alcanzado en webhook $i" -ForegroundColor Red
            } else {
                Write-Host "  ❌ Error en webhook $i`: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host ""
    Write-Host "RESULTADOS DEL TEST" -ForegroundColor Yellow
    Write-Host "===================" -ForegroundColor Yellow
    Write-Host "Webhooks exitosos: $successCount/5" -ForegroundColor $(if ($successCount -eq 5) { 'Green' } else { 'Yellow' })
    Write-Host "Webhooks con error: $errorCount/5" -ForegroundColor $(if ($errorCount -eq 0) { 'Green' } else { 'Red' })
    
    if ($successCount -eq 5) {
        Write-Host ""
        Write-Host "🎉 WEBHOOK FUNCIONANDO CORRECTAMENTE" -ForegroundColor Green
        Write-Host "===================================" -ForegroundColor Green
        Write-Host "✅ Backend responde" -ForegroundColor Green
        Write-Host "✅ Webhook configurado" -ForegroundColor Green
        Write-Host "✅ Rate limiting corregido" -ForegroundColor Green
        Write-Host "✅ Múltiples webhooks procesados" -ForegroundColor Green
        Write-Host ""
        Write-Host "Ahora puedes probar enviando un mensaje real desde Telegram." -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "⚠️  PROBLEMAS DETECTADOS" -ForegroundColor Yellow
        Write-Host "========================" -ForegroundColor Yellow
        
        if ($errorCount -gt 0) {
            Write-Host "- Algunos webhooks fallaron" -ForegroundColor Red
            Write-Host "- Verifica los logs del backend en Railway" -ForegroundColor White
            Write-Host "- Asegúrate de que las variables de entorno estén actualizadas" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "❌ Error durante las pruebas: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "- Backend no disponible" -ForegroundColor White
    Write-Host "- Rate limiting aún activo" -ForegroundColor White
    Write-Host "- Variables de entorno no actualizadas en Railway" -ForegroundColor White
    Write-Host "- Problemas de conectividad" -ForegroundColor White
}

Write-Host ""
Write-Host ""
Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Si hay errores, actualiza las variables en Railway Dashboard" -ForegroundColor White
Write-Host "2. Redeploy el backend si es necesario" -ForegroundColor White
Write-Host "3. Prueba enviando un mensaje real desde Telegram" -ForegroundColor White
Write-Host "4. Verifica que el mensaje llegue al chatbot web" -ForegroundColor White

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")