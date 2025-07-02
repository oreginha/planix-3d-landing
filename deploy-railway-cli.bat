@echo off

echo.
echo === DEPLOY MANUAL RAILWAY COMO BACKUP ===
echo.

echo SITUACION ACTUAL:
echo   Variables Railway: PERFECTAS ✅
echo   GitHub Actions: Verificar manualmente
echo   Railway auto-deploy: CON PROBLEMAS
echo.

echo SOLUCION ALTERNATIVA - RAILWAY CLI:
echo.

echo 1. INSTALAR RAILWAY CLI (si no esta instalado):
echo    npm install -g @railway/cli
echo.

echo 2. LOGIN:
echo    railway login
echo.

echo 3. CONECTAR PROYECTO:
echo    railway link 16e84c2c-50d0-4c6f-b2a9-06c45c839272
echo.

echo 4. DEPLOY FRONTEND:
echo    railway up --service planix-3d-landing
echo.

echo 5. DEPLOY BACKEND:
echo    railway up --service planix-backend-node
echo.

echo VERIFICACION POST-DEPLOY:
echo   Frontend: https://planix-3d-landing-production.up.railway.app
echo   Backend: https://planix-backend-node-production.up.railway.app/health
echo.

echo NOTA: Con las variables perfectamente configuradas,
echo el backend deberia funcionar inmediatamente.
echo.

pause
