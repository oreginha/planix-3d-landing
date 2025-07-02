# GUÍA COMPLETA DEL PROYECTO PLANIX - CLAUDE DESKTOP

## 📋 INFORMACIÓN GENERAL DEL PROYECTO

### **Descripción del Proyecto**

Landing page moderna de Planix con frontend React + TypeScript y backend Node.js + Express. El proyecto incluye:

- **Frontend**: React, TypeScript, Tailwind CSS, animaciones 3D
- **Backend**: Node.js, Express, TypeScript, Nodemailer, validaciones
- **Deploy**: Railway para frontend y backend
- **Repositorio**: GitHub con múltiples ramas

### **Estado Actual del Proyecto**

✅ **COMPLETADO:**

- Frontend React funcional y moderno
- Backend Node.js completo con endpoints `/api/contact` y `/api/chat`
- Eliminación del backend PHP anterior
- Estructura de carpetas organizada
- Scripts de testing y arranque
- Configuración Railway para ambos servicios

🔄 **EN PROGRESO:**

- Deploy automático de Railway desde GitHub
- Conexión correcta entre servicios Railway y rama `backend-nodejs`

❌ **PENDIENTE:**

- Resolución de problemas de acceso Railway-GitHub
- Configuración final de variables de entorno en producción
- Pruebas de integración frontend-backend en Railway
- Optimización de rendimiento y SEO

---

## 🗂️ ESTRUCTURA DE DIRECTORIOS

```
d:\Proyectos y Desarrollo\planix-3d-landing\
├── frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/FloatingChat.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── ...otros componentes
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/ (Node.js + Express)
│   ├── src/
│   │   ├── server.ts (servidor principal)
│   │   ├── routes/
│   │   │   ├── contact.ts (endpoint contacto)
│   │   │   └── chat.ts (endpoint chatbot)
│   │   ├── types/index.ts
│   │   └── utils/mailer.ts
│   ├── scripts/
│   │   ├── test-backend-full.ps1
│   │   ├── test-backend-complete.ps1
│   │   └── start-backend.ps1
│   ├── .env (variables de entorno)
│   ├── package.json
│   ├── railway.json (configuración Railway)
│   └── .railwayignore
└── docs/ (documentación)
    ├── CHATBOT-GUIDE.md
    ├── NUEVO-BACKEND.md
    └── DEPLOY-RAILWAY.md
```

---

## 🌐 URLs Y SERVICIOS

### **GitHub**

- **Repositorio**: `https://github.com/oreginha/planix-3d-landing`
- **Rama Principal**: `backend-nodejs` (USAR ESTA RAMA)
- **Rama Anterior**: `nueva-landing-planix` (solo consulta)
- **Último Commit**: `cff1533` - "docs: Agregar guía completa para Claude Desktop y resolver conflicto de merge"

### **Railway**

- **Proyecto**: `charismatic-fascination` (ID: `16e84c2c-50d0-4c6f-b2a9-06c45c839272`)
- **Environment**: `production` (ID: `1f912574-c1de-47f2-bf8c-e35da0eef498`)

**Servicios Railway:**

1. **Frontend**: `planix-3d-landing` (ID: `a28eaffb-dc0b-434a-8556-512e4f028113`)
   - URL: `https://planix-3d-landing-production.up.railway.app`
2. **Backend Node.js**: `planix-backend-node` (ID: `4e2be212-b608-4241-b56d-e004b6dcf0e2`)
   - URL: `https://planix-backend-node-production.up.railway.app`
   - Root Directory: `/backend`
   - Build: `npm run build`
   - Start: `npm start`

### **Endpoints del Backend**

- **Health Check**: `GET /health`
- **Contacto**: `POST /api/contact`
- **Test Contacto**: `GET /api/contact/test`
- **Chat**: `POST /api/chat/message`

---

## ⚡ COMANDOS RÁPIDOS

### **Testing Local del Backend**

```powershell
# Desde la raíz del proyecto
cd backend
npm install
npm run dev

# En otra terminal, probar
.\test-backend-full.ps1
```

### **Git y Deploy**

```powershell
# Verificar rama actual
git branch

# Cambiar a rama de trabajo
git checkout backend-nodejs

# Hacer commit y push
git add .
git commit -m "feat: descripción del cambio"
git push origin backend-nodejs
```

### **Railway CLI (si está instalada)**

```powershell
# Login
railway login

# Seleccionar proyecto
railway link 16e84c2c-50d0-4c6f-b2a9-06c45c839272

# Deploy manual
railway up
```

---

## 🎯 LINEAMIENTOS PARA CLAUDE DESKTOP

### **1. VERIFICACIÓN INICIAL OBLIGATORIA**

Antes de hacer CUALQUIER cambio, SIEMPRE verificar:

```
1. ¿En qué directorio estoy trabajando?
2. ¿Cuál es la rama actual de Git?
3. ¿Los servicios de Railway están activos?
4. ¿El backend local funciona correctamente?
```

