# Test detallado con producción
$backendUrl = "https://planix-backend-node-production.up.railway.app"

Write-Host "=== TEST DETALLADO TELEGRAM WEBHOOK PRODUCCION ==="

# 1. Health check
Write-Host "1. Verificando backend..."
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "Backend OK: $($health.message)"
} catch {
    Write-Host "Backend no disponible: $($_.Exception.Message)"
    exit
}

# 2. Crear sesión enviando un mensaje inicial
Write-Host "2. Creando sesion..."
try {
    $messageBody = @{
        message = "Hola, iniciando test detallado"
        userName = "TestUser"
    } | ConvertTo-Json
    
    $session = Invoke-RestMethod -Uri "$backendUrl/api/chat/message" -Method POST -ContentType "application/json" -Body $messageBody
    Write-Host "Sesion creada: $($session.data.sessionId)"
    Write-Host "Mensaje inicial: $($session.data.userMessage.message)"
    if ($session.data.botResponse) {
        Write-Host "Respuesta bot: $($session.data.botResponse.message)"
    }
    $sessionId = $session.data.sessionId
} catch {
    Write-Host "Error creando sesion: $($_.Exception.Message)"
    exit
}

# 3. Verificar sesión antes del webhook
Write-Host "3. Verificando sesion antes del webhook..."
try {
    $checkBefore = Invoke-RestMethod -Uri "$backendUrl/api/chat/session/$sessionId" -Method GET
    Write-Host "Mensajes antes: $($checkBefore.data.messages.Count)"
    foreach ($msg in $checkBefore.data.messages) {
        Write-Host "  - $($msg.sender): $($msg.message)"
    }
} catch {
    Write-Host "Error verificando sesion: $($_.Exception.Message)"
}

# 4. Webhook con mensaje que incluye sessionId
Write-Host "4. Enviando webhook con sessionId..."
$webhookMessage = "$sessionId Respuesta desde Telegram de prueba"
Write-Host "Mensaje webhook: $webhookMessage"

$webhook = @{
    message = @{
        message_id = 123
        from = @{ 
            id = 6111613750
            is_bot = $false
            first_name = "TestAdmin"
            username = "testadmin"
        }
        chat = @{ 
            id = -1002781646438
            type = "group"
        }
        date = [int][double]::Parse((Get-Date -UFormat %s))
        text = $webhookMessage
    }
} | ConvertTo-Json -Depth 5

Write-Host "JSON webhook:"
Write-Host $webhook

try {
    $webhookResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/telegram/webhook" -Method POST -ContentType "application/json" -Body $webhook
    Write-Host "Webhook enviado exitosamente"
    Write-Host "Respuesta: $($webhookResponse | ConvertTo-Json)"
} catch {
    Write-Host "Error webhook: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}

# 5. Esperar y verificar sesión después del webhook
Write-Host "5. Esperando procesamiento..."
Start-Sleep 5

Write-Host "6. Verificando mensajes después del webhook..."
try {
    $checkAfter = Invoke-RestMethod -Uri "$backendUrl/api/chat/session/$sessionId" -Method GET
    $adminMsgs = $checkAfter.data.messages | Where-Object { $_.sender -eq "admin" }
    
    Write-Host "Total mensajes después: $($checkAfter.data.messages.Count)"
    Write-Host "Mensajes admin: $($adminMsgs.Count)"
    
    Write-Host "Todos los mensajes:"
    foreach ($msg in $checkAfter.data.messages) {
        Write-Host "  - $($msg.sender) [$($msg.timestamp)]: $($msg.message)"
    }
    
    if ($adminMsgs.Count -gt 0) {
        Write-Host "EXITO: Mensaje admin agregado correctamente"
        Write-Host "Mensaje admin: $($adminMsgs[0].message)"
    } else {
        Write-Host "FALLO: Sin mensajes admin después del webhook"
    }
} catch {
    Write-Host "Error verificando después: $($_.Exception.Message)"
}

Write-Host "=== FIN TEST DETALLADO ==="