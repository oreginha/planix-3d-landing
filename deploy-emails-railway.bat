@echo off
color 0B

echo.
echo 🚀 DEPLOY A RAILWAY - EMAILS CONFIGURADOS
echo ========================================
echo.

echo 📧 CAMBIOS REALIZADOS:
echo    EMAIL_TO cambiado a: planix.devteam@gmail.com
echo    SMTP configurado con credenciales reales
echo.

echo 🔍 Verificando rama actual...
git branch --show-current

echo.
echo 📋 Estado del repositorio:
git status --porcelain

echo.
echo 🚀 Haciendo commit y push para activar deploy...
echo.

git add .
git commit -m "feat: Configurar emails reales - destino planix.devteam@gmail.com

- Actualizar EMAIL_TO a planix.devteam@gmail.com
- Configurar credenciales SMTP reales en .env
- Preparar para deploy automático en Railway
- Variables SMTP ya configuradas en Railway Dashboard"

echo.
echo 📤 Pushing a Railway...
git push origin backend-nodejs

echo.
echo ✅ DEPLOY INICIADO
echo.
echo 🌐 Verificar deploy en:
echo    https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
echo.
echo 📧 Los emails llegarán a: planix.devteam@gmail.com
echo.

echo ⏳ Esperando deploy... (2-3 minutos típico)
echo.
echo Presiona ENTER para probar el deploy cuando esté listo...
pause >nul

echo.
echo 🧪 PROBANDO DEPLOY EN RAILWAY...
echo.

echo 1. Health Check:
curl -w "\nStatus: %%{http_code}\n" https://planix-backend-node-production.up.railway.app/health

echo.
echo 2. Test SMTP:
curl -w "\nStatus: %%{http_code}\n" https://planix-backend-node-production.up.railway.app/api/contact/test

echo.
echo 3. Test EMAIL REAL:
echo {"name":"Test Deploy","email":"test@planix.com.ar","message":"Test de deploy - este email debería llegar a planix.devteam@gmail.com"} > temp_deploy_test.json

curl -X POST ^
  -H "Content-Type: application/json" ^
  -d @temp_deploy_test.json ^
  -w "\nStatus: %%{http_code}\n" ^
  https://planix-backend-node-production.up.railway.app/api/contact

del temp_deploy_test.json 2>nul

echo.
echo 📊 RESULTADOS:
echo ✅ Si todos dan 200: Deploy exitoso y emails funcionando
echo 📧 Si el test de email da 200: email enviado a planix.devteam@gmail.com
echo.

pause
