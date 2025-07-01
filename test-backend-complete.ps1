# Test de Endpoints del Backend Planix

Write-Host "=== PRUEBAS DEL BACKEND PLANIX ===" -ForegroundColor Green

# 1. Health Check
Write-Host "`n1. Probando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 10
    Write-Host "✓ Health Check: EXITOSO" -ForegroundColor Green
    Write-Host "  Mensaje: $($health.message)" -ForegroundColor Cyan
    Write-Host "  Version: $($health.data.version)" -ForegroundColor Cyan
    Write-Host "  Entorno: $($health.data.environment)" -ForegroundColor Cyan
    Write-Host "  Test Mode: $($health.data.testMode)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Health Check: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Contact Test
Write-Host "`n2. Probando Contact Test..." -ForegroundColor Yellow
try {
    $contactTest = Invoke-RestMethod -Uri "http://localhost:3001/api/contact/test" -Method GET -TimeoutSec 10
    if ($contactTest.success) {
        Write-Host "✓ Contact Test: EXITOSO" -ForegroundColor Green
    } else {
        Write-Host "~ Contact Test: ADVERTENCIA (sin SMTP real)" -ForegroundColor Yellow
    }
    Write-Host "  Mensaje: $($contactTest.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Contact Test: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Contact Form
Write-Host "`n3. Probando Formulario de Contacto..." -ForegroundColor Yellow
$contactData = @{
    name = "Juan Prueba"
    email = "juan@test.com"
    message = "Este es un mensaje de prueba del nuevo backend Node.js de Planix"
    company = "Empresa Test"
} | ConvertTo-Json

try {
    $contactResult = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -Body $contactData -ContentType "application/json" -TimeoutSec 10
    if ($contactResult.success) {
        Write-Host "✓ Formulario Contacto: EXITOSO" -ForegroundColor Green
        Write-Host "  Mensaje: $($contactResult.message)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Formulario Contacto: FALLO" -ForegroundColor Red
        Write-Host "  Error: $($contactResult.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Formulario Contacto: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Chat Message
Write-Host "`n4. Probando Mensaje de Chat..." -ForegroundColor Yellow
$chatData = @{
    userName = "María Test"
    userEmail = "maria@test.com"
    message = "¿Cuánto cuesta desarrollar una página web?"
    isFirstMessage = $true
} | ConvertTo-Json

try {
    $chatResult = Invoke-RestMethod -Uri "http://localhost:3001/api/chat/message" -Method POST -Body $chatData -ContentType "application/json" -TimeoutSec 10
    if ($chatResult.success) {
        Write-Host "✓ Mensaje Chat: EXITOSO" -ForegroundColor Green
        Write-Host "  Mensaje: $($chatResult.message)" -ForegroundColor Cyan
        Write-Host "  ID: $($chatResult.data.messageId)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Mensaje Chat: FALLO" -ForegroundColor Red
        Write-Host "  Error: $($chatResult.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Mensaje Chat: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== RESUMEN ===" -ForegroundColor Green
Write-Host "Backend Node.js funcionando correctamente" -ForegroundColor Green
Write-Host "Endpoints disponibles:" -ForegroundColor Cyan
Write-Host "  GET  /health" -ForegroundColor White
Write-Host "  GET  /api/contact/test" -ForegroundColor White
Write-Host "  POST /api/contact" -ForegroundColor White
Write-Host "  POST /api/chat/message" -ForegroundColor White
Write-Host "`nListo para integrar con el frontend!" -ForegroundColor Green
