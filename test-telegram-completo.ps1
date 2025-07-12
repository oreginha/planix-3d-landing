# Test completo de comunicacion Telegram <-> Landing Page
# Este script verifica toda la cadena de comunicacion

Write-Host "TEST COMPLETO TELEGRAM - PLANIX" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host ""

# Configuracion
$backendUrl = "https://planix-backend-node-production.up.railway.app"
$botToken = $env:TELEGRAM_BOT_TOKEN
$adminChatId = "-1002781646438"

if (-not $botToken) {
    # Intentar leer del archivo .env
    $envPath = "backend\.env"
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath
        foreach ($line in $envContent) {
            if ($line -match "TELEGRAM_BOT_TOKEN=(.+)") {
                $botToken = $matches[1]
                break
            }
        }
    }
}

if (-not $botToken) {
    Write-Host "Error: No se pudo obtener el token del bot" -ForegroundColor Red
    exit 1
}

Write-Host "Configuracion:" -ForegroundColor White
Write-Host "   Backend URL: $backendUrl" -ForegroundColor Gray
Write-Host "   Bot Token: $($botToken.Substring(0,10))..." -ForegroundColor Gray
Write-Host "   Admin Chat ID: $adminChatId" -ForegroundColor Gray
Write-Host ""

# Test 1: Verificar backend
Write-Host "TEST 1: Verificar backend" -ForegroundColor Cyan
Write-Host "-------------------------" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/api/health" -Method GET
    Write-Host "Backend funcionando correctamente" -ForegroundColor Green
}
catch {
    Write-Host "Error conectando al backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Verificar bot de Telegram
Write-Host ""
Write-Host "TEST 2: Verificar bot de Telegram" -ForegroundColor Cyan
Write-Host "----------------------------------" -ForegroundColor Cyan
try {
    $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getMe" -Method GET
    if ($botInfo.ok) {
        Write-Host "Bot verificado: @$($botInfo.result.username)" -ForegroundColor Green
    }
    else {
        Write-Host "Error verificando bot" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Error conectando a Telegram API: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Verificar webhook
Write-Host ""
Write-Host "TEST 3: Verificar configuracion de webhook" -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor Cyan
try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo" -Method GET
    if ($webhookInfo.ok) {
        $webhook = $webhookInfo.result
        if ($webhook.url) {
            Write-Host "Webhook configurado: $($webhook.url)" -ForegroundColor Green
            Write-Host "   Actualizaciones pendientes: $($webhook.pending_update_count)" -ForegroundColor Gray
        }
        else {
            Write-Host "Webhook no configurado" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "Error verificando webhook: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Crear sesion de chat
Write-Host ""
Write-Host "TEST 4: Crear sesion de chat en landing page" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan

$chatData = @{
    message = "Test de comunicacion completa desde script"
    userName = "Test User"
    isFirstMessage = $true
} | ConvertTo-Json -Depth 3

try {
    $chatResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/message" -Method POST -Body $chatData -ContentType "application/json"
    
    if ($chatResponse.success) {
        $sessionId = $chatResponse.data.sessionId
        Write-Host "Sesion creada: $sessionId" -ForegroundColor Green
        
        # Esperar un momento para que llegue la notificacion
        Write-Host "   Esperando notificacion en Telegram..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
        
        Write-Host ""
        Write-Host "INSTRUCCIONES PARA COMPLETAR EL TEST:" -ForegroundColor Yellow
        Write-Host "1. Ve al grupo de Telegram: $adminChatId" -ForegroundColor White
        Write-Host "2. Deberias ver una notificacion con el Session ID: $sessionId" -ForegroundColor White
        Write-Host "3. Responde en Telegram con el formato:" -ForegroundColor White
        Write-Host "   ID: $sessionId Hola, esta es mi respuesta de prueba" -ForegroundColor Cyan
        Write-Host "4. Luego presiona ENTER aqui para verificar que llego la respuesta" -ForegroundColor White
        Write-Host ""
        
        Read-Host "Presiona ENTER despues de enviar la respuesta en Telegram"
        
        # Test 5: Verificar respuesta
        Write-Host ""
        Write-Host "TEST 5: Verificar respuesta en la sesion" -ForegroundColor Cyan
        Write-Host "----------------------------------------" -ForegroundColor Cyan
        
        try {
            $sessionInfo = Invoke-RestMethod -Uri "$backendUrl/api/chat/session/$sessionId" -Method GET
            
            if ($sessionInfo.success) {
                Write-Host "Sesion encontrada" -ForegroundColor Green
                Write-Host "   Mensajes totales: $($sessionInfo.data.messages.Count)" -ForegroundColor Gray
                
                $adminMessages = $sessionInfo.data.messages | Where-Object { $_.sender -eq "admin" }
                if ($adminMessages.Count -gt 0) {
                    Write-Host "Respuesta de admin recibida!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "Conversacion completa:" -ForegroundColor White
                    foreach ($msg in $sessionInfo.data.messages) {
                        $sender = if ($msg.sender -eq "admin") { "[ADMIN]" } else { "[USUARIO]" }
                        $color = if ($msg.sender -eq "admin") { "Cyan" } else { "White" }
                        Write-Host "   $sender $($msg.message)" -ForegroundColor $color
                    }
                    
                    Write-Host ""
                    Write-Host "COMUNICACION COMPLETA FUNCIONANDO!" -ForegroundColor Green
                    Write-Host "   Landing page -> Telegram: OK" -ForegroundColor Green
                    Write-Host "   Telegram -> Landing page: OK" -ForegroundColor Green
                }
                else {
                    Write-Host "No se encontraron respuestas de admin" -ForegroundColor Yellow
                    Write-Host "   Verifica que enviaste la respuesta con el formato correcto" -ForegroundColor Yellow
                }
            }
            else {
                Write-Host "Error obteniendo sesion: $($sessionInfo.message)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "Error verificando sesion: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    }
    else {
        Write-Host "Error creando sesion: $($chatResponse.message)" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error creando sesion: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "TEST COMPLETADO" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow
Write-Host ""
Write-Host "Si todos los tests pasaron, la comunicacion Telegram esta funcionando correctamente." -ForegroundColor White
Write-Host "Los usuarios pueden chatear en la landing page y recibir respuestas desde Telegram." -ForegroundColor White
Write-Host ""
Read-Host "Presiona ENTER para salir"