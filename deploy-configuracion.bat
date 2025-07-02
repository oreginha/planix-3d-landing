@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo === DEPLOY CON CONFIGURACIÓN COMPLETA ===
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ ERROR: Ejecutar desde el directorio raíz del proyecto
    pause
    exit /b 1
)

echo 📋 Verificando archivos creados...

set "filesOk=true"
set "files=.github\workflows\deploy.yml railway-backend-vars.env railway-frontend-vars.env github-secrets.env CONFIGURACION-COMPLETA.md"

for %%f in (%files%) do (
    if exist "%%f" (
        echo   ✅ %%f
    ) else (
        echo   ❌ %%f ^(faltante^)
        set "filesOk=false"
    )
)

echo.
echo 📦 Estado del repositorio:
git status --short

echo.
echo 🔧 CONFIGURACIÓN APLICADA:
echo   ✅ Gmail App Password: lrge vipu awbh olnk
echo   ✅ Email: planix.devteam@gmail.com
echo   🔄 Railway Variables: Configurar manualmente
echo   🔄 GitHub Secrets: Configurar manualmente

echo.
echo 📋 VARIABLES PARA RAILWAY BACKEND:
echo   TEST_MODE=false
echo   SMTP_USER=planix.devteam@gmail.com
echo   SMTP_PASS=lrgevipuawbholnk

echo.
echo 🔑 SECRETS PARA GITHUB:
echo   RAILWAY_TOKEN=^(obtener de Railway dashboard^)
echo   SMTP_USER=planix.devteam@gmail.com
echo   SMTP_PASS=lrgevipuawbholnk

echo.
set /p "confirm=¿Continuar con commit y push? (y/n): "

if /i "%confirm%"=="y" goto proceed
if /i "%confirm%"=="yes" goto proceed

echo.
echo ❌ Commit cancelado
echo Configurar primero Railway y GitHub Secrets manualmente
goto end

:proceed
echo.
echo 📦 Agregando archivos...
git add .github/
git add *.env
git add *.md
git add *.ps1
git add *.bat

echo 💾 Haciendo commit...
git commit -m "feat: Configurar CI/CD completo con variables de entorno y pipeline GitHub Actions

- Agregar pipeline .github/workflows/deploy.yml
- Configurar variables de entorno para Railway
- Configurar secrets para GitHub Actions
- Credenciales SMTP: planix.devteam@gmail.com
- Documentación completa de configuración"

if errorlevel 1 (
    echo ❌ Error en commit
    goto end
)

echo ✅ Commit exitoso

echo.
echo 🚀 Haciendo push...
git push origin backend-nodejs

if errorlevel 1 (
    echo ❌ Error en push
    goto end
)

echo ✅ Push exitoso!
echo.
echo 🎯 EL PIPELINE SE ACTIVARÁ AUTOMÁTICAMENTE
echo.
echo 📊 URLs para monitorear:
echo - GitHub Actions: https://github.com/oreginha/planix-3d-landing/actions
echo - Frontend: https://planix-3d-landing-production.up.railway.app
echo - Backend: https://planix-backend-node-production.up.railway.app/health
echo.
echo ⏱️ El pipeline tardará 3-5 minutos en completarse

:end
echo.
pause
