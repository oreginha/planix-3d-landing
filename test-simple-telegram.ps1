# Test simple de Telegram
Write-Host "Probando comunicacion con backend..." -ForegroundColor Green

$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"

# Test 1: Health check
try {
    $health = Invoke-RestMethod -Uri "$BACKEND_URL/api/health" -Method GET
    Write-Host "Backend funcionando: $($health.message)" -ForegroundColor Green
}
catch {
    Write-Host "Error en health check: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Crear sesion
try {
    $chatBody = @{
        userName = "Test User"
        message = "Hola desde PowerShell"
    } | ConvertTo-Json
    
    $chatResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $chatBody -ContentType "application/json"
    $sessionId = $chatResponse.data.sessionId
    
    Write-Host "Sesion creada: $sessionId" -ForegroundColor Green
    
    # Test 3: Webhook de Telegram
    $webhookData = @{
        message = @{
            message_id = 123
            from = @{
                id = 6111613750
                first_name = "Admin"
                username = "admin_test"
            }
            chat = @{
                id = 6111613750
                type = "private"
            }
            date = 1642000000
            text = "$sessionId Respuesta desde Telegram"
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Host "Enviando webhook con mensaje: $sessionId Respuesta desde Telegram" -ForegroundColor Yellow
    
    $webhookResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/telegram/webhook" -Method POST -Body $webhookData -ContentType "application/json"
    Write-Host "Webhook enviado exitosamente" -ForegroundColor Green
    
    # Verificar sesion actualizada
    Start-Sleep -Seconds 2
    $updatedSession = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
    $adminMessages = $updatedSession.data.messages | Where-Object { $_.sender -eq "admin" }
    
    if ($adminMessages.Count -gt 0) {
        Write-Host "Mensaje de admin encontrado: $($adminMessages[-1].message)" -ForegroundColor Green
    } else {
        Write-Host "No se encontro mensaje de admin" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test completado" -ForegroundColor Cyan