Write-Host "🔍 Testing Backend Connectivity..." -ForegroundColor Green

# Test Health Check
Write-Host "Testing health check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Health check successful:" -ForegroundColor Green
    $healthResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Contact Endpoint
Write-Host "`nTesting contact endpoint..." -ForegroundColor Yellow
try {
    $contactBody = @{
        name = "Test User"
        email = "test@example.com"
        message = "Este es un mensaje de prueba más largo para verificar que el backend funciona correctamente"
    } | ConvertTo-Json

    $contactResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -Headers @{"Content-Type"="application/json"} -Body $contactBody
    Write-Host "✅ Contact endpoint successful:" -ForegroundColor Green
    $contactResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Contact endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "Testing completed!" -ForegroundColor Green
