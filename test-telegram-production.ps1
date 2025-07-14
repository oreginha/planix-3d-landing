# Test con backend de producción en Railway
$backendUrl = "https://planix-backend-node-production.up.railway.app"
$authorizedChatId = -1002781646438  # Usar el primer ID autorizado

Write-Host "Probando webhook con backend de producción..."

# 1. Verificar que el backend esté funcionando
try {
    $healthCheck = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "✅ Backend funcionando: $($healthCheck.message)"
} catch {
    Write-Host "❌ Error conectando al backend: $($_.Exception.Message)"
    exit 1
}

# 2. Crear una sesión real
try {
    $sessionResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/session" -Method POST -ContentType "application/json" -Body '{}'
    $sessionId = $sessionResponse.sessionId
    Write-Host "Sesión creada: $sessionId"
} catch {
    Write-Host "❌ Error creando sesión: $($_.Exception.Message)"
    exit 1
}

# 3. Probar webhook con chat ID autorizado
$webhookData = @{
    message = @{
        message_id = 123
        from = @{
            id = 6111613750
            is_bot = $false
            first_name = "Admin"
            username = "admin"
        }
        chat = @{
            id = $authorizedChatId
            type = "group"
        }
        date = [int][double]::Parse((Get-Date -UFormat %s))
        text = "$sessionId Mensaje de prueba desde admin autorizado en producción"
    }
}

$webhookJson = $webhookData | ConvertTo-Json -Depth 10
Write-Host "Enviando webhook con chat autorizado..."
Write-Host "Chat ID: $authorizedChatId"
Write-Host "Mensaje: $($webhookData.message.text)"

try {
    $webhookResponse = Invoke-RestMethod -Uri "$backendUrl/api/telegram/webhook" -Method POST -ContentType "application/json" -Body $webhookJson
    Write-Host "✅ Webhook enviado exitosamente"
} catch {
    Write-Host "❌ Error en webhook: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}

# 4. Verificar si el mensaje se agregó a la sesión
Start-Sleep -Seconds 3
try {
    $sessionCheck = Invoke-RestMethod -Uri "$backendUrl/api/chat/session/$sessionId" -Method GET
    $adminMessages = $sessionCheck.messages | Where-Object { $_.sender -eq "admin" }
    
    if ($adminMessages.Count -gt 0) {
        Write-Host "✅ Mensaje admin agregado exitosamente!"
        Write-Host "Mensajes admin encontrados: $($adminMessages.Count)"
        $adminMessages | ForEach-Object {
            Write-Host "  - $($_.message)"
        }
    } else {
        Write-Host "❌ Mensaje admin NO agregado"
        Write-Host "Total mensajes en sesión: $($sessionCheck.messages.Count)"
        Write-Host "Mensajes en la sesión:"
        $sessionCheck.messages | ForEach-Object {
            Write-Host "  [$($_.sender)]: $($_.message)"
        }
    }
} catch {
    Write-Host "❌ Error verificando sesión: $($_.Exception.Message)"
}

Write-Host "Test completado"