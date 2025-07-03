@echo off
color 0E

echo.
echo 🌐 VERIFICACION DE RAILWAY - EMAILS EN PRODUCCION
echo ===============================================
echo.

echo 📋 CONFIGURACION NECESARIA EN RAILWAY:
echo.
echo Variables que deben estar en Railway Dashboard:
echo https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
echo.
echo SMTP_USER=planix.devteam@gmail.com
echo SMTP_PASS=lrgevipuawbholnk
echo TEST_MODE=false
echo EMAIL_TO=hola@planix.com.ar
echo EMAIL_FROM_NAME=Planix
echo EMAIL_FROM_EMAIL=noreply@planix.com.ar
echo.

echo 🧪 PROBANDO BACKEND EN RAILWAY...
echo.

echo 1. Health Check:
curl -w "\nStatus: %%{http_code}\n" https://planix-backend-node-production.up.railway.app/health

echo.
echo 2. Test de SMTP:
curl -w "\nStatus: %%{http_code}\n" https://planix-backend-node-production.up.railway.app/api/contact/test

echo.
echo 3. Test de formulario REAL en Railway:
echo {"name":"Test Formulario","email":"test@planix.com.ar","message":"Email de prueba desde script - si recibes esto, el email está funcionando en Railway"} > temp_railway_test.json

curl -X POST ^
  -H "Content-Type: application/json" ^
  -d @temp_railway_test.json ^
  -w "\nStatus: %%{http_code}\n" ^
  https://planix-backend-node-production.up.railway.app/api/contact

del temp_railway_test.json 2>nul

echo.
echo 📊 RESULTADOS:
echo.
echo ✅ Si Health Check = 200: Backend funcionando
echo ✅ Si SMTP Test = 200: SMTP configurado correctamente  
echo ✅ Si Formulario = 200: Emails se envían a hola@planix.com.ar
echo ❌ Si alguno falla: Verificar variables en Railway Dashboard
echo.

echo 🔧 ACCIONES PARA CONFIGURAR RAILWAY:
echo.
echo 1. Ir a: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
echo 2. Clic en servicio "planix-backend-node"
echo 3. Ir a Variables
echo 4. Verificar/agregar las variables mostradas arriba
echo 5. Restart del servicio si cambias variables
echo.

echo ⚠️  IMPORTANTE: Si el test del formulario da 200, 
echo    el email llegará REALMENTE a hola@planix.com.ar
echo.

pause
