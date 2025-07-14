# SCRIPT PARA CORREGIR CONFIGURACION RAILWAY DEPLOYMENT
# =====================================================

Write-Host "SOLUCIONANDO PROBLEMA DE RAILWAY DEPLOYMENT" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Yellow

# Verificar estructura del proyecto
Write-Host "`nVERIFICANDO ESTRUCTURA DEL PROYECTO..." -ForegroundColor Cyan

if (Test-Path "backend") {
    Write-Host "✅ Carpeta backend encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Carpeta backend NO encontrada" -ForegroundColor Red
    exit 1
}

if (Test-Path "package.json") {
    Write-Host "✅ package.json frontend encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json frontend NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "backend/package.json") {
    Write-Host "✅ package.json backend encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json backend NO encontrado" -ForegroundColor Red
    exit 1
}

# Verificar archivos railway.json
Write-Host "`nVERIFICANDO CONFIGURACION RAILWAY..." -ForegroundColor Cyan

if (Test-Path "railway.json") {
    $frontendConfig = Get-Content "railway.json" | ConvertFrom-Json
    Write-Host "✅ railway.json frontend:" -ForegroundColor Green
    Write-Host "   Build: $($frontendConfig.build.buildCommand)" -ForegroundColor White
    Write-Host "   Start: $($frontendConfig.deploy.startCommand)" -ForegroundColor White
}

if (Test-Path "backend/railway.json") {
    $backendConfig = Get-Content "backend/railway.json" | ConvertFrom-Json
    Write-Host "✅ railway.json backend:" -ForegroundColor Green
    Write-Host "   Build: $($backendConfig.build.buildCommand)" -ForegroundColor White
    Write-Host "   Start: $($backendConfig.deploy.startCommand)" -ForegroundColor White
}

# Verificar Railway CLI
Write-Host "`nVERIFICANDO RAILWAY CLI..." -ForegroundColor Cyan

try {
    $railwayCheck = Get-Command railway -ErrorAction Stop
    Write-Host "✅ Railway CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI no instalado" -ForegroundColor Red
    Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Railway CLI instalado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error instalando Railway CLI" -ForegroundColor Red
        exit 1
    }
}

# Mostrar información del proyecto
Write-Host "`nINFORMACION DEL PROYECTO RAILWAY" -ForegroundColor Cyan
Write-Host "Project ID: 16e84c2c-50d0-4c6f-b2a9-06c45c839272" -ForegroundColor White
Write-Host "Frontend Service ID: a28eaffb-dc0b-434a-8556-512e4f028113" -ForegroundColor White
Write-Host "Backend Service ID: 4e2be212-b608-4241-b56d-e004b6dcf0e2" -ForegroundColor White

# Verificar URLs de producción
Write-Host "`nVERIFICANDO URLS DE PRODUCCION..." -ForegroundColor Cyan

$frontendUrl = "https://planix-3d-landing-production.up.railway.app"
$backendUrl = "https://planix-backend-node-production.up.railway.app"
$healthUrl = "$backendUrl/health"

try {
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend funcionando: $healthUrl" -ForegroundColor Green
        Write-Host "   Respuesta: $($response.Content)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Backend NO responde: $healthUrl" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando: $frontendUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend NO responde: $frontendUrl" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Instrucciones para solucionar
Write-Host "`nPASOS PARA SOLUCIONAR EL PROBLEMA:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

Write-Host "`n1. CONFIGURAR ROOT DIRECTORY EN RAILWAY:" -ForegroundColor Cyan
Write-Host "   a) Ir a: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272" -ForegroundColor White
Write-Host "   b) Backend Service > Settings > Deploy > Root Directory: backend" -ForegroundColor White
Write-Host "   c) Frontend Service > Settings > Deploy > Root Directory: . (punto)" -ForegroundColor White

Write-Host "`n2. CONFIGURAR VARIABLES SMTP:" -ForegroundColor Cyan
Write-Host "   a) Backend Service > Variables" -ForegroundColor White
Write-Host "   b) TEST_MODE=false" -ForegroundColor White
Write-Host "   c) SMTP_USER=tu-email@gmail.com" -ForegroundColor White
Write-Host "   d) SMTP_PASS=tu-app-password-gmail" -ForegroundColor White

Write-Host "`n3. CONFIGURAR GITHUB SECRETS:" -ForegroundColor Cyan
Write-Host "   a) Ir a: https://github.com/oreginha/planix-3d-landing/settings/secrets/actions" -ForegroundColor White
Write-Host "   b) RAILWAY_TOKEN (obtener de https://railway.app/account/tokens)" -ForegroundColor White
Write-Host "   c) SMTP_USER y SMTP_PASS (mismos que Railway)" -ForegroundColor White

Write-Host "`n4. DEPLOYMENT MANUAL (SI ES NECESARIO):" -ForegroundColor Cyan
Write-Host "   railway login" -ForegroundColor White
Write-Host "   railway link 16e84c2c-50d0-4c6f-b2a9-06c45c839272 --environment production" -ForegroundColor White
Write-Host "   # Para backend:" -ForegroundColor Gray
Write-Host "   cd backend && railway up --service 4e2be212-b608-4241-b56d-e004b6dcf0e2" -ForegroundColor White
Write-Host "   # Para frontend:" -ForegroundColor Gray
Write-Host "   cd .. && railway up --service a28eaffb-dc0b-434a-8556-512e4f028113" -ForegroundColor White

Write-Host "`nARCHIVOS DE REFERENCIA CREADOS:" -ForegroundColor Cyan
Write-Host "   ✅ SOLUCION-RAILWAY-DEPLOYMENT.md (documentacion completa)" -ForegroundColor Green
Write-Host "   ✅ railway-backend-vars.env (variables backend)" -ForegroundColor Green
Write-Host "   ✅ railway-frontend-vars.env (variables frontend)" -ForegroundColor Green

Write-Host "`nPROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Configurar Root Directory en Railway Dashboard" -ForegroundColor White
Write-Host "2. Completar variables SMTP en Railway" -ForegroundColor White
Write-Host "3. Configurar GitHub Secrets" -ForegroundColor White
Write-Host "4. Hacer push para activar GitHub Actions" -ForegroundColor White
Write-Host "5. Verificar deployment en Railway Dashboard" -ForegroundColor White

Write-Host "`n✅ DIAGNOSTICO COMPLETADO" -ForegroundColor Green
Write-Host "Ver SOLUCION-RAILWAY-DEPLOYMENT.md para detalles completos" -ForegroundColor Cyan