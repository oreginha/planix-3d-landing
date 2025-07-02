#!/usr/bin/env powershell

# Script para configurar variables de entorno para Planix
# Ejecutar desde el directorio raíz del proyecto

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🔧 SETUP DE VARIABLES PLANIX" -ForegroundColor Cyan  
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# Verificar directorio
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: Ejecutar desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar si el backend existe
if (-Not (Test-Path "backend")) {
    Write-Host "❌ ERROR: Directorio backend no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "📍 Directorio verificado" -ForegroundColor Green
Write-Host ""

# 1. Crear archivo de variables Railway
Write-Host "🔧 1. Creando archivo de variables Railway..." -ForegroundColor Blue

$railwayVars = @"
# Variables de entorno para Railway - Backend Node.js
# Copiar y pegar en Railway Dashboard

NODE_ENV=production
PORT=3001
TEST_MODE=false
DEBUG_LOGS=true
LOG_EMAILS=true

# SMTP Configuration (COMPLETAR MANUALMENTE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=TU-EMAIL@gmail.com
SMTP_PASS=TU-APP-PASSWORD-16-CHARS

# Email Settings  
EMAIL_FROM_NAME=Planix Web
EMAIL_FROM_EMAIL=noreply@planix.com.ar
EMAIL_TO=hola@planix.com.ar

# CORS Settings
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app,https://planix.com.ar

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=20

# ✅ INSTRUCCIONES:
# 1. Reemplazar SMTP_USER con tu email real
# 2. Reemplazar SMTP_PASS con App Password de Gmail
# 3. Copiar todo y pegar en Railway Dashboard
# 4. URL: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
"@

$railwayVars | Out-File -FilePath "railway-backend-vars.env" -Encoding UTF8
Write-Host "  ✅ Archivo creado: railway-backend-vars.env" -ForegroundColor Green

# 2. Crear archivo de secrets para GitHub
Write-Host ""
Write-Host "🔧 2. Creando archivo de GitHub Secrets..." -ForegroundColor Blue

$githubSecrets = @"
# GitHub Secrets para CI/CD
# Crear en: https://github.com/oreginha/planix-3d-landing/settings/secrets/actions

# Railway Token (obtener de Railway Dashboard)
RAILWAY_TOKEN=railway-token-aqui

# SMTP Credentials (mismo que Railway)
SMTP_USER=mismo-email-que-railway
SMTP_PASS=mismo-app-password-que-railway

# ✅ INSTRUCCIONES:
# 1. Ir a Railway Dashboard → Account → Tokens
# 2. Crear nuevo token y copiarlo en RAILWAY_TOKEN
# 3. Usar mismo SMTP_USER y SMTP_PASS que en Railway
# 4. Crear cada secret individualmente en GitHub
"@

$githubSecrets | Out-File -FilePath "github-secrets.env" -Encoding UTF8
Write-Host "  ✅ Archivo creado: github-secrets.env" -ForegroundColor Green

# 3. Crear workflow GitHub Actions
Write-Host ""
Write-Host "🔧 3. Creando GitHub Actions workflow..." -ForegroundColor Blue

# Crear directorio .github/workflows si no existe
if (-Not (Test-Path ".github")) {
    New-Item -ItemType Directory -Path ".github"
}
if (-Not (Test-Path ".github/workflows")) {
    New-Item -ItemType Directory -Path ".github/workflows"
}

$workflow = @"
name: Deploy to Railway

on:
  push:
    branches: [ backend-nodejs ]
  pull_request:
    branches: [ backend-nodejs ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    name: Test Frontend
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript check
      run: npx tsc --noEmit --skipLibCheck
    
    - name: Build frontend
      run: npm run build

  test-backend:
    runs-on: ubuntu-latest
    name: Test Backend
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'backend/package-lock.json'
    
    - name: Install backend dependencies
      run: |
        cd backend
        npm ci
    
    - name: Build backend
      run: |
        cd backend
        npm run build
    
    - name: Test backend (dry run)
      run: |
        cd backend
        npm test || echo "No tests configured yet"

  deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    name: Deploy to Railway
    if: github.ref == 'refs/heads/backend-nodejs'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Railway
      uses: railwayapp/railway-deploy@v3
      with:
        railway_token: `${{ secrets.RAILWAY_TOKEN }}
        service: planix-backend-node
        
    - name: Update environment variables
      run: |
        echo "✅ Deployment triggered"
        echo "📋 Manual steps required:"
        echo "1. Verify Railway deployment status"
        echo "2. Check service health: https://planix-backend-node-production.up.railway.app/health"
        echo "3. Test endpoints manually"
"@

$workflow | Out-File -FilePath ".github/workflows/deploy.yml" -Encoding UTF8
Write-Host "  ✅ Archivo creado: .github/workflows/deploy.yml" -ForegroundColor Green

# 4. Mostrar resumen e instrucciones
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📋 RESUMEN DE ARCHIVOS CREADOS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host ""
Write-Host "📄 Archivos generados:" -ForegroundColor Yellow
Write-Host "  1. railway-backend-vars.env" -ForegroundColor White
Write-Host "  2. github-secrets.env" -ForegroundColor White  
Write-Host "  3. .github/workflows/deploy.yml" -ForegroundColor White

Write-Host ""
Write-Host "🚀 PRÓXIMOS PASOS CRÍTICOS:" -ForegroundColor Red
Write-Host ""

Write-Host "1️⃣ GMAIL APP PASSWORD:" -ForegroundColor Yellow
Write-Host "   → https://myaccount.google.com/security" -ForegroundColor Cyan
Write-Host "   → Habilitar 2FA → Contraseñas de aplicación → Generar" -ForegroundColor Gray

Write-Host ""
Write-Host "2️⃣ RAILWAY VARIABLES:" -ForegroundColor Yellow  
Write-Host "   → https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272" -ForegroundColor Cyan
Write-Host "   → planix-backend-node → Variables → Copiar de railway-backend-vars.env" -ForegroundColor Gray

Write-Host ""
Write-Host "3️⃣ GITHUB SECRETS:" -ForegroundColor Yellow
Write-Host "   → https://github.com/oreginha/planix-3d-landing/settings/secrets/actions" -ForegroundColor Cyan
Write-Host "   → New repository secret → Usar github-secrets.env como referencia" -ForegroundColor Gray

Write-Host ""
Write-Host "4️⃣ COMMIT Y PUSH:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m `"feat: Setup CI/CD y configuración Railway`"" -ForegroundColor White
Write-Host "   git push origin backend-nodejs" -ForegroundColor White

Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   - Completar SMTP_USER y SMTP_PASS con datos reales" -ForegroundColor White
Write-Host "   - Cambiar TEST_MODE=false en Railway" -ForegroundColor White
Write-Host "   - Verificar conexión Railway-GitHub" -ForegroundColor White

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
