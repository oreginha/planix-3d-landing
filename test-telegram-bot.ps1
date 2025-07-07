# 🤖 SCRIPT DE PRUEBAS TELEGRAM PARA PLtry {
$body = @{
    try {
        $body = @{
            chat_id = $GROUP_CHAT_ID
            text = "🚀 Bot de Planix conectado al grupo!`n`n📊 Configuracion:`n• Token: ✅ Valido`n• Chat Personal: ✅ $PERSONAL_CHAT_ID`n• Chat Grupo: ✅ $GROUP_CHAT_ID`n`n⏰ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        } | ConvertTo-Json -Depth 10

        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8"id = $PERSONAL_CHAT_ID
        text = "🎉 Prueba exitosa desde el bot de Planix!`n`n⏰ Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n🤖 Bot funcionando correctamente"
    } | ConvertTo-Json -Depth 10

    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8" ==========================================

    # Configurar UTF-8 encoding para evitar problemas con caracteres especiales
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $PSDefaultParameterValues['*:Encoding'] = 'utf8'

    Write-Host "🤖 PRUEBAS DE TELEGRAM BOT - PLANIX" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green

    # Configuración
    $BOT_TOKEN = "7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM"
    $PERSONAL_CHAT_ID = "6111613750"
    $GROUP_CHAT_ID = "-1002781646438"

    Write-Host "`n🔍 PASO 1: VERIFICAR BOT" -ForegroundColor Yellow
    Write-Host "-------------------------" -ForegroundColor Yellow

    try {
        $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getMe"
        if ($botInfo.ok) {
            Write-Host "✅ Bot verificado exitosamente!" -ForegroundColor Green
            Write-Host "   📋 ID: $($botInfo.result.id)" -ForegroundColor Cyan
            Write-Host "   📋 Nombre: $($botInfo.result.first_name)" -ForegroundColor Cyan
            Write-Host "   📋 Username: @$($botInfo.result.username)" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Error verificando bot: $($botInfo.description)" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }

    Write-Host "`n📨 PASO 2: PROBAR ENVÍO A CHAT PERSONAL" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Yellow

    try {
        $body = @{
            chat_id = $PERSONAL_CHAT_ID
            text    = "🎉 ¡Prueba exitosa desde el bot de Planix!`n`n⏰ Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n🤖 Bot funcionando correctamente"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $body -ContentType "application/json"
    
        if ($response.ok) {
            Write-Host "✅ Mensaje enviado a tu chat personal!" -ForegroundColor Green
            Write-Host "   📱 Revisa tu Telegram para confirmar" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Error enviando mensaje personal: $($response.description)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Error enviando mensaje personal: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n👥 PASO 3: PROBAR ENVÍO AL GRUPO" -ForegroundColor Yellow
    Write-Host "---------------------------------" -ForegroundColor Yellow

    try {
        $body = @{
            chat_id = $GROUP_CHAT_ID
            text    = "🚀 ¡Bot de Planix conectado al grupo!`n`n📊 Configuración:`n• Token: ✅ Válido`n• Chat Personal: ✅ $PERSONAL_CHAT_ID`n• Chat Grupo: ✅ $GROUP_CHAT_ID`n`n⏰ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $body -ContentType "application/json"
    
        if ($response.ok) {
            Write-Host "✅ Mensaje enviado al grupo!" -ForegroundColor Green
            Write-Host "   👥 Revisa el grupo para confirmar" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Error enviando mensaje al grupo: $($response.description)" -ForegroundColor Red
            Write-Host "   💡 Asegúrate de que el bot sea administrador del grupo" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Error enviando mensaje al grupo: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n📋 PASO 4: OBTENER INFORMACIÓN DE WEBHOOKS" -ForegroundColor Yellow
    Write-Host "-------------------------------------------" -ForegroundColor Yellow

    try {
        $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
    
        if ($webhookInfo.ok) {
            Write-Host "✅ Información de webhook obtenida:" -ForegroundColor Green
            Write-Host "   🌐 URL: $($webhookInfo.result.url)" -ForegroundColor Cyan
            Write-Host "   📊 Pending updates: $($webhookInfo.result.pending_update_count)" -ForegroundColor Cyan
            Write-Host "   📅 Última actividad: $($webhookInfo.result.last_error_date)" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Host "⚠️ No se pudo obtener información de webhook (normal en desarrollo)" -ForegroundColor Yellow
    }

    Write-Host "`n🎉 RESUMEN DE PRUEBAS" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host "🤖 Bot Token: ✅ Válido" -ForegroundColor Green
    Write-Host "📱 Chat Personal: ✅ Configurado ($PERSONAL_CHAT_ID)" -ForegroundColor Green
    Write-Host "👥 Chat Grupo: ✅ Configurado ($GROUP_CHAT_ID)" -ForegroundColor Green
    Write-Host "`n💡 PROXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "1. Reinicia el backend de Planix" -ForegroundColor White
    Write-Host "2. Verifica que TELEGRAM_ENABLED=true en .env" -ForegroundColor White
    Write-Host "3. Revisa los logs del backend para confirmar conexion" -ForegroundColor White
    Write-Host "`n🚀 Tu bot de Telegram esta listo para Planix!" -ForegroundColor Green
