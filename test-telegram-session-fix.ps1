# Script para probar y corregir el problema de sesiones en Telegram
# ================================================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "PROBANDO CORRECCION DE SESIONES TELEGRAM" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# URLs
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$WEBHOOK_URL = "$BACKEND_URL/api/chat/telegram/webhook"

# Paso 1: Crear una nueva sesión de chat
Write-Host "PASO 1: Crear nueva sesión de chat" -ForegroundColor Cyan
Write-Host "----------------------------------" -ForegroundColor Cyan

try {
    $chatBody = @{
        userName = "Usuario Test"
        message = "Hola, necesito ayuda con un proyecto"
    } | ConvertTo-Json
    
    $chatResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/message" -Method POST -Body $chatBody -ContentType "application/json"
    $sessionId = $chatResponse.data.sessionId
    
    Write-Host "   ✅ Sesión creada: $sessionId" -ForegroundColor Green
    Write-Host "   📝 Mensaje del usuario enviado" -ForegroundColor White
    
    # Mostrar la respuesta del bot
    if ($chatResponse.data.botResponse) {
        Write-Host "   🤖 Respuesta del bot: $($chatResponse.data.botResponse.message)" -ForegroundColor Blue
    }
}
catch {
    Write-Host "   ❌ Error creando sesión: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PASO 2: Verificar que la sesión existe" -ForegroundColor Cyan
Write-Host "-------------------------------------" -ForegroundColor Cyan

try {
    $sessionResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
    Write-Host "   ✅ Sesión encontrada: $($sessionResponse.data.id)" -ForegroundColor Green
    Write-Host "   📊 Estado: $($sessionResponse.data.status)" -ForegroundColor White
    Write-Host "   💬 Mensajes: $($sessionResponse.data.messages.Count)" -ForegroundColor White
}
catch {
    Write-Host "   ❌ Error obteniendo sesión: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "PASO 3: Simular webhook de Telegram con diferentes formatos" -ForegroundColor Cyan
Write-Host "-----------------------------------------------------------" -ForegroundColor Cyan

# Formato 1: Como aparece en la imagen (chat_test_session_123)
$testFormats = @(
    "chat_test_session_123 Mensaje de prueba formato 1",
    "ID: chat_test_session_123 Mensaje de prueba formato 2", 
    "$sessionId Mensaje de prueba con sessionId real",
    "ID: $sessionId Mensaje de prueba con ID: y sessionId real"
)

foreach ($i in 0..($testFormats.Count - 1)) {
    $testMessage = $testFormats[$i]
    Write-Host "   Probando formato $($i + 1): $testMessage" -ForegroundColor Yellow
    
    $webhookData = @{
        message = @{
            message_id = (123 + $i)
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
            text = $testMessage
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $webhookResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $webhookData -ContentType "application/json"
        Write-Host "   ✅ Webhook enviado exitosamente" -ForegroundColor Green
        
        # Esperar un poco para que se procese
        Start-Sleep -Seconds 2
        
        # Verificar si el mensaje se agregó a alguna sesión
        if ($testMessage.Contains($sessionId)) {
            try {
                $updatedSession = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$sessionId" -Method GET
                $adminMessages = $updatedSession.data.messages | Where-Object { $_.sender -eq "admin" }
                
                if ($adminMessages.Count -gt 0) {
                    Write-Host "   ✅ Mensaje de admin encontrado en la sesión" -ForegroundColor Green
                    Write-Host "   📝 Último mensaje admin: $($adminMessages[-1].message)" -ForegroundColor White
                } else {
                    Write-Host "   ❌ No se encontró mensaje de admin en la sesión" -ForegroundColor Red
                }
            }
            catch {
                Write-Host "   ❌ Error verificando sesión: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "   ❌ Error enviando webhook: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "PASO 4: Probar con sesiones que no existen" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Cyan

$nonExistentSessions = @(
    "chat_test_session_1",
    "chat_test_session_2", 
    "chat_test_session_3",
    "chat_test_123"
)

foreach ($testSessionId in $nonExistentSessions) {
    $testMessage = "$testSessionId Mensaje para sesión inexistente"
    Write-Host "   Probando sesión inexistente: $testSessionId" -ForegroundColor Yellow
    
    $webhookData = @{
        message = @{
            message_id = (Get-Random -Minimum 1000 -Maximum 9999)
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
            text = $testMessage
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $webhookResponse = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Body $webhookData -ContentType "application/json"
        Write-Host "   ✅ Webhook enviado (debería fallar)" -ForegroundColor Green
    }
    catch {
        Write-Host "   ❌ Error enviando webhook: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "RESUMEN" -ForegroundColor Green
Write-Host "=======" -ForegroundColor Green
Write-Host "✅ Script de prueba completado" -ForegroundColor Green
Write-Host "📝 Sesión de prueba creada: $sessionId" -ForegroundColor White
Write-Host "🔍 Revisa los logs del backend para más detalles" -ForegroundColor Yellow
Write-Host "💡 Los mensajes de error 'Sesión no encontrada' son esperados para sesiones inexistentes" -ForegroundColor Cyan