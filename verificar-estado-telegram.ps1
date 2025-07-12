# Script para verificar el estado actual del sistema Telegram
# Planix 3D Landing - Verificacion de Estado

$ErrorActionPreference = "Stop"

# Configuracion
$backendUrl = "https://planix-backend-node-production.up.railway.app"
$envPath = "d:\Proyectos y Desarrollo\planix-3d-landing\backend\.env"

# Leer configuracion del .env
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $botToken = ($envContent | Where-Object { $_ -match "^TELEGRAM_BOT_TOKEN=" }) -replace "TELEGRAM_BOT_TOKEN=", ""
    $chatIds = ($envContent | Where-Object { $_ -match "^TELEGRAM_ADMIN_CHAT_IDS=" }) -replace "TELEGRAM_ADMIN_CHAT_IDS=", ""
    $webhookUrl = ($envContent | Where-Object { $_ -match "^TELEGRAM_WEBHOOK_URL=" }) -replace "TELEGRAM_WEBHOOK_URL=", ""
    $telegramEnabled = ($envContent | Where-Object { $_ -match "^TELEGRAM_ENABLED=" }) -replace "TELEGRAM_ENABLED=", ""
} else {
    Write-Host "Error: No se encontro el archivo .env" -ForegroundColor Red
    exit 1
}

Write-Host "ESTADO DEL SISTEMA TELEGRAM - PLANIX" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Estado de configuracion
Write-Host "1. CONFIGURACION" -ForegroundColor Yellow
Write-Host "   Telegram habilitado: $telegramEnabled" -ForegroundColor $(if($telegramEnabled -eq "true") {"Green"} else {"Red"})
Write-Host "   Bot Token configurado: $(if($botToken) {"Si"} else {"No"})" -ForegroundColor $(if($botToken) {"Green"} else {"Red"})
Write-Host "   Chat IDs configurados: $chatIds" -ForegroundColor $(if($chatIds) {"Green"} else {"Red"})
Write-Host "   Webhook URL: $webhookUrl" -ForegroundColor $(if($webhookUrl) {"Green"} else {"Red"})
Write-Host ""

# 2. Estado del backend
Write-Host "2. BACKEND" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/api/health" -Method GET -TimeoutSec 10
    if ($healthResponse.status -eq "ok") {
        Write-Host "   Estado: Funcionando" -ForegroundColor Green
        Write-Host "   URL: $backendUrl" -ForegroundColor Green
    } else {
        Write-Host "   Estado: Error en respuesta" -ForegroundColor Red
    }
} catch {
    Write-Host "   Estado: No disponible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. Estado del bot
Write-Host "3. BOT DE TELEGRAM" -ForegroundColor Yellow
if ($botToken) {
    try {
        $botResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getMe" -Method GET -TimeoutSec 10
        if ($botResponse.ok) {
            Write-Host "   Estado: Activo" -ForegroundColor Green
            Write-Host "   Nombre: $($botResponse.result.first_name)" -ForegroundColor Green
            Write-Host "   Usuario: @$($botResponse.result.username)" -ForegroundColor Green
        } else {
            Write-Host "   Estado: Error en bot" -ForegroundColor Red
        }
    } catch {
        Write-Host "   Estado: No disponible" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   Estado: Token no configurado" -ForegroundColor Red
}
Write-Host ""

# 4. Estado del webhook
Write-Host "4. WEBHOOK" -ForegroundColor Yellow
if ($botToken) {
    try {
        $webhookResponse = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo" -Method GET -TimeoutSec 10
        if ($webhookResponse.ok) {
            $webhook = $webhookResponse.result
            Write-Host "   Estado: Configurado" -ForegroundColor Green
            Write-Host "   URL: $($webhook.url)" -ForegroundColor Green
            Write-Host "   Actualizaciones pendientes: $($webhook.pending_update_count)" -ForegroundColor $(if($webhook.pending_update_count -eq 0) {"Green"} else {"Yellow"})
            if ($webhook.last_error_date) {
                Write-Host "   Ultimo error: $($webhook.last_error_message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   Estado: Error al obtener info" -ForegroundColor Red
        }
    } catch {
        Write-Host "   Estado: No disponible" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   Estado: Token no configurado" -ForegroundColor Red
}
Write-Host ""

# 5. Endpoints disponibles
Write-Host "5. ENDPOINTS DISPONIBLES" -ForegroundColor Yellow
Write-Host "   Chat: $backendUrl/api/chat/message" -ForegroundColor Cyan
Write-Host "   Webhook: $backendUrl/api/chat/telegram/webhook" -ForegroundColor Cyan
Write-Host "   Sesion: $backendUrl/api/chat/session/{sessionId}" -ForegroundColor Cyan
Write-Host "   Admin: $backendUrl/api/chat/admin/message" -ForegroundColor Cyan
Write-Host ""

# Resumen final
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "=======" -ForegroundColor Cyan

$allGood = $true
if ($telegramEnabled -ne "true") { $allGood = $false }
if (-not $botToken) { $allGood = $false }
if (-not $chatIds) { $allGood = $false }
if (-not $webhookUrl) { $allGood = $false }

if ($allGood) {
    Write-Host "Sistema Telegram: FUNCIONANDO" -ForegroundColor Green
    Write-Host "Los usuarios pueden chatear en la landing page y recibir respuestas desde Telegram." -ForegroundColor Green
} else {
    Write-Host "Sistema Telegram: REQUIERE ATENCION" -ForegroundColor Red
    Write-Host "Revisa la configuracion anterior para identificar problemas." -ForegroundColor Red
}

Write-Host ""
Write-Host "Para probar la comunicacion completa, ejecuta: test-telegram-completo.ps1" -ForegroundColor Cyan
Write-Host ""