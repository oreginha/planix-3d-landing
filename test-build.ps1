#!/usr/bin/env powershell

Write-Host "=== PRUEBA DE BUILD PLANIX FRONTEND ===" -ForegroundColor Yellow
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-Not (Test-Path "package.json")) {
    Write-Host "ERROR: No se encuentra package.json en el directorio actual" -ForegroundColor Red
    Write-Host "Asegurate de estar en el directorio raiz del proyecto frontend" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
npm install

Write-Host ""
Write-Host "🔍 Verificando TypeScript..." -ForegroundColor Blue
npx tsc --noEmit

Write-Host ""
Write-Host "🔧 Ejecutando build..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ BUILD EXITOSO!" -ForegroundColor Green
    Write-Host "El frontend se compilo correctamente" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ BUILD FALLÓ" -ForegroundColor Red
    Write-Host "Revisar errores arriba" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
