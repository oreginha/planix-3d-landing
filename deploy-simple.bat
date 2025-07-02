@echo off
setlocal enabledelayedexpansion

echo.
echo === DEPLOY CON CONFIGURACION COMPLETA ===
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ERROR: Ejecutar desde el directorio raiz del proyecto
    pause
    exit /b 1
)

echo Verificando archivos creados...

if exist ".github\workflows\deploy.yml" (
    echo   OK - deploy.yml
) else (
    echo   FALTA - deploy.yml
)

if exist "railway-backend-vars.env" (
    echo   OK - railway-backend-vars.env
) else (
    echo   FALTA - railway-backend-vars.env
)

if exist "railway-frontend-vars.env" (
    echo   OK - railway-frontend-vars.env
) else (
    echo   FALTA - railway-frontend-vars.env
)

echo.
echo Estado del repositorio:
git status --short

echo.
echo CONFIGURACION APLICADA:
echo   Gmail App Password: lrge vipu awbh olnk
echo   Email: planix.devteam@gmail.com
echo   Railway Variables: Configurar manualmente
echo   GitHub Secrets: Configurar manualmente

echo.
echo VARIABLES PARA RAILWAY BACKEND:
echo   TEST_MODE=false
echo   SMTP_USER=planix.devteam@gmail.com
echo   SMTP_PASS=lrgevipuawbholnk

echo.
echo SECRETS PARA GITHUB:
echo   RAILWAY_TOKEN=(obtener de Railway dashboard)
echo   SMTP_USER=planix.devteam@gmail.com
echo   SMTP_PASS=lrgevipuawbholnk

echo.
set /p "confirm=Continuar con commit y push? (y/n): "

if /i not "%confirm%"=="y" (
    echo.
    echo Commit cancelado
    echo Configurar primero Railway y GitHub Secrets manualmente
    goto end
)

echo.
echo Agregando archivos...
git add .github/
git add *.env
git add *.md
git add *.ps1
git add *.bat

echo Haciendo commit...
git commit -m "feat: Configurar CI/CD completo con variables de entorno y pipeline GitHub Actions - Agregar pipeline deploy.yml - Configurar variables de entorno para Railway - Configurar secrets para GitHub Actions - Credenciales SMTP planix.devteam@gmail.com - Documentacion completa de configuracion"

if errorlevel 1 (
    echo ERROR en commit
    goto end
)

echo COMMIT EXITOSO

echo.
echo Haciendo push...
git push origin backend-nodejs

if errorlevel 1 (
    echo ERROR en push
    goto end
)

echo PUSH EXITOSO!
echo.
echo EL PIPELINE SE ACTIVARA AUTOMATICAMENTE
echo.
echo URLs para monitorear:
echo - GitHub Actions: https://github.com/oreginha/planix-3d-landing/actions
echo - Frontend: https://planix-3d-landing-production.up.railway.app
echo - Backend: https://planix-backend-node-production.up.railway.app/health
echo.
echo El pipeline tardara 3-5 minutos en completarse

:end
echo.
pause
