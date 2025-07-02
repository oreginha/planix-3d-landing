#!/usr/bin/env powershell

# Script para hacer commit y push de los cambios de corrección

Write-Host "=== COMMIT Y DEPLOY DE CORRECCIONES PLANIX ===" -ForegroundColor Green
Write-Host ""

# Verificar si estamos en un repositorio git
if (-Not (Test-Path ".git")) {
    Write-Host "❌ ERROR: No estás en un repositorio Git" -ForegroundColor Red
    exit 1
}

# Verificar rama actual
$currentBranch = git branch --show-current
Write-Host "📍 Rama actual: $currentBranch" -ForegroundColor Cyan

if ($currentBranch -ne "backend-nodejs") {
    Write-Host "⚠️ ADVERTENCIA: No estás en la rama 'backend-nodejs'" -ForegroundColor Yellow
    Write-Host "¿Quieres cambiar a la rama backend-nodejs? (y/n): " -NoNewline -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        git checkout backend-nodejs
        Write-Host "✅ Cambiado a rama backend-nodejs" -ForegroundColor Green
    } else {
        Write-Host "❌ Cancelado. Cambiar a rama backend-nodejs antes de continuar." -ForegroundColor Red
        exit 1
    }
}

# Mostrar estado actual
Write-Host ""
Write-Host "📋 Estado actual del repositorio:" -ForegroundColor Blue
git status --short

# Agregar archivos
Write-Host ""
Write-Host "📦 Agregando archivos..." -ForegroundColor Blue
git add .

# Hacer commit
$commitMessage = "fix: Corregir errores ESLint en footer - Reemplazar anchors href='#' por buttons"
Write-Host ""
Write-Host "💾 Haciendo commit..." -ForegroundColor Blue
Write-Host "    Mensaje: $commitMessage" -ForegroundColor Gray
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit exitoso" -ForegroundColor Green
    
    # Push
    Write-Host ""
    Write-Host "🚀 Haciendo push..." -ForegroundColor Blue
    git push origin backend-nodejs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push exitoso" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 PRÓXIMOS PASOS:" -ForegroundColor Cyan
        Write-Host "1. Verificar deploy automático en Railway" -ForegroundColor White
        Write-Host "2. URL Frontend: https://planix-3d-landing-production.up.railway.app" -ForegroundColor White
        Write-Host "3. URL Backend: https://planix-backend-node-production.up.railway.app" -ForegroundColor White
        Write-Host ""
        Write-Host "⏱️ El deploy puede tardar 2-3 minutos" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error en push" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error en commit" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
