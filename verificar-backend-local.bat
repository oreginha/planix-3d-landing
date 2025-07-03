@echo off

echo.
echo === VERIFICAR BACKEND LOCAL ===
echo.

echo Verificando si el backend esta corriendo...

curl http://localhost:3001/health 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: Backend no esta corriendo en localhost:3001
    echo.
    echo SOLUCION:
    echo 1. Abrir nueva terminal
    echo 2. cd backend
    echo 3. npm run dev
    echo.
    echo Presiona cualquier tecla cuando el backend este corriendo...
    pause >nul
) else (
    echo OK: Backend respondiendo en localhost:3001
)

echo.
echo Probando endpoint de test...
curl http://localhost:3001/api/contact/test 2>nul
if errorlevel 1 (
    echo ERROR: Endpoint de contacto no responde
) else (
    echo OK: Endpoint de contacto funcionando
)

echo.
echo Verificando variables de entorno del backend...
echo Las siguientes variables deben estar configuradas:
echo - TEST_MODE=true (para desarrollo local)
echo - SMTP_HOST=smtp.gmail.com
echo - EMAIL_TO=hola@planix.com.ar
echo.

pause