### **2. ORDEN DE PRIORIDADES**

1. **PRIMERO**: Resolver problemas de deploy Railway-GitHub
2. **SEGUNDO**: Verificar funcionamiento local
3. **TERCERO**: Optimizaciones y mejoras
4. **CUARTO**: Documentación

### **3. PROTOCOLO DE CAMBIOS**

```
ANTES de editar archivos:
✅ Leer el archivo completo con read_file
✅ Entender el contexto y dependencias
✅ Planificar el cambio

DURANTE los cambios:
✅ Usar herramientas de edición (no codeblocks)
✅ Hacer un cambio a la vez
✅ Verificar errores después de cada edit

DESPUÉS de los cambios:
✅ Probar localmente
✅ Hacer commit descriptivo
✅ Verificar deploy automático
✅ Documentar si es necesario
```

### **4. MANEJO DE ERRORES**

- **NO** ignorar errores de TypeScript/ESLint
- **SIEMPRE** usar try-catch en endpoints
- **VERIFICAR** logs de Railway en caso de fallo
- **PROBAR** localmente antes de hacer push

### **5. TESTING OBLIGATORIO**

Antes de dar por completada cualquier tarea:

```powershell
# Backend
cd backend
npm run dev
# En otra terminal:
.\test-backend-full.ps1

# Frontend (si aplica)
npm start
# Verificar en navegador
```

---

## 🔧 PROBLEMAS CONOCIDOS Y SOLUCIONES

### **1. Railway No Despliega Automáticamente**

**Síntomas**: No hay deployments en Railway después de push
**Causa**: Posible desconexión Railway-GitHub
**Solución**:

```
1. Verificar configuración del repositorio en Railway
2. Re-conectar el servicio al repositorio
3. Hacer deploy manual con SHA específico
4. Verificar permisos de GitHub
```

### **2. Backend No Responde en Railway**

**Síntomas**: 502/503 en URLs de Railway
**Causa**: Variables de entorno o configuración incorrecta
**Solución**:

```
1. Verificar variables de entorno en Railway
2. Revisar logs de deployment
3. Verificar railway.json
4. Confirmar que PORT está configurado
```

### **3. CORS en Producción**

**Síntomas**: Frontend no puede conectar al backend
**Causa**: ALLOWED_ORIGINS mal configurado
**Solución**:

```
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app,https://planix.com.ar
```

### **4. Emails No Se Envían**

**Síntomas**: Formulario de contacto falla
**Causa**: SMTP no configurado o TEST_MODE=true
**Solución**:

```
1. Configurar SMTP_USER y SMTP_PASS
2. Cambiar TEST_MODE=false en producción
3. Verificar EMAIL_TO y EMAIL_FROM_EMAIL
```

---

## 📝 VARIABLES DE ENTORNO CRÍTICAS

### **Backend Railway (Producción)**

```
NODE_ENV=production
PORT=3001
TEST_MODE=false  # ← CAMBIAR EN PRODUCCIÓN
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=[CONFIGURAR]
SMTP_PASS=[CONFIGURAR]
EMAIL_FROM_NAME=Planix Web
EMAIL_FROM_EMAIL=noreply@planix.com.ar
EMAIL_TO=hola@planix.com.ar
ALLOWED_ORIGINS=https://planix-3d-landing-production.up.railway.app,https://planix.com.ar
RATE_LIMIT_ENABLED=true
DEBUG_LOGS=true
```

### **Backend Local (Desarrollo)**

