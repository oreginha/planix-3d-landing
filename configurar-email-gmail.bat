@echo off
echo.
echo 📧 CONFIGURACION DE EMAIL REAL - GMAIL
echo =====================================
echo.
echo Para habilitar emails reales necesitas:
echo.
echo 1. Una cuenta de Gmail para enviar
echo 2. Una "App Password" de Gmail
echo 3. Configurar las variables de entorno
echo.
echo PASOS:
echo.
echo 📱 PASO 1: Generar App Password en Gmail
echo    1. Ir a: https://myaccount.google.com/security
echo    2. Activar "2-Step Verification" si no está activo
echo    3. Ir a "App passwords"
echo    4. Generar password para "Mail"
echo    5. Copiar la password generada (16 caracteres)
echo.
echo 📝 PASO 2: Configurar variables
echo    SMTP_USER=tu-email@gmail.com
echo    SMTP_PASS=la-app-password-generada
echo    TEST_MODE=false
echo.
echo 📧 PASO 3: Email destino
echo    EMAIL_TO=hola@planix.com.ar  (ya configurado)
echo.
echo ¿Tienes una cuenta Gmail para configurar? (S/N)
set /p respuesta=

if /i "%respuesta%"=="S" (
    echo.
    echo Perfecto! Vamos a configurarlo...
    echo.
    echo Ingresa el email de Gmail que usarás para ENVIAR:
    set /p gmail_user=Email: 
    
    echo.
    echo Ingresa la App Password de Gmail (16 caracteres):
    set /p gmail_pass=Password: 
    
    echo.
    echo ¿Activar modo PRODUCCION? ^(S=emails reales, N=seguir en test^)
    set /p prod_mode=Producción (S/N): 
    
    if /i "!prod_mode!"=="S" (
        set test_mode_value=false
        echo ✅ Modo PRODUCCION - Emails se enviarán realmente
    ) else (
        set test_mode_value=true
        echo ⚠️ Modo TEST - Emails simulados
    )
    
    echo.
    echo Configurando backend/.env...
    
    :: Actualizar .env
    powershell -Command "(Get-Content backend\.env) -replace '^SMTP_USER=.*', 'SMTP_USER=!gmail_user!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace '^SMTP_PASS=.*', 'SMTP_PASS=!gmail_pass!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace '^TEST_MODE=.*', 'TEST_MODE=!test_mode_value!' | Set-Content backend\.env"
    
    echo ✅ Configuración actualizada!
    echo.
    echo 🔄 Reinicia el backend para aplicar cambios:
    echo    cd backend
    echo    npm run dev
    echo.
) else (
    echo.
    echo 📋 Alternativas sin Gmail:
    echo    1. Usar otro proveedor SMTP
    echo    2. Configurar servidor email propio
    echo    3. Usar servicios como SendGrid, Mailgun, etc.
    echo.
)

echo.
pause
