Write-Host "Verificando Backend Planix..." -ForegroundColor Green

# Esperar a que el servidor se inicie
Write-Host "Esperando 10 segundos para que el servidor se inicie..." -ForegroundColor Yellow
Start-Sleep 10

# Verificar si el puerto esta abierto
Write-Host "`nVerificando puerto 3001..." -ForegroundColor Yellow
$portCheck = netstat -an | findstr ":3001"
if ($portCheck) {
    Write-Host "Puerto 3001 esta abierto" -ForegroundColor Green
    Write-Host $portCheck -ForegroundColor Cyan
}
else {
    Write-Host "Puerto 3001 NO esta abierto" -ForegroundColor Red
    Write-Host "El backend no se inicio correctamente" -ForegroundColor Red
    exit 1
}

# Probar health endpoint
Write-Host "`nProbando endpoint /health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    Write-Host "Health Check: EXITOSO" -ForegroundColor Green
    Write-Host "Mensaje: $($health.message)" -ForegroundColor Cyan
    Write-Host "Version: $($health.data.version)" -ForegroundColor Cyan
    Write-Host "Entorno: $($health.data.environment)" -ForegroundColor Cyan
}
catch {
    Write-Host "Health Check: FALLO" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar contact test endpoint
Write-Host "`nProbando endpoint /api/contact/test..." -ForegroundColor Yellow
try {
    $contactTest = Invoke-RestMethod -Uri "http://localhost:3001/api/contact/test" -Method GET -TimeoutSec 5
    if ($contactTest.success) {
        Write-Host "Contact Test: EXITOSO" -ForegroundColor Green
    }
    else {
        Write-Host "Contact Test: ADVERTENCIA" -ForegroundColor Yellow
    }
    Write-Host "Mensaje: $($contactTest.message)" -ForegroundColor Cyan
}
catch {
    Write-Host "Contact Test: FALLO" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nBackend funcionando correctamente!" -ForegroundColor Green
