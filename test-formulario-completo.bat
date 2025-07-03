@echo off
setlocal enabledelayedexpansion
color 0A

echo.
echo ========================================
echo   PRUEBA COMPLETA DEL FORMULARIO
echo ========================================
echo.

:: Crear directorio de logs si no existe
if not exist "logs" mkdir logs

:: Generar timestamp para el log
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"
set "logfile=logs\test-formulario_%timestamp%.log"

echo Generando log en: %logfile%
echo.

:: Función para log con timestamp
:log
echo [%time%] %~1
echo [%time%] %~1 >> %logfile%
goto :eof

call :log "=== INICIO DE PRUEBAS ==="

:: PASO 1: Verificar que el backend está corriendo
call :log "PASO 1: Verificando backend..."
echo PASO 1: Verificando backend...

curl -s http://localhost:3001/health > temp_health.json 2>nul
if errorlevel 1 (
    call :log "ERROR: Backend no responde en localhost:3001"
    echo ❌ ERROR: Backend no responde en localhost:3001
    echo.
    echo SOLUCION:
    echo 1. Abrir nueva terminal
    echo 2. cd backend
    echo 3. npm run dev
    echo.
    echo Presiona cualquier tecla cuando el backend este corriendo...
    pause >nul
    goto :verificar_backend
) else (
    call :log "✅ Backend respondiendo correctamente"
    echo ✅ Backend respondiendo correctamente
)

:verificar_backend
del temp_health.json 2>nul

:: PASO 2: Probar endpoint de test
call :log "PASO 2: Probando endpoint de test..."
echo.
echo PASO 2: Probando endpoint de test...

curl -s http://localhost:3001/api/contact/test > temp_test.json 2>nul
if errorlevel 1 (
    call :log "ERROR: Endpoint de test no responde"
    echo ❌ ERROR: Endpoint de test no responde
) else (
    call :log "✅ Endpoint de test respondiendo"
    echo ✅ Endpoint de test respondiendo
    type temp_test.json >> %logfile%
)

del temp_test.json 2>nul

:: PASO 3: Probar formulario con datos válidos
call :log "PASO 3: Probando formulario con datos válidos..."
echo.
echo PASO 3: Probando formulario con datos válidos...

node test-formulario-contacto.js > temp_form_test.txt 2>&1
set "form_result=!errorlevel!"

echo Resultado del test:
type temp_form_test.txt
type temp_form_test.txt >> %logfile%

if !form_result! equ 0 (
    call :log "✅ Test del formulario completado"
    echo ✅ Test del formulario completado
) else (
    call :log "❌ Error en test del formulario"
    echo ❌ Error en test del formulario
)

del temp_form_test.txt 2>nul

:: PASO 4: Probar formulario con datos inválidos
call :log "PASO 4: Probando formulario con datos inválidos..."
echo.
echo PASO 4: Probando formulario con datos inválidos...

echo const fetch = require('node-fetch'); > test_invalid.js
echo const testData = { name: 'A', email: 'invalid-email', message: 'Corto' }; >> test_invalid.js
echo fetch('http://localhost:3001/api/contact', { >> test_invalid.js
echo   method: 'POST', headers: { 'Content-Type': 'application/json' }, >> test_invalid.js
echo   body: JSON.stringify(testData) >> test_invalid.js
echo }).then(r =^> r.json()).then(d =^> console.log('Validación:', JSON.stringify(d, null, 2))).catch(e =^> console.error('Error:', e.message)); >> test_invalid.js

node test_invalid.js > temp_invalid_test.txt 2>&1
echo Resultado test datos inválidos:
type temp_invalid_test.txt
type temp_invalid_test.txt >> %logfile%

del test_invalid.js temp_invalid_test.txt 2>nul

:: PASO 5: Verificar frontend
call :log "PASO 5: Verificando frontend..."
echo.
echo PASO 5: Verificando frontend...

curl -s http://localhost:3000 > temp_frontend.html 2>nul
if errorlevel 1 (
    call :log "WARNING: Frontend no responde en localhost:3000"
    echo ⚠️  WARNING: Frontend no responde en localhost:3000
    echo.
    echo Para probar frontend:
    echo 1. npm start (en la raíz del proyecto)
    echo 2. Abrir http://localhost:3000 en el navegador
) else (
    call :log "✅ Frontend respondiendo en localhost:3000"
    echo ✅ Frontend respondiendo en localhost:3000
)

del temp_frontend.html 2>nul

:: RESUMEN FINAL
echo.
echo ========================================
echo            RESUMEN DE PRUEBAS
echo ========================================
call :log "=== RESUMEN FINAL ==="

findstr "✅\|❌\|⚠️" %logfile% > temp_summary.txt
type temp_summary.txt

echo.
echo 📋 CHECKLIST PARA PRUEBA MANUAL:
echo.
echo [ ] 1. Backend corriendo (npm run dev en /backend)
echo [ ] 2. Frontend corriendo (npm start en raíz)
echo [ ] 3. Abrir http://localhost:3000
echo [ ] 4. Hacer clic en "Hablemos" o botón de contacto
echo [ ] 5. Completar formulario:
echo       - Nombre: Tu Nombre
echo       - Email: tu@email.com
echo       - Empresa: Tu Empresa (opcional)
echo       - Mensaje: Mensaje de prueba
echo [ ] 6. Enviar formulario
echo [ ] 7. Verificar mensaje de éxito
echo.
echo 📊 Log completo guardado en: %logfile%
echo.

del temp_summary.txt 2>nul

call :log "=== FIN DE PRUEBAS ==="

echo Presiona cualquier tecla para abrir el log...
pause >nul
notepad %logfile%

endlocal