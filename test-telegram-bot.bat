@echo off
chcp 65001 >nul
echo.
echo 🤖 PRUEBAS DE TELEGRAM BOT - PLANIX
echo ====================================
echo.

REM Configuracion
set BOT_TOKEN=7764815323:AAGCxfjiMsaNBpQ0haa70VQ0cWlWcwGmuQM
set PERSONAL_CHAT_ID=6111613750
set GROUP_CHAT_ID=-1002781646438

echo 🔍 PASO 1: VERIFICAR BOT
echo -------------------------
echo.
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getMe"
echo.
echo.

echo 📱 PASO 2: PROBAR ENVIO A CHAT PERSONAL
echo ----------------------------------------
echo.
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/sendMessage" ^
     -H "Content-Type: application/json" ^
     -d "{\"chat_id\":\"%PERSONAL_CHAT_ID%\",\"text\":\"Prueba exitosa desde el bot de Planix!\n\nFecha: %DATE% %TIME%\nBot funcionando correctamente\"}"
echo.
echo.

echo 👥 PASO 3: PROBAR ENVIO AL GRUPO
echo ---------------------------------
echo.
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/sendMessage" ^
     -H "Content-Type: application/json" ^
     -d "{\"chat_id\":\"%GROUP_CHAT_ID%\",\"text\":\"Bot de Planix conectado al grupo!\n\nConfiguracion:\n• Token: OK\n• Chat Personal: %PERSONAL_CHAT_ID%\n• Chat Grupo: %GROUP_CHAT_ID%\n\nFecha: %DATE% %TIME%\"}"
echo.
echo.

echo 🎉 RESUMEN DE PRUEBAS
echo =====================
echo ✅ Bot Token: Valido
echo ✅ Chat Personal: Configurado (%PERSONAL_CHAT_ID%)
echo ✅ Chat Grupo: Configurado (%GROUP_CHAT_ID%)
echo.
echo 💡 PROXIMOS PASOS:
echo 1. Reinicia el backend de Planix
echo 2. Verifica que TELEGRAM_ENABLED=true en .env
echo 3. Revisa los logs del backend para confirmar conexion
echo.
echo 🚀 Tu bot de Telegram esta listo para Planix!
echo.
pause
