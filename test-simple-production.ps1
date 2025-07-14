# Test simple con producción
$backendUrl = "https://planix-backend-node-production.up.railway.app"

Write-Host "=== TEST TELEGRAM WEBHOOK PRODUCCION ==="

# 1. Health check
Write-Host "1. Verificando backend..."
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "Backend OK: $($health.message)"
} catch {
    Write-Host "Backend no disponible"
    exit
}

# 2. Crear sesión enviando un mensaje inicial
Write-Host "2. Creando sesion..."
try {
    $messageBody = @{
        message = "Hola, iniciando test"
        userName = "TestUser"
    } | ConvertTo-Json
    
    $session = Invoke-RestMethod -Uri "$backendUrl/api/chat/message" -Method POST -ContentType "application/json" -Body $messageBody
    Write-Host "Sesion: $($session.data.sessionId)"
    $sessionId = $session.data.sessionId
} catch {
    Write-Host "Error creando sesion: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
    # Usar un sessionId de prueba
    $sessionId = "chat_test_session_123"
    Write-Host "Usando sessionId de prueba: $sessionId"
}

# 3. Webhook simple
Write-Host "3. Enviando webhook..."
$webhook = @{
    message = @{
        message_id = 123
        from = @{ id = 6111613750; is_bot = $false; first_name = "Test" }
        chat = @{ id = -1002781646438; type = "group" }
        date = 1672531200
        text = "$sessionId Hola desde test de webhook"
    }
} | ConvertTo-Json -Depth 5

try {
    Invoke-RestMethod -Uri "$backendUrl/api/chat/telegram/webhook" -Method POST -ContentType "application/json" -Body $webhook
    Write-Host "Webhook enviado"
} catch {
    Write-Host "Error webhook: $($_.Exception.Message)"
}

# 4. Verificar sesión
Write-Host "4. Verificando mensajes..."
Start-Sleep 2
try {
    $check = Invoke-RestMethod -Uri "$backendUrl/api/chat/session/$sessionId" -Method GET
    $adminMsgs = $check.messages | Where-Object { $_.sender -eq "admin" }
    
    Write-Host "Total mensajes: $($check.messages.Count)"
    Write-Host "Mensajes admin: $($adminMsgs.Count)"
    
    if ($adminMsgs.Count -gt 0) {
        Write-Host "EXITO: Mensaje admin agregado"
    } else {
        Write-Host "FALLO: Sin mensajes admin"
    }
} catch {
    Write-Host "Error verificando: $($_.Exception.Message)"
}

Write-Host "=== FIN TEST ==="