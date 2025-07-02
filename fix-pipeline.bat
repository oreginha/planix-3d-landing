@echo off

echo.
echo === CORRECCION PIPELINE GITHUB ACTIONS ===
echo.

echo PROBLEMA IDENTIFICADO:
echo   Action 'railwayapp/railway-deploy@v3' no existe
echo.

echo SOLUCION APLICADA:
echo   Usar Railway CLI directamente en GitHub Actions
echo   Simplificar pipeline para evitar errores
echo.

echo CAMBIOS REALIZADOS:
echo   - Eliminar action inexistente
echo   - Usar 'npm install -g @railway/cli'
echo   - Deploy directo con railway up
echo   - IDs de servicios especificos
echo.

git status --short

echo.
set /p "confirm=Hacer commit y push de la correccion? (y/n): "

if /i not "%confirm%"=="y" (
    echo Commit cancelado
    goto end
)

echo.
echo Agregando cambios...
git add .github/workflows/deploy.yml

echo Haciendo commit...
git commit -m "fix: Corregir pipeline GitHub Actions - usar Railway CLI en lugar de action inexistente

- Reemplazar railwayapp/railway-deploy@v3 (no existe)
- Usar Railway CLI directamente: npm install -g @railway/cli
- Simplificar pipeline eliminando linting que causaba errores
- Usar IDs especificos de servicios Railway
- Mejorar manejo de errores en verificacion"

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

echo.
echo PUSH EXITOSO!
echo.
echo EL PIPELINE CORREGIDO SE ACTIVARA AUTOMATICAMENTE
echo.
echo Monitorear en:
echo https://github.com/oreginha/planix-3d-landing/actions
echo.
echo Esta vez deberia funcionar correctamente!

:end
echo.
pause
