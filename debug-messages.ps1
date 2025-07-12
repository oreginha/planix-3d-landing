# Script para debuggear la estructura de mensajes
# ===============================================

# Configurar UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "DEBUGGING ESTRUCTURA DE MENSAJES" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# URLs
$BACKEND_URL = "https://planix-backend-node-production.up.railway.app"
$SESSION_ID = "chat_1752356881858_fvm4huyjl"  # Usar la sesión que acabamos de crear

Write-Host "Obteniendo mensajes de la sesión: $SESSION_ID" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

try {
    $sessionResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/chat/session/$SESSION_ID" -Method GET
    
    if ($sessionResponse.success) {
        $messages = $sessionResponse.data.messages
        Write-Host "   Total de mensajes: $($messages.Count)" -ForegroundColor White
        Write-Host ""
        
        for ($i = 0; $i -lt $messages.Count; $i++) {
            $msg = $messages[$i]
            Write-Host "   MENSAJE $($i + 1):" -ForegroundColor Yellow
            Write-Host "   -----------" -ForegroundColor Yellow
            Write-Host "   Sender: '$($msg.sender)'" -ForegroundColor White
            Write-Host "   Message: '$($msg.message)'" -ForegroundColor White
            Write-Host "   Timestamp: $($msg.timestamp)" -ForegroundColor White
            
            # Mostrar todas las propiedades del mensaje
            Write-Host "   Propiedades completas:" -ForegroundColor Gray
            $msg | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
            Write-Host ""
        }
        
        # Filtrar específicamente por sender 'admin'
        $adminMessages = $messages | Where-Object { $_.sender -eq 'admin' }
        Write-Host "MENSAJES DE ADMIN ENCONTRADOS: $($adminMessages.Count)" -ForegroundColor Cyan
        
        if ($adminMessages.Count -gt 0) {
            foreach ($adminMsg in $adminMessages) {
                Write-Host "   ✅ Admin: $($adminMsg.message)" -ForegroundColor Green
            }
        } else {
            Write-Host "   ❌ No se encontraron mensajes con sender = 'admin'" -ForegroundColor Red
            
            # Mostrar todos los valores únicos de sender
            $senders = $messages | Select-Object -ExpandProperty sender | Sort-Object -Unique
            Write-Host "   Valores de 'sender' encontrados: $($senders -join ', ')" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "   Error obteniendo sesión: $($sessionResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception)" -ForegroundColor Red
}

Write-Host ""
Write-Host "ANÁLISIS COMPLETADO" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green