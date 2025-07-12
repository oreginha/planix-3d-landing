# Script para probar la comunicacion entre frontend y backend

Write-Host "=== PRUEBA DE COMUNICACION FRONTEND-BACKEND ===" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://planix-backend-node-production.up.railway.app"
$frontendUrl = "https://planix-frontend-production.up.railway.app"

# 1. Verificar backend
Write-Host "1. Verificando estado del backend..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    if ($healthResponse.success) {
        Write-Host "   OK Backend funcionando correctamente" -ForegroundColor Green
        Write-Host "   Version: $($healthResponse.data.version)" -ForegroundColor Gray
    } else {
        Write-Host "   ERROR Backend reporta error" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "   ERROR No se puede conectar al backend" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Probar endpoint de chat
Write-Host "2. Probando endpoint de chat..." -ForegroundColor Yellow
try {
    $chatData = @{
        message = "Hola, esta es una prueba de comunicacion"
        userName = "Usuario de Prueba"
        isFirstMessage = $true
    }
    
    $body = $chatData | ConvertTo-Json
    $chatResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/message" -Method POST -Body $body -ContentType "application/json"
    
    if ($chatResponse.success) {
        Write-Host "   OK Endpoint de chat funcionando" -ForegroundColor Green
        Write-Host "   Sesion creada: $($chatResponse.data.sessionId)" -ForegroundColor Gray
        
        if ($chatResponse.data.botResponse) {
            Write-Host "   Respuesta del bot: $($chatResponse.data.botResponse.message)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ERROR en endpoint de chat: $($chatResponse.message)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ERROR al probar chat: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Verificar endpoints
Write-Host "3. Verificando endpoints disponibles..." -ForegroundColor Yellow

$endpoints = @("/health", "/api/health", "/api/chat/message")

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$backendUrl$endpoint" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   OK $endpoint - Disponible" -ForegroundColor Green
        } else {
            Write-Host "   WARN $endpoint - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 405) {
            Write-Host "   OK $endpoint - Disponible (405 es normal)" -ForegroundColor Green
        } else {
            Write-Host "   ERROR $endpoint - No disponible" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Backend URL: $backendUrl" -ForegroundColor White
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Si todos los tests pasaron, la comunicacion deberia funcionar" -ForegroundColor Green
Write-Host "Prueba el chat en el frontend para verificar" -ForegroundColor Yellow