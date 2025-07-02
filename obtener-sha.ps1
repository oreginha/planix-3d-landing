#!/usr/bin/env powershell

Write-Host "=== OBTENER SHA MÁS RECIENTE ===" -ForegroundColor Cyan
Write-Host ""

# Obtener el SHA del último commit
$latestSHA = git rev-parse HEAD
Write-Host "📋 SHA más reciente: $latestSHA" -ForegroundColor Green

# Mostrar información del commit
Write-Host ""
Write-Host "📝 Información del commit:" -ForegroundColor Blue
git log -1 --oneline

Write-Host ""
Write-Host "📊 Archivos en el último commit:" -ForegroundColor Blue
git ls-tree -r HEAD --name-only | findstr -E "\.(tsx|ts|js|jsx)$" | head -10

Write-Host ""
Write-Host "🚀 Para hacer deploy manual usar SHA: $latestSHA" -ForegroundColor Yellow

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
