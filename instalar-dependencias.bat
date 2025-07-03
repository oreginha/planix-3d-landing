@echo off
echo.
echo 🔧 INSTALANDO DEPENDENCIAS PARA TESTS
echo ====================================
echo.

echo Instalando node-fetch...
npm install node-fetch

if errorlevel 1 (
    echo.
    echo ❌ Error al instalar node-fetch
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ node-fetch instalado correctamente
echo.

echo Ejecutando test mejorado...
node test-formulario-contacto.js

echo.
echo 📋 Otros tests disponibles:
echo   - test-formulario-exhaustivo.js (6 escenarios)
echo   - test-formulario-completo.bat (con logs)
echo.
pause
