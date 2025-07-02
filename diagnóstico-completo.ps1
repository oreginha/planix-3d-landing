#!/usr/bin/env powershell

# Script para diagnosticar y corregir problemas de build de Planix

Write-Host "=== DIAGNÓSTICO COMPLETO PLANIX FRONTEND ===" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# Verificar directorio
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: No estás en el directorio del frontend" -ForegroundColor Red
    Write-Host "Navega hasta el directorio raíz que contiene package.json" -ForegroundColor Yellow
    exit 1
}

Write-Host "📍 Directorio verificado" -ForegroundColor Green
Write-Host ""

# 1. Verificar dependencias
Write-Host "🔍 1. Verificando dependencias..." -ForegroundColor Blue
if (-Not (Test-Path "node_modules")) {
    Write-Host "  📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install --silent
} else {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green
}

# 2. Verificar sintaxis TypeScript
Write-Host ""
Write-Host "🔍 2. Verificando sintaxis TypeScript..." -ForegroundColor Blue
Write-Host "  Ejecutando: npx tsc --noEmit --skipLibCheck" -ForegroundColor Gray

try {
    $tsOutput = npx tsc --noEmit --skipLibCheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ TypeScript OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Errores de TypeScript encontrados:" -ForegroundColor Red
        Write-Host $tsOutput -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️ Error ejecutando TypeScript check" -ForegroundColor Yellow
}

# 3. Verificar ESLint (si está disponible)
Write-Host ""
Write-Host "🔍 3. Verificando ESLint..." -ForegroundColor Blue

try {
    $eslintOutput = npx eslint src --ext .ts,.tsx --format compact 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ ESLint OK" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ Warnings/Errores de ESLint:" -ForegroundColor Yellow
        Write-Host $eslintOutput -ForegroundColor Gray
    }
} catch {
    Write-Host "  ℹ️ ESLint no disponible (esto es normal)" -ForegroundColor Gray
}

# 4. Probar build completo
Write-Host ""
Write-Host "🔍 4. Probando build completo..." -ForegroundColor Blue
Write-Host "  Ejecutando: npm run build" -ForegroundColor Gray

$buildStart = Get-Date
try {
    $buildOutput = npm run build 2>&1
    $buildEnd = Get-Date
    $buildTime = ($buildEnd - $buildStart).TotalSeconds

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ BUILD EXITOSO!" -ForegroundColor Green
        Write-Host "  ⏱️ Tiempo: $([math]::Round($buildTime, 2)) segundos" -ForegroundColor Cyan
        
        # Verificar tamaño de build
        if (Test-Path "build") {
            $buildSize = (Get-ChildItem "build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Host "  📊 Tamaño del build: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  ❌ BUILD FALLÓ" -ForegroundColor Red
        Write-Host ""
        Write-Host "📋 Salida del build:" -ForegroundColor Yellow
        Write-Host $buildOutput -ForegroundColor Gray
    }
} catch {
    Write-Host "  💥 Error crítico durante el build" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

# 5. Resumen
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📊 RESUMEN DEL DIAGNÓSTICO" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 ESTADO: ÉXITO - El proyecto está listo para deploy" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor White
    Write-Host "  2. git commit -m \"fix: Corregir errores ESLint en footer\"" -ForegroundColor White
    Write-Host "  3. git push origin backend-nodejs" -ForegroundColor White
    Write-Host "  4. Verificar deploy automático en Railway" -ForegroundColor White
} else {
    Write-Host "⚠️ ESTADO: ERRORES ENCONTRADOS" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Acciones requeridas:" -ForegroundColor Yellow
    Write-Host "  1. Revisar errores mostrados arriba" -ForegroundColor White
    Write-Host "  2. Corregir problemas de sintaxis/ESLint" -ForegroundColor White
    Write-Host "  3. Volver a ejecutar este script" -ForegroundColor White
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
