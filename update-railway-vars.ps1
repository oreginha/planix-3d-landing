# Script para actualizar variables de entorno en Railway
# ====================================================

Write-Host 'ACTUALIZANDO VARIABLES EN RAILWAY' -ForegroundColor Green
Write-Host '=====================================' -ForegroundColor Green
Write-Host ''

# Leer token de Railway
$railwayToken = $env:RAILWAY_TOKEN
if (-not $railwayToken) {
    Write-Host 'ERROR: RAILWAY_TOKEN no encontrado en variables de entorno' -ForegroundColor Red
    Write-Host 'Ejecuta: $env:RAILWAY_TOKEN = "tu_token_aqui"' -ForegroundColor Yellow
    exit 1
}

# IDs del proyecto (estos deben obtenerse de Railway)
$projectId = 'f9c4c5e4-8b2a-4d3e-9f1a-2b3c4d5e6f7g'  # Reemplazar con ID real
$environmentId = 'prod'  # o el ID del environment de producción

# Variables a actualizar
$variables = @{
    'RATE_LIMIT_ENABLED' = 'false'
    'RATE_LIMIT_MAX_REQUESTS' = '100'
    'RATE_LIMIT_WINDOW_MINUTES' = '1'
}

$headers = @{
    'Authorization' = "Bearer $railwayToken"
    'Content-Type' = 'application/json'
}

try {
    Write-Host 'Actualizando variables de rate limiting...' -ForegroundColor Cyan
    
    foreach ($var in $variables.GetEnumerator()) {
        $body = @{
            name = $var.Key
            value = $var.Value
        } | ConvertTo-Json
        
        Write-Host "Actualizando $($var.Key) = $($var.Value)" -ForegroundColor White
        
        $url = "https://backboard.railway.app/graphql"
        
        # GraphQL mutation para actualizar variable
        $mutation = @{
            query = @"
                mutation VariableUpsert(`$input: VariableUpsertInput!) {
                    variableUpsert(input: `$input) {
                        id
                        name
                        value
                    }
                }
"@
            variables = @{
                input = @{
                    projectId = $projectId
                    environmentId = $environmentId
                    name = $var.Key
                    value = $var.Value
                }
            }
        } | ConvertTo-Json -Depth 10
        
        try {
            $response = Invoke-RestMethod -Uri $url -Method POST -Body $mutation -Headers $headers
            
            if ($response.data.variableUpsert) {
                Write-Host "  SUCCESS: $($var.Key) actualizada" -ForegroundColor Green
            } else {
                Write-Host "  ERROR: No se pudo actualizar $($var.Key)" -ForegroundColor Red
                if ($response.errors) {
                    Write-Host "  $($response.errors[0].message)" -ForegroundColor Red
                }
            }
        } catch {
            Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host ''
    Write-Host 'VARIABLES ACTUALIZADAS' -ForegroundColor Green
    Write-Host '======================' -ForegroundColor Green
    Write-Host 'RATE_LIMIT_ENABLED = false (deshabilitado)' -ForegroundColor White
    Write-Host 'RATE_LIMIT_MAX_REQUESTS = 100' -ForegroundColor White
    Write-Host 'RATE_LIMIT_WINDOW_MINUTES = 1' -ForegroundColor White
    
    Write-Host ''
    Write-Host 'SIGUIENTE PASO: Redeploy del backend' -ForegroundColor Yellow
    Write-Host 'Las variables se aplicaran en el proximo deployment' -ForegroundColor White
    
} catch {
    Write-Host "ERROR GENERAL: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ''
    Write-Host 'ALTERNATIVA: Actualizar manualmente en Railway Dashboard' -ForegroundColor Yellow
    Write-Host '1. Ir a railway.app' -ForegroundColor White
    Write-Host '2. Seleccionar proyecto Planix Backend' -ForegroundColor White
    Write-Host '3. Variables tab' -ForegroundColor White
    Write-Host '4. Actualizar RATE_LIMIT_ENABLED = false' -ForegroundColor White
    Write-Host '5. Redeploy el servicio' -ForegroundColor White
}

Write-Host ''
Write-Host 'VERIFICACION:' -ForegroundColor Cyan
Write-Host 'Ejecuta test-webhook.ps1 despues del redeploy' -ForegroundColor White