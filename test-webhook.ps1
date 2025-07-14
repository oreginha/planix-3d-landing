# Test webhook Telegram
Write-Host 'Probando webhook de Telegram...' -ForegroundColor Green

$url = 'https://planix-backend-node-production.up.railway.app/api/chat/telegram/webhook'

$body = @{
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
        date = 1735243824
        text = 'ID: chat_test_123 Mensaje de prueba desde PowerShell'
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host 'Enviando webhook...' -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType 'application/json'
    
    if ($response.success) {
        Write-Host 'SUCCESS: Webhook procesado correctamente' -ForegroundColor Green
    } else {
        Write-Host 'ERROR: Webhook fallo' -ForegroundColor Red
        Write-Host $response.error -ForegroundColor Red
    }
} catch {
    Write-Host 'ERROR: No se pudo enviar webhook' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host 'Test completado' -ForegroundColor Cyan