@echo off
echo.
echo 🔧 INSTALANDO DEPENDENCIAS PARA TESTS
echo ====================================
echo.

echo Instalando node-fetch...
npm install node-fetch

echo.
echo ✅ Dependencias instaladas
echo.
echo Ejecutando test...
.\test-rapido.bat
