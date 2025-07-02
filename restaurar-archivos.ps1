#!/usr/bin/env powershell

Write-Host "=== RESTAURACIÓN DE ARCHIVOS CORRUPTOS ===" -ForegroundColor Red
Write-Host ""

# Verificar git status
Write-Host "📋 Estado actual de git:" -ForegroundColor Blue
git status --porcelain

Write-Host ""
Write-Host "🔄 Restaurando PortfolioSection.tsx desde git..." -ForegroundColor Blue

# Restaurar archivo desde HEAD
git checkout HEAD -- src/components/PortfolioSection.tsx

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Archivo restaurado exitosamente" -ForegroundColor Green
    
    # Verificar tamaño del archivo
    $fileInfo = Get-Item "src/components/PortfolioSection.tsx" -ErrorAction SilentlyContinue
    if ($fileInfo) {
        Write-Host "📊 Tamaño del archivo: $($fileInfo.Length) bytes" -ForegroundColor Cyan
    }
    
} else {
    Write-Host "❌ Error restaurando archivo" -ForegroundColor Red
    Write-Host "Intentando alternativa..." -ForegroundColor Yellow
    
    # Listar archivos disponibles en el último commit
    Write-Host ""
    Write-Host "📁 Archivos en el último commit:" -ForegroundColor Blue
    git ls-tree -r HEAD --name-only | findstr Portfolio
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
