@echo off
color 0A

echo.
echo 🔍 VERIFICACION DE CONFIGURACION EMAIL
echo =====================================
echo.

echo 📋 CONFIGURACION LOCAL (.env):
echo.
findstr "SMTP_USER\|SMTP_PASS\|EMAIL_TO\|TEST_MODE\|EMAIL_FROM" backend\.env
echo.

echo 🔧 VERIFICANDO BACKEND...
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend no responde. Ejecuta: cd backend ^&^& npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ Backend respondiendo
echo.

echo 🧪 PROBANDO CONEXION SMTP...
curl -s http://localhost:3001/api/contact/test 2>nul

echo.
echo.
echo 📊 ESTADO ACTUAL:
echo.
findstr "TEST_MODE" backend\.env
echo.
findstr "TEST_MODE" backend\.env | findstr "false" >nul
if errorlevel 1 (
    echo 🧪 MODO: TEST ^(emails simulados^)
    echo 📧 Los emails NO se envían realmente
    echo.
    echo Para activar emails reales:
    echo    .\activar-emails-reales.bat
) else (
    echo 🚀 MODO: PRODUCCION ^(emails REALES^)
    echo 📧 Los emails se envían a: hola@planix.com.ar
    echo.
    echo ⚠️  Los emails del formulario llegarán realmente
)

echo.
pause