```
NODE_ENV=development
PORT=3001
TEST_MODE=true
DEBUG_LOGS=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🎪 FLUJO DE TRABAJO IDEAL

### **Sesión Típica de Claude Desktop**

1. **Inicio**: Verificar estado del proyecto

   ```
   - git status
   - Revisar servicios Railway
   - Probar backend local
   ```

2. **Análisis**: Identificar la tarea específica

   ```
   - ¿Es un bug? → Reproducir primero
   - ¿Es una feature? → Planificar implementación
   - ¿Es deploy? → Verificar configuración
   ```

3. **Implementación**: Hacer cambios controlados

   ```
   - Un archivo a la vez
   - Testing inmediato
   - Commit granular
   ```

4. **Verificación**: Confirmar que todo funciona

   ```
   - Testing local
   - Deploy automático
   - Verificación en Railway
   ```

5. **Cierre**: Documentar y reportar estado
   ```
   - Actualizar documentación si es necesario
   - Reportar próximos pasos
   - Listar pending issues
   ```

---

## 🚨 ERRORES COMUNES A EVITAR

❌ **NO HACER:**

- Cambiar múltiples archivos sin probar
- Ignorar errores de TypeScript
- Hacer push sin testing local
- Editar archivos sin leer contexto completo
- Usar comandos de terminal para editar archivos
- Asumir que Railway deploy automático funciona

✅ **SIEMPRE HACER:**

- Verificar rama actual antes de cualquier cambio
- Leer archivos completos antes de editar
- Probar localmente antes de commit
- Verificar estado de Railway después de push
- Documentar cambios importantes
- Usar herramientas de edición apropiadas

---

## 📋 CHECKLIST DE COMPLETION

Antes de considerar una tarea como "completada":

### **Para Features Nuevas:**

- [ ] Implementación completa
- [ ] Testing local exitoso
- [ ] No hay errores de TypeScript/ESLint
- [ ] Deploy automático funciona
- [ ] Verificación en Railway
- [ ] Documentación actualizada

### **Para Bug Fixes:**

- [ ] Bug reproducido y comprendido
- [ ] Fix implementado
- [ ] Testing del caso específico
- [ ] Verificación de no regresiones
- [ ] Deploy exitoso

### **Para Deploy/DevOps:**

- [ ] Configuración verificada
- [ ] Variables de entorno correctas
- [ ] Servicios conectados
- [ ] Deploy automático funcional
- [ ] URLs responden correctamente
- [ ] Logs sin errores críticos

---

## 🔴 ACCIONES MANUALES CRÍTICAS REQUERIDAS

### **1. Railway Dashboard (CRÍTICO)**

**URL**: https://railway.app/project/16e84c2c-50d0-4c6f-b2a9-06c45c839272

Variables a cambiar INMEDIATAMENTE:

```bash
# En Railway → planix-backend-node → Variables
TEST_MODE=false  # Cambiar de true a false (CRÍTICO para emails)
SMTP_USER=tu-email@gmail.com  # Completar con email real
SMTP_PASS=tu-app-password-16-chars  # App password de Gmail
```

### **2. GitHub Secrets (NECESARIO PARA CI/CD)**

**URL**: https://github.com/oreginha/planix-3d-landing/settings/secrets/actions

Secrets a crear:

```bash
# GitHub → Settings → Secrets and variables → Actions
RAILWAY_TOKEN=railway-token-from-dashboard  # Token de Railway
SMTP_USER=mismo-que-railway  # Mismo email que Railway
SMTP_PASS=mismo-que-railway  # Misma app password
```

### **3. Gmail App Password (PREREQUISITO)**

**Pasos obligatorios**:

```bash
1. Ir a: https://myaccount.google.com/security
2. Habilitar 2FA (autenticación de dos factores)
3. Buscar "Contraseñas de aplicaciones"
4. Generar nueva contraseña para "Correo"
5. Copiar los 16 caracteres generados
6. Usar en SMTP_PASS (Railway y GitHub)
```

### **4. Verificar Conexión Railway-GitHub**

**Pasos para reconectar**:

```bash
1. Railway Dashboard → planix-backend-node → Settings
2. Verify GitHub connection
3. Re-authorize if needed
4. Ensure branch is set to "backend-nodejs"
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### **Paso 1: Ejecutar Script de Configuración**

```powershell
.\setup-variables.ps1
```

### **Paso 2: Implementar CI/CD Pipeline**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: Agregar GitHub Actions CI/CD pipeline"
git push origin backend-nodejs
```

### **Paso 3: Configuración Manual**

1. ✅ Completar variables en Railway (TEST_MODE, SMTP_USER, SMTP_PASS)
2. ✅ Crear secrets en GitHub (RAILWAY_TOKEN, SMTP_USER, SMTP_PASS)
3. ✅ Verificar conexión Railway-GitHub
4. ✅ Probar pipeline con próximo push

### **Paso 4: Verificación Final**

```bash
# Testing local
cd backend && npm run dev
.\test-backend-full.ps1

# Testing en Railway
curl https://planix-backend-node-production.up.railway.app/health
```

---

## ⚠️ ESTADO ACTUAL - BLOCKERS

### **🔴 CRÍTICO - RESOLVER PRIMERO:**

- [ ] **Railway-GitHub Connection**: "Repo not found" error
- [ ] **SMTP Configuration**: TEST_MODE=true, credenciales vacías
- [ ] **GitHub Secrets**: No configurados para CI/CD

### **🟡 IMPORTANTE - RESOLVER DESPUÉS:**

- [ ] **Health Checks**: Configurar monitoreo automático
- [ ] **Domain Setup**: Configurar dominio personalizado
- [ ] **Performance**: Optimizar tiempo de build

### **🟢 OPCIONAL - FUTURAS MEJORAS:**

- [ ] **Monitoring**: Implementar logs estructurados
- [ ] **Caching**: Optimizar estrategia de cache
- [ ] **SEO**: Mejorar meta tags y sitemap

---

**¡RECUERDA!** Siempre verificar el estado actual antes de proceder. Este proyecto está en desarrollo activo y el estado puede cambiar entre sesiones.

---

_Documento actualizado: 1 de julio de 2025_
_Proyecto: Planix 3D Landing_
_Autor: Claude Desktop Assistant_
