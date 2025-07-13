# Script para probar y debuggear el problema de sesion no encontrada

# Configuracion
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$TELEGRAM_BOT_TOKEN = $env:TELEGRAM_BOT_TOKEN
$TELEGRAM_CHAT_ID = $env:TELEGRAM_CHAT_ID

Write-Host "Iniciando prueba de debug de sesiones..." -ForegroundColor Yellow

# 1. Crear una nueva sesion de chat
Write-Host "Paso 1: Creando nueva sesion de chat..." -ForegroundColor Cyan

$chatData = @{
    message = "Hola, necesito informacion sobre sus servicios"
    userIp = "192.168.1.100"
    userAgent = "Test-Debug-Agent"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $chatData -ContentType "application/json"
    $sessionId = $response.data.sessionId
    
    Write-Host "Sesion creada exitosamente:" -ForegroundColor Green
    Write-Host "   Session ID: $sessionId" -ForegroundColor White
    Write-Host "   Mensaje usuario: $($response.data.userMessage.message)" -ForegroundColor White
    Write-Host "   Respuesta bot: $($response.data.botResponse.message)" -ForegroundColor White
    
    if (-not $sessionId) {
        Write-Host "ERROR: No se obtuvo sessionId" -ForegroundColor Red
        return
    }
    
    # 2. Simular mensaje de Telegram con el formato correcto
    Write-Host "Paso 2: Simulando mensaje de Telegram..." -ForegroundColor Cyan
    
    $telegramMessage = "$sessionId Hola desde Telegram, soy un administrador"
    Write-Host "   Mensaje a enviar: $telegramMessage" -ForegroundColor White
    
    # 3. Enviar webhook de Telegram
    Write-Host "Paso 3: Enviando webhook de Telegram..." -ForegroundColor Cyan
    
    $webhookData = @{
        message = @{
            message_id = 123
            from = @{
                id = 123456789
                first_name = "Admin"
                username = "admin_test"
            }
            chat = @{
                id = [long]$TELEGRAM_CHAT_ID
                type = "private"
            }
            date = [long][double](Get-Date -UFormat %s)
            text = $telegramMessage
        }
    } | ConvertTo-Json -Depth 10
    
    $webhookResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/telegram/webhook" -Method POST -Body $webhookData -ContentType "application/json"
    
    Write-Host "Webhook enviado exitosamente" -ForegroundColor Green
    Write-Host "   Respuesta: $webhookResponse" -ForegroundColor White
    
    # 4. Verificar el estado de la sesion
    Write-Host "Paso 4: Verificando estado de la sesion..." -ForegroundColor Cyan
    
    $sessionResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
    
    Write-Host "Estado de la sesion:" -ForegroundColor Green
    Write-Host "   ID: $($sessionResponse.id)" -ForegroundColor White
    Write-Host "   Estado: $($sessionResponse.status)" -ForegroundColor White
    Write-Host "   Admin conectado: $($sessionResponse.isAdminConnected)" -ForegroundColor White
    Write-Host "   Total mensajes: $($sessionResponse.messages.Count)" -ForegroundColor White
    
    # Mostrar ultimos mensajes
    Write-Host "Ultimos mensajes:" -ForegroundColor Cyan
    foreach ($msg in $sessionResponse.messages | Select-Object -Last 3) {
        $timestamp = [DateTime]::Parse($msg.timestamp).ToString("HH:mm:ss")
        Write-Host "   [$timestamp] $($msg.sender): $($msg.message)" -ForegroundColor White
    }
    
} catch {
    Write-Host "Error en la prueba:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Detalles: $errorBody" -ForegroundColor Red
    }
}

Write-Host "Prueba completada. Revisa los logs del servidor para mas detalles." -ForegroundColor Yellow
Write-Host "Para ver los logs en Railway:" -ForegroundColor Cyan
Write-Host "   1. Ve a https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272" -ForegroundColor White
Write-Host "   2. Selecciona el servicio planix-backend-node" -ForegroundColor White
Write-Host "   3. Ve a la pestana Logs" -ForegroundColor White