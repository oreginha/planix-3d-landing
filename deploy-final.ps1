#!/usr/bin/env powershell

Write-Host "=== DEPLOY FINAL DE CORRECCIONES PLANIX ===" -ForegroundColor Green
Write-Host ""

# Verificar estado
Write-Host "📋 Estado actual:" -ForegroundColor Blue
git status --short

Write-Host ""
Write-Host "📦 Agregando todos los archivos..." -ForegroundColor Blue
git add .

Write-Host ""
Write-Host "💾 Haciendo commit..." -ForegroundColor Blue
$commitMessage = "fix: Corregir todos los errores de build - PortfolioSection restaurado, variables unused eliminadas"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit exitoso" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🚀 Haciendo push..." -ForegroundColor Blue
    git push origin backend-nodejs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push exitoso" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 DEPLOY COMPLETADO:" -ForegroundColor Cyan
        Write-Host "- PortfolioSection.tsx restaurado ✅" -ForegroundColor White
        Write-Host "- Variables unused eliminadas ✅" -ForegroundColor White  
        Write-Host "- Anchors href='#' corregidos ✅" -ForegroundColor White
        Write-Host ""
        Write-Host "⏱️ Esperando deploy automático en Railway..." -ForegroundColor Yellow
        Write-Host "📊 URL: https://planix-3d-landing-production.up.railway.app" -ForegroundColor Cyan
    else {
        Write-Host "❌ Error en push" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error en commit" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
