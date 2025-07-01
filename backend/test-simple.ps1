Write-Host "Probando Backend Planix..." -ForegroundColor Green

# Probar endpoint de salud
Write-Host "Probando endpoint de salud..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "Health Check: OK" -ForegroundColor Green
    Write-Host "Mensaje: $($response.message)" -ForegroundColor Cyan
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Esta corriendo el servidor en puerto 3001?" -ForegroundColor Yellow
}

Write-Host "Pruebas completadas!" -ForegroundColor Green
