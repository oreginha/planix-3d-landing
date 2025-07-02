@echo off
chcp 65001 >nul

echo.
echo === VERIFICADOR DE CONFIGURACIÓN PLANIX ===
echo.

echo 🔧 CREDENCIALES GMAIL:
echo   Email: planix.devteam@gmail.com
echo   App Password: lrge vipu awbh olnk
echo.

echo 🚂 VARIABLES PARA RAILWAY BACKEND:
echo   Ir a: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
echo   Servicio: planix-backend-node ^> Variables
echo.
echo   Configurar estas 3 variables:
echo   ✅ TEST_MODE=false
echo   ✅ SMTP_USER=planix.devteam@gmail.com
echo   ✅ SMTP_PASS=lrgevipuawbholnk
echo.

echo 🔑 SECRETS PARA GITHUB:
echo   Ir a: https://github.com/oreginha/planix-3d-landing/settings/secrets/actions
echo.
echo   Crear estos 3 secrets:
echo   ✅ RAILWAY_TOKEN=^(obtener de https://railway.app/account/tokens^)
echo   ✅ SMTP_USER=planix.devteam@gmail.com
echo   ✅ SMTP_PASS=lrgevipuawbholnk
echo.

echo 📁 ARCHIVOS DEL PROYECTO:
if exist ".github\workflows\deploy.yml" (
    echo   ✅ Pipeline GitHub Actions
) else (
    echo   ❌ Pipeline GitHub Actions ^(faltante^)
)

if exist "railway-backend-vars.env" (
    echo   ✅ Guía variables Railway
) else (
    echo   ❌ Guía variables Railway ^(faltante^)
)

echo.
echo 🎯 CUANDO TERMINES LA CONFIGURACIÓN:
echo   1. Ejecutar: deploy-configuracion.bat
echo   2. O manualmente: git add . ^&^& git commit ^&^& git push
echo.

pause
