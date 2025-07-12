# Test Complete Frontend-Backend Communication
# This script tests the complete flow after corrections

Write-Host "=== Testing Complete Frontend-Backend Communication ===" -ForegroundColor Green
Write-Host ""

# URLs
$frontendUrl = "https://planix-frontend-production.up.railway.app"
$backendUrl = "https://planix-backend-node-production.up.railway.app"

# Test 1: Frontend availability
Write-Host "1. Testing Frontend availability..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -Method GET -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is available" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend returned status: $($frontendResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Backend health
Write-Host "\n2. Testing Backend health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Backend health: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Create chat session
Write-Host "\n3. Creating chat session..." -ForegroundColor Yellow
try {
    $chatResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat" -Method POST -ContentType "application/json" -Body '{}' -TimeoutSec 10
    $sessionId = $chatResponse.sessionId
    Write-Host "   ✅ Chat session created: $sessionId" -ForegroundColor Green
    
    # Test 4: Send message
    Write-Host "\n4. Sending test message..." -ForegroundColor Yellow
    $messageBody = @{
        message = "Hola, necesito ayuda con desarrollo web"
        sessionId = $sessionId
    } | ConvertTo-Json
    
    $messageResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/message" -Method POST -ContentType "application/json" -Body $messageBody -TimeoutSec 10
    Write-Host "   ✅ Message sent successfully" -ForegroundColor Green
    Write-Host "   Bot response: $($messageResponse.response)" -ForegroundColor Cyan
    
    # Test 5: Simulate Telegram webhook (admin intervention)
    Write-Host "\n5. Simulating Telegram admin intervention..." -ForegroundColor Yellow
    $webhookBody = @{
        message = @{
            text = "Hola! Soy un administrador respondiendo desde Telegram. ¿En qué más puedo ayudarte?"
            chat = @{
                id = $sessionId
            }
        }
    } | ConvertTo-Json -Depth 3
    
    $webhookResponse = Invoke-RestMethod -Uri "$backendUrl/webhook/telegram" -Method POST -ContentType "application/json" -Body $webhookBody -TimeoutSec 10
    Write-Host "   ✅ Telegram webhook processed" -ForegroundColor Green
    
    # Test 6: Verify messages in session
    Write-Host "\n6. Verifying all messages in session..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2  # Wait for processing
    $messagesResponse = Invoke-RestMethod -Uri "$backendUrl/api/chat/$sessionId/messages" -Method GET -TimeoutSec 10
    
    Write-Host "   Total messages: $($messagesResponse.messages.Count)" -ForegroundColor Cyan
    foreach ($msg in $messagesResponse.messages) {
        $senderIcon = switch ($msg.sender) {
            'client' { '[USER]' }
            'bot' { '[BOT]' }
            'admin' { '[ADMIN]' }
            default { '[?]' }
        }
        Write-Host "   $senderIcon [$($msg.sender)]: $($msg.content)" -ForegroundColor White
    }
    
    # Check for admin message
    $adminMessages = $messagesResponse.messages | Where-Object { $_.sender -eq 'admin' }
    if ($adminMessages.Count -gt 0) {
        Write-Host "   ✅ Admin message found and should display on frontend" -ForegroundColor Green
    } else {
        Write-Host "   ❌ No admin message found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ Error in chat flow: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\n=== Test Summary ===" -ForegroundColor Green
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Cyan
Write-Host "Backend URL: $backendUrl" -ForegroundColor Cyan
Write-Host "If all tests passed, the frontend should now correctly display:" -ForegroundColor Yellow
Write-Host "- Client messages [USER]" -ForegroundColor White
Write-Host "- Bot responses [BOT]" -ForegroundColor White
Write-Host "- Admin messages from Telegram [ADMIN]" -ForegroundColor White
Write-Host "\nPlease test the chat interface at: $frontendUrl" -ForegroundColor Green