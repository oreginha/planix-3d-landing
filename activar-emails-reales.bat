@echo off
setlocal enabledelayedexpansion
color 0C

echo.
echo 🚀 ACTIVAR MODO PRODUCCION - EMAILS REALES
echo =========================================
echo.

echo ⚠️  ATENCION: Esto activará el envío de emails REALES
echo.
echo 📧 Configuración actual:
echo    SMTP_USER: planix.devteam@gmail.com
echo    EMAIL_TO: planix.devteam@gmail.com
echo    TEST_MODE: Será cambiado a FALSE
echo.
echo Los emails del formulario llegarán a: planix.devteam@gmail.com
echo.
set /p confirmar=¿Confirmas activar emails reales? (S/N): 

if /i "!confirmar!"=="S" (
    echo.
    echo 🔧 Activando modo producción...
    
    :: Cambiar TEST_MODE a false
    powershell -Command "(Get-Content backend\.env) -replace '^TEST_MODE=.*', 'TEST_MODE=false' | Set-Content backend\.env"
    
    echo ✅ TEST_MODE cambiado a false
    echo.
    echo 🔄 IMPORTANTE: Reinicia el backend para aplicar cambios:
    echo    1. Detener el backend actual (Ctrl+C)
    echo    2. cd backend
    echo    3. npm run dev
    echo.
    echo 📧 Ahora los emails se enviarán realmente a planix.devteam@gmail.com
    echo.
    
    echo ¿Quieres probar el envío de email real ahora? (S/N)
    set /p probar=
    
    if /i "!probar!"=="S" (
        echo.
        echo 🧪 Esperando que reinicies el backend...
        echo Presiona ENTER cuando el backend esté corriendo en modo producción...
        pause >nul
        
        echo.
        echo 📧 Enviando email de prueba REAL...
        node test-formulario-contacto.js
        
        echo.
        echo ✅ Si el test fue exitoso, el email llegó a planix.devteam@gmail.com
        echo.
    )
    
) else (
    echo.
    echo ❌ Activación cancelada. Manteniéndose en modo TEST.
)

echo.
echo 📋 Para volver a modo TEST:
echo    Cambiar TEST_MODE=true en backend\.env
echo.
pause
