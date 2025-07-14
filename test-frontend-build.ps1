# Script para diagnosticar problemas de build del frontend
Write-Host "=== DIAGNÓSTICO DE BUILD DEL FRONTEND ===" -ForegroundColor Cyan

# Verificar estructura del proyecto
Write-Host "\n1. Verificando estructura del proyecto..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "src") {
    Write-Host "✅ Directorio src encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Directorio src NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "public") {
    Write-Host "✅ Directorio public encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Directorio public NO encontrado" -ForegroundColor Red
    exit 1
}

# Verificar dependencias
Write-Host "\n2. Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "⚠️ node_modules no existe, instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
}

# Verificar scripts en package.json
Write-Host "\n3. Verificando scripts..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.scripts.build) {
    Write-Host "✅ Script 'build' encontrado: $($packageJson.scripts.build)" -ForegroundColor Green
} else {
    Write-Host "❌ Script 'build' NO encontrado" -ForegroundColor Red
    exit 1
}

# Intentar build local
Write-Host "\n4. Intentando build local..." -ForegroundColor Yellow
Write-Host "Ejecutando: npm run build" -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "\n✅ BUILD EXITOSO" -ForegroundColor Green
    
    # Verificar directorio build
    if (Test-Path "build") {
        Write-Host "✅ Directorio build creado" -ForegroundColor Green
        $buildFiles = Get-ChildItem "build" -Recurse | Measure-Object
        Write-Host "📁 Archivos en build: $($buildFiles.Count)" -ForegroundColor Cyan
        
        # Verificar archivos principales
        if (Test-Path "build/index.html") {
            Write-Host "✅ index.html generado" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html NO generado" -ForegroundColor Red
        }
        
        if (Test-Path "build/static") {
            Write-Host "✅ Directorio static generado" -ForegroundColor Green
        } else {
            Write-Host "❌ Directorio static NO generado" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Directorio build NO creado" -ForegroundColor Red
    }
    
    Write-Host "\n🎯 CONCLUSIÓN: El frontend se puede buildear localmente" -ForegroundColor Green
    Write-Host "El problema está en la configuración de Railway, no en el código" -ForegroundColor Yellow
    
} else {
    Write-Host "\n❌ BUILD FALLÓ" -ForegroundColor Red
    Write-Host "🔍 El problema está en el código del frontend" -ForegroundColor Yellow
    Write-Host "Revisa los errores mostrados arriba" -ForegroundColor Yellow
}

Write-Host "\n=== FIN DEL DIAGNÓSTICO ===" -ForegroundColor Cyan