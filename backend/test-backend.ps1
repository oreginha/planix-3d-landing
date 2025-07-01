# 🧪 Script de Prueba del Backend Planix

Write-Host "🚀 Probando Backend Planix..." -ForegroundColor Green

# Probar endpoint de salud
Write-Host "`n📊 Probando endpoint de salud..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "   Mensaje: $($response.message)" -ForegroundColor Cyan
    Write-Host "   Versión: $($response.data.version)" -ForegroundColor Cyan
    Write-Host "   Entorno: $($response.data.environment)" -ForegroundColor Cyan
    Write-Host "   Modo Test: $($response.data.testMode)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error en Health Check: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   ¿Está ejecutándose el servidor en puerto 3001?" -ForegroundColor Yellow
}

# Probar endpoint de test de email
Write-Host "`n📧 Probando conexión de email..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/contact/test" -Method GET
    if ($response.success) {
        Write-Host "✅ Email Test: OK" -ForegroundColor Green
        Write-Host "   Mensaje: $($response.message)" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠️ Email Test: Fallo" -ForegroundColor Yellow
        Write-Host "   Mensaje: $($response.message)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error en Email Test: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de contacto
Write-Host "`n📝 Probando formulario de contacto..." -ForegroundColor Yellow
$testData = @{
    name    = "Usuario Prueba"
    email   = "test@planix.com.ar"
    message = "Este es un mensaje de prueba del nuevo backend Node.js"
    company = "Planix Test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -Body $testData -ContentType "application/json"
    if ($response.success) {
        Write-Host "✅ Formulario Contacto: OK" -ForegroundColor Green
        Write-Host "   Mensaje: $($response.message)" -ForegroundColor Cyan
        Write-Host "   ID: $($response.data.contactId)" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠️ Formulario Contacto: Fallo" -ForegroundColor Yellow
        Write-Host "   Error: $($response.error)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error en Formulario: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de chat
Write-Host "`n💬 Probando mensaje de chat..." -ForegroundColor Yellow
$chatData = @{
    userName       = "Usuario Chat"
    userEmail      = "chat@planix.com.ar"
    message        = "¿Cuánto cuesta un sitio web?"
    isFirstMessage = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/chat/message" -Method POST -Body $chatData -ContentType "application/json"
    if ($response.success) {
        Write-Host "✅ Mensaje Chat: OK" -ForegroundColor Green
        Write-Host "   Mensaje: $($response.message)" -ForegroundColor Cyan
        Write-Host "   ID: $($response.data.messageId)" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠️ Mensaje Chat: Fallo" -ForegroundColor Yellow
        Write-Host "   Error: $($response.error)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Error en Chat: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Pruebas completadas!" -ForegroundColor Green
Write-Host "`n📝 Notas:" -ForegroundColor Cyan
Write-Host "   • Si ves errores de email, configura las variables SMTP en .env" -ForegroundColor Gray
Write-Host "   • El backend está en modo TEST por defecto" -ForegroundColor Gray
Write-Host "   • Los emails se envían a TEST_EMAIL configurado" -ForegroundColor Gray
