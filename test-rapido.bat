@echo off
color 0B
echo.
echo ⚡ PRUEBA RAPIDA DEL FORMULARIO
echo ==============================
echo.

:: Verificar backend
echo 🔍 Verificando backend...
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend no responde. Ejecuta: cd backend ^&^& npm run dev
    pause
    exit /b 1
)
echo ✅ Backend OK

:: Ejecutar test
echo.
echo 🧪 Ejecutando test...
node test-formulario-contacto.js

echo.
echo 📋 Para test exhaustivo: test-formulario-exhaustivo.js
echo 📊 Para test completo con logs: test-formulario-completo.bat
echo.
pause
