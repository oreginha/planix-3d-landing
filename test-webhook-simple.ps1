# Script simple para probar el webhook de Telegram

Write-Host 'PROBANDO WEBHOOK DE TELEGRAM' -ForegroundColor Green
Write-Host '============================' -ForegroundColor Green
Write-Host ''

$BACKEND_URL = 'https://planix-backend-node-production.up.railway.app'
$WEBHOOK_URL = "$BACKEND_URL/api/chat/telegram/webhook"

try {
    Write-Host 'PASO 1: Verificar backend' -ForegroundColor Cyan
    $healthResponse = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method GET -TimeoutSec 10
    
    if ($healthResponse.success) {
        Write-Host 'Backend funcionando correctamente' -ForegroundColor Green
        Write-Host "Environment: $($healthResponse.data.environment)" -ForegroundColor White
    } else {
        Write-Host 'Backend no responde correctamente' -ForegroundColor Red
        exit 1
    }
    
    Write-Host ''
    Write-Host 'PASO 2: Probar webhook' -ForegroundColor Cyan
    
    # Simular mensaje de Telegram
    $telegramWebhook = @{
        update_id = 123456789
        message = @{
            message_id = 1001
            from = @{
                id = 6111613750
                is_bot = $false
                first_name = 'Admin'
                username = 'admin_test'
            }
            chat = @{
                id = 6111613750
                first_name = 'Admin'
                username = 'admin_test'
                type = 'private'
            }
            date = [int][double]::Parse((Get-Date -UFormat %s))
            text = 'ID: chat_test_session_123 Hola, este es un mensaje de prueba desde Telegram'
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Host 'Enviando webhook...' -ForegroundColor White
    
    $webhookBytes = [System.Text.Encoding]::UTF8.GetBytes($telegramWebhook)
    $webhookResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $webhookBytes -ContentType 'application/json; charset=utf-8' -TimeoutSec 10
    
    if ($webhookResponse.success) {
        Write-Host 'Webhook procesado exitosamente' -ForegroundColor Green
    } else {
        Write-Host "Error procesando webhook: $($webhookResponse.error)" -ForegroundColor Red
    }
    
    Write-Host ''
    Write-Host 'PASO 3: Test de multiples webhooks' -ForegroundColor Cyan
    
    $successCount = 0
    $errorCount = 0
    
    for ($i = 1; $i -le 3; $i++) {
        Write-Host "Webhook $i/3..." -ForegroundColor White
        
        $testWebhook = @{
            update_id = 123456789 + $i
            message = @{
                message_id = 1001 + $i
                from = @{
                    id = 6111613750
                    is_bot = $false
                    first_name = 'Admin'
                    username = 'admin_test'
                }
                chat = @{
                    id = 6111613750
                    first_name = 'Admin'
                    username = 'admin_test'
                    type = 'private'
                }
                date = [int][double]::Parse((Get-Date -UFormat %s))
                text = "ID: chat_test_session_$i Mensaje de prueba numero $i"
            }
        } | ConvertTo-Json -Depth 10
        
        try {
            $testBytes = [System.Text.Encoding]::UTF8.GetBytes($testWebhook)
            $testResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $testBytes -ContentType 'application/json; charset=utf-8' -TimeoutSec 5
            
            if ($testResponse.success) {
                $successCount++
                Write-Host '  Procesado correctamente' -ForegroundColor Green
            } else {
                $errorCount++
                Write-Host '  Error en procesamiento' -ForegroundColor Red
            }
        } catch {
            $errorCount++
            if ($_.Exception.Message -like '*429*' -or $_.Exception.Message -like '*Too Many Requests*') {
                Write-Host '  Rate limit alcanzado' -ForegroundColor Red
            } else {
                Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host ''
    Write-Host 'RESULTADOS' -ForegroundColor Yellow
    Write-Host '==========' -ForegroundColor Yellow
    Write-Host "Exitosos: $successCount/3" -ForegroundColor $(if ($successCount -eq 3) { 'Green' } else { 'Yellow' })
    Write-Host "Errores: $errorCount/3" -ForegroundColor $(if ($errorCount -eq 0) { 'Green' } else { 'Red' })
    
    if ($successCount -eq 3) {
        Write-Host ''
        Write-Host 'WEBHOOK FUNCIONANDO CORRECTAMENTE' -ForegroundColor Green
        Write-Host 'Rate limiting corregido' -ForegroundColor Green
        Write-Host 'Multiples webhooks procesados' -ForegroundColor Green
        Write-Host ''
        Write-Host 'Ahora puedes probar enviando un mensaje real desde Telegram.' -ForegroundColor White
    } else {
        Write-Host ''
        Write-Host 'PROBLEMAS DETECTADOS' -ForegroundColor Yellow
        Write-Host 'Verifica los logs del backend en Railway' -ForegroundColor White
        Write-Host 'Asegurate de que las variables esten actualizadas' -ForegroundColor White
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ''
    Write-Host 'POSIBLES CAUSAS:' -ForegroundColor Yellow
    Write-Host 'Backend no disponible' -ForegroundColor White
    Write-Host 'Rate limiting aun activo' -ForegroundColor White
    Write-Host 'Variables no actualizadas en Railway' -ForegroundColor White
}

Write-Host ''
Write-Host 'PROXIMOS PASOS:' -ForegroundColor Cyan
Write-Host '1. Actualizar variables en Railway si hay errores' -ForegroundColor White
Write-Host '2. Redeploy el backend si es necesario' -ForegroundColor White
Write-Host '3. Probar mensaje real desde Telegram' -ForegroundColor White
Write-Host '4. Verificar que llegue al chatbot web' -ForegroundColor White