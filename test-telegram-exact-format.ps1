# Test con el formato exacto de la imagen de Telegram
Write-Host "Probando con formato exacto de Telegram..." -ForegroundColor Green

$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"

# Crear sesion primero
try {
    $chatBody = @{
        userName = "Test User"
        message = "Hola, necesito ayuda"
    } | ConvertTo-Json
    
    $chatResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $chatBody -ContentType "application/json"
    $sessionId = $chatResponse.data.sessionId
    
    Write-Host "Sesion creada: $sessionId" -ForegroundColor Green
    
    # Probar diferentes formatos como en la imagen
    $testMessages = @(
        "chat_test_session_123 Mensaje de prueba 1",
        "chat_test_session_1 Mensaje de prueba 2", 
        "chat_test_session_2 Mensaje de prueba 3",
        "chat_test_session_3 Mensaje de prueba 4",
        "chat_test_123 Mensaje de prueba 5",
        "$sessionId Mensaje con sesion real"
    )
    
    foreach ($testMsg in $testMessages) {
        Write-Host "\nProbando: $testMsg" -ForegroundColor Yellow
        
        $webhookData = @{
            message = @{
                message_id = (Get-Random -Minimum 100 -Maximum 999)
                from = @{
                    id = 6111613750
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
                text = $testMsg
            }
        } | ConvertTo-Json -Depth 10
        
        try {
            $webhookResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/telegram/webhook" -Method POST -Body $webhookData -ContentType "application/json"
            Write-Host "Webhook enviado OK" -ForegroundColor Green
            
            # Si es la sesion real, verificar
            if ($testMsg.Contains($sessionId)) {
                Start-Sleep -Seconds 1
                try {
                    $updatedSession = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
                    $adminMessages = $updatedSession.data.messages | Where-Object { $_.sender -eq "admin" }
                    
                    if ($adminMessages.Count -gt 0) {
                        Write-Host "✅ Mensaje admin agregado: $($adminMessages[-1].message)" -ForegroundColor Green
                    } else {
                        Write-Host "❌ Mensaje admin NO agregado" -ForegroundColor Red
                    }
                }
                catch {
                    Write-Host "Error verificando sesion: $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
        catch {
            Write-Host "Error webhook: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "Error inicial: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\nTest completado" -ForegroundColor Cyan