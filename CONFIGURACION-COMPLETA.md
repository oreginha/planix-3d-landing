# GUÍA COMPLETA: CONFIGURACIÓN DE VARIABLES DE ENTORNO PLANIX
# ================================================================

## 🎯 RESUMEN DE LA CONFIGURACIÓN NECESARIA

### 1. RAILWAY DASHBOARD - BACKEND (planix-backend-node)
```
Ir a: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
Servicio: planix-backend-node > Variables

VARIABLES CRÍTICAS A CONFIGURAR:
- TEST_MODE=false (CAMBIAR DE true a false)
- SMTP_USER=tu-email@gmail.com (COMPLETAR)
- SMTP_PASS=tu-app-password-gmail (COMPLETAR)
```

### 2. RAILWAY DASHBOARD - FRONTEND (planix-3d-landing)  
```
Servicio: planix-3d-landing > Variables

VARIABLES YA CONFIGURADAS CORRECTAMENTE:
- VITE_API_URL=https://planix-backend-node-production.up.railway.app ✅
- VITE_CONTACT_EMAIL=hola@planix.com.ar ✅

OPCIONAL:
- VITE_ANALYTICS_ID=G-XXXXXXXXXX (reemplazar con ID real)
```

### 3. GITHUB SECRETS
```
Ir a: https://github.com/oreginha/planix-3d-landing/settings/secrets/actions

SECRETS REQUERIDOS:
- RAILWAY_TOKEN (obtener de https://railway.app/account/tokens)
- SMTP_USER (mismo que Railway)
- SMTP_PASS (mismo que Railway)
- VITE_ANALYTICS_ID (opcional)
```

### 4. ARCHIVOS CREADOS
```
✅ .github/workflows/deploy.yml (GitHub Actions pipeline)
✅ railway-backend-vars.env (guía de variables backend)
✅ railway-frontend-vars.env (guía de variables frontend)  
✅ github-secrets.env (guía de secrets GitHub)
✅ setup-variables.ps1 (script de configuración)
```

## 🚀 ORDEN DE EJECUCIÓN

### PASO 1: Configurar SMTP Gmail
1. Ir a https://myaccount.google.com/security
2. Habilitar verificación en 2 pasos
3. Crear contraseña de aplicación para "Planix Web"
4. Copiar la contraseña de 16 caracteres

### PASO 2: Configurar Railway Variables
1. Ir a Railway Dashboard
2. Servicio planix-backend-node > Variables
3. Cambiar TEST_MODE=false
4. Completar SMTP_USER y SMTP_PASS

### PASO 3: Configurar GitHub Secrets  
1. Obtener Railway token de https://railway.app/account/tokens
2. Ir a GitHub repo > Settings > Secrets
3. Agregar RAILWAY_TOKEN, SMTP_USER, SMTP_PASS

### PASO 4: Activar Pipeline
1. git add .github/workflows/deploy.yml
2. git commit -m "feat: Agregar GitHub Actions pipeline"
3. git push origin backend-nodejs

### PASO 5: Verificar Funcionamiento
1. El push activará automáticamente GitHub Actions
2. Verificar build y deploy en GitHub Actions tab
3. Verificar URLs:
   - Frontend: https://planix-3d-landing-production.up.railway.app
   - Backend: https://planix-backend-node-production.up.railway.app/health

## ⚠️ PROBLEMAS COMUNES

### Railway No Despliega
- Verificar que RAILWAY_TOKEN tenga permisos
- Verificar que las variables estén en el servicio correcto
- Revisar logs en Railway Dashboard

### Build Falla en GitHub Actions
- Verificar que todas las variables estén configuradas
- Revisar logs de GitHub Actions para errores específicos
- Verificar que los secrets estén bien configurados

### SMTP No Funciona
- Verificar que la contraseña de aplicación sea correcta
- Verificar que TEST_MODE=false en producción
- Revisar logs del backend para errores SMTP

## 📞 CONTACTO Y SOPORTE
- Documentación Railway: https://docs.railway.app
- Documentación GitHub Actions: https://docs.github.com/actions
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
