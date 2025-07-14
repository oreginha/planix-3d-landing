# 🚨 PROBLEMA IDENTIFICADO: CONFIGURACIÓN RAILWAY INCORRECTA

## 📋 DIAGNÓSTICO DEL PROBLEMA

### ❌ PROBLEMA ACTUAL:
Ambos servicios (frontend y backend) están apuntando al **MISMO REPOSITORIO** pero con configuraciones conflictivas:

1. **Servicio Frontend (planix-3d-landing)**:
   - Repositorio: `oreginha/planix-3d-landing`
   - Root Directory: `/` (raíz del proyecto)
   - railway.json: Configurado para React (`npx serve -s build`)
   - .railwayignore: Excluye carpeta `backend/`

2. **Servicio Backend (planix-backend-node)**:
   - Repositorio: `oreginha/planix-3d-landing` (MISMO REPO)
   - Root Directory: `/backend` (debería estar configurado así)
   - railway.json: Configurado para Node.js (`npm start`)
   - .railwayignore: Configurado para backend

### 🔍 EVIDENCIA DEL PROBLEMA:
- GitHub Actions intenta deployar ambos servicios desde el mismo repo
- Los IDs de servicio en el pipeline son diferentes:
  - Frontend: `a28eaffb-dc0b-434a-8556-512e4f028113`
  - Backend: `4e2be212-b608-4241-b56d-e004b6dcf0e2`
- Ambos servicios comparten el mismo proyecto Railway: `16e84c2c-50d0-4c6f-b2a9-06c45c839272`

## ✅ SOLUCIÓN CORRECTA

### OPCIÓN 1: CONFIGURACIÓN MONOREPO (RECOMENDADA)

#### 1. Configurar Root Directory en Railway Dashboard

**Para el servicio Backend:**
```
1. Ir a Railway Dashboard
2. Proyecto: planix-backend-node
3. Settings > Deploy
4. Root Directory: backend
5. Build Command: npm run build
6. Start Command: npm start
```

**Para el servicio Frontend:**
```
1. Ir a Railway Dashboard  
2. Proyecto: planix-3d-landing
3. Settings > Deploy
4. Root Directory: . (raíz)
5. Build Command: npm run build
6. Start Command: npx serve -s build -l $PORT
```

#### 2. Verificar Variables de Entorno

**Backend Variables:**
```
NODE_ENV=production
PORT=3001
TEST_MODE=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-gmail
EMAIL_FROM_NAME=Planix Web
EMAIL_FROM_EMAIL=noreply@planix.com.ar
EMAIL_TO=hola@planix.com.ar
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app,https://planix.com.ar
```

**Frontend Variables:**
```
VITE_API_URL=https://planix-backend-node-production.up.railway.app
VITE_CONTACT_EMAIL=hola@planix.com.ar
GENERATE_SOURCEMAP=false
REACT_APP_NODE_ENV=production
```

#### 3. Actualizar GitHub Actions

```yaml
# Cambiar el deployment para usar root directory correcto
- name: Deploy Frontend to Railway
  run: |
    railway login --token ${{ secrets.RAILWAY_TOKEN }}
    railway link 16e84c2c-50d0-4c6f-b2a9-06c45c839272 --environment production
    railway up --service a28eaffb-dc0b-434a-8556-512e4f028113

- name: Deploy Backend to Railway  
  run: |
    cd backend
    railway up --service 4e2be212-b608-4241-b56d-e004b6dcf0e2
```

### OPCIÓN 2: REPOSITORIOS SEPARADOS

#### 1. Crear repositorio separado para backend
```bash
# Crear nuevo repo: oreginha/planix-backend
# Mover contenido de /backend al nuevo repo
# Configurar Railway backend para apuntar al nuevo repo
```

#### 2. Mantener frontend en repo actual
```bash
# Eliminar carpeta /backend del repo actual
# Configurar Railway frontend para repo actual
```

## 🔧 PASOS INMEDIATOS PARA SOLUCIONAR

### 1. Verificar Configuración Railway
```bash
# Ejecutar este script para verificar configuración actual
powershell -File verificar-railway-config.ps1
```

### 2. Configurar Root Directory
```
1. Railway Dashboard > planix-backend-node > Settings > Deploy
2. Root Directory: backend
3. Save Changes
```

### 3. Probar Deployment Manual
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway link 16e84c2c-50d0-4c6f-b2a9-06c45c839272 --environment production
railway up --service 4e2be212-b608-4241-b56d-e004b6dcf0e2

# Deploy frontend
cd ..
railway up --service a28eaffb-dc0b-434a-8556-512e4f028113
```

### 4. Verificar Funcionamiento
```bash
# Backend health check
curl https://planix-backend-node-production.up.railway.app/health

# Frontend check
curl https://planix-3d-landing-production.up.railway.app
```

## 📊 URLS DE VERIFICACIÓN

- **Railway Project**: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272
- **Frontend URL**: https://planix-3d-landing-production.up.railway.app
- **Backend URL**: https://planix-backend-node-production.up.railway.app
- **Backend Health**: https://planix-backend-node-production.up.railway.app/health

## ⚠️ NOTAS IMPORTANTES

1. **Root Directory es CRÍTICO**: Sin esto, Railway no sabe qué parte del repo deployar
2. **Variables de Entorno**: Deben estar en el servicio correcto
3. **GitHub Actions**: Debe usar `cd backend` antes de deployar backend
4. **SMTP**: Configurar credenciales reales para emails en producción

---

**Estado**: 🔴 PROBLEMA IDENTIFICADO - REQUIERE CONFIGURACIÓN RAILWAY
**Prioridad**: 🚨 ALTA - Deployment no funciona correctamente
**Tiempo estimado**: 15-30 minutos para solucionar