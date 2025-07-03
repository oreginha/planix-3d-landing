@echo off
setlocal enabledelayedexpansion
color 0B
echo.
echo ⚡ PRUEBA RAPIDA SIN DEPENDENCIAS
echo ================================
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

echo.
echo 🧪 Probando formulario con datos válidos...

:: Crear JSON temporal
echo {"name":"Juan Pérez","email":"juan@test.com","company":"Mi Empresa","message":"Este es un mensaje de prueba para verificar que el formulario funciona correctamente después de los cambios."} > temp_data.json

:: Hacer POST request
curl -X POST ^
  -H "Content-Type: application/json" ^
  -d @temp_data.json ^
  -w "\nStatus: %%{http_code}\n" ^
  http://localhost:3001/api/contact

echo.
echo 🧪 Probando con datos inválidos...

:: JSON con email inválido
echo {"name":"A","email":"email-invalido","message":"Corto"} > temp_invalid.json

curl -X POST ^
  -H "Content-Type: application/json" ^
  -d @temp_invalid.json ^
  -w "\nStatus: %%{http_code}\n" ^
  http://localhost:3001/api/contact

:: Limpiar archivos temporales
del temp_data.json temp_invalid.json 2>nul

echo.
echo ✅ Pruebas completadas
echo.
echo 📋 Ahora prueba en el navegador:
echo    1. Abre http://localhost:3000
echo    2. Haz clic en el botón de contacto
echo    3. Completa y envía el formulario
echo.
pause
