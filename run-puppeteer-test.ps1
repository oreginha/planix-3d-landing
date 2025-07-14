# Script para ejecutar pruebas de Puppeteer en Railway
Write-Host "🚀 Iniciando pruebas de Railway con Puppeteer..." -ForegroundColor Green

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Verificar si npm está disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está disponible." -ForegroundColor Red
    exit 1
}

# Instalar dependencias si no existen
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

# Verificar si puppeteer está instalado
try {
    npm list puppeteer --depth=0 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "📦 Instalando Puppeteer..." -ForegroundColor Yellow
        npm install puppeteer
    } else {
        Write-Host "✅ Puppeteer ya está instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "📦 Instalando Puppeteer..." -ForegroundColor Yellow
    npm install puppeteer
}

# Verificar si axios está instalado
try {
    npm list axios --depth=0 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "📦 Instalando Axios..." -ForegroundColor Yellow
        npm install axios
    } else {
        Write-Host "✅ Axios ya está instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "📦 Instalando Axios..." -ForegroundColor Yellow
    npm install axios
}

Write-Host "" 
Write-Host "🧪 Ejecutando pruebas de Railway..." -ForegroundColor Cyan
Write-Host "" 

# Ejecutar el script de pruebas
try {
    node test-puppeteer-railway.js
    Write-Host "" 
    Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al ejecutar las pruebas: $_" -ForegroundColor Red
    exit 1
}

Write-Host "" 
Write-Host "📊 Resumen de URLs testeadas:" -ForegroundColor Cyan
Write-Host "🌐 Frontend: https://planix-frontend-production.up.railway.app" -ForegroundColor White
Write-Host "📡 Backend: https://planix-backend-node-production.up.railway.app" -ForegroundColor White
Write-Host "" 
Write-Host "✨ Pruebas finalizadas. Presiona cualquier tecla para continuar..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')