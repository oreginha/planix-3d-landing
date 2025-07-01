# Script para iniciar el backend en background
Write-Host "Iniciando Backend Planix en background..." -ForegroundColor Green

# Navegar al directorio del backend
Set-Location "d:\Proyectos y Desarrollo\planix-3d-landing\backend"

# Verificar si ya hay un proceso corriendo en el puerto 3001
$existingProcess = netstat -an | findstr ":3001"
if ($existingProcess) {
    Write-Host "Ya hay un servicio corriendo en puerto 3001:" -ForegroundColor Yellow
    Write-Host $existingProcess -ForegroundColor Cyan
    Write-Host "Deteniendo proceso existente..." -ForegroundColor Yellow
    
    # Buscar y terminar procesos Node.js
    Get-Process | Where-Object {$_.ProcessName -like "*node*"} | ForEach-Object {
        Write-Host "Terminando proceso Node.js: $($_.Id)" -ForegroundColor Red
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    
    Start-Sleep 2
}

# Iniciar el backend en una nueva ventana de PowerShell
Write-Host "Iniciando servidor en nueva ventana..." -ForegroundColor Green
$processInfo = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Proyectos y Desarrollo\planix-3d-landing\backend'; npm run dev" -PassThru

Write-Host "Servidor iniciado con PID: $($processInfo.Id)" -ForegroundColor Cyan
Write-Host "Esperando 15 segundos para que el servidor se inicie completamente..." -ForegroundColor Yellow
Start-Sleep 15

# Verificar que el servidor este corriendo
Write-Host "`nVerificando que el servidor este corriendo..." -ForegroundColor Yellow
$portCheck = netstat -an | findstr ":3001"
if ($portCheck) {
    Write-Host "¡Exito! Servidor corriendo en puerto 3001" -ForegroundColor Green
    Write-Host $portCheck -ForegroundColor Cyan
    
    # Probar endpoint de salud
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 10
        Write-Host "`nHealth Check: EXITOSO" -ForegroundColor Green
        Write-Host "Mensaje: $($health.message)" -ForegroundColor Cyan
        Write-Host "Version: $($health.data.version)" -ForegroundColor Cyan
        Write-Host "Entorno: $($health.data.environment)" -ForegroundColor Cyan
        
        Write-Host "`n=== BACKEND LISTO PARA USAR ===" -ForegroundColor Green
        Write-Host "URL Base: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Health: http://localhost:3001/health" -ForegroundColor Cyan
        Write-Host "Contact: http://localhost:3001/api/contact" -ForegroundColor Cyan
        Write-Host "Chat: http://localhost:3001/api/chat/message" -ForegroundColor Cyan
        
    } catch {
        Write-Host "`nHealth Check: FALLO" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "El servidor inicio pero no responde correctamente" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: El servidor no se inicio correctamente" -ForegroundColor Red
    Write-Host "Revisa la ventana del servidor para ver errores" -ForegroundColor Yellow
}
