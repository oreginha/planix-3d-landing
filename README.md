# 🚀 Planix 3D Landing Page

Una landing page moderna y sofisticada con elementos 3D interactivos para Planix, empresa líder en soluciones web.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

## ✨ Características Principales

- 🎨 **Diseño Moderno**: Interface elegante con elementos 3D interactivos
- ⚡ **Performance Optimizada**: Carga rápida y experiencia fluida
- 📱 **Responsive**: Adaptado para todos los dispositivos
- 🎯 **Interactivo**: Efectos 3D que responden al movimiento del mouse
- 🚀 **Tecnología Avanzada**: React + TypeScript + Three.js

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **3D Engine**: Three.js + React Three Fiber
- **Estilos**: Tailwind CSS
- **Build Tool**: Vite
- **Animaciones**: Framer Motion + GSAP
- **Deploy**: Railway (recomendado)

## 🚀 Deploy Rápido en Railway

### Opción 1: Deploy Directo (Recomendado)
1. Conecta tu cuenta de GitHub con Railway
2. Importa este repositorio: `oreginha/planix-3d-landing`
3. Railway detectará automáticamente la configuración
4. ¡El deploy se ejecutará automáticamente!

### Opción 2: CLI de Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login en Railway
railway login

# Deploy del proyecto
railway link
railway up
```

## 🏗️ Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/oreginha/planix-3d-landing.git
cd planix-3d-landing

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:8080
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
VITE_API_URL=https://tu-api.com
VITE_CONTACT_EMAIL=contact@planix.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🎯 Configuración para Railway

El proyecto incluye `railway.json` con la configuración optimizada:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckPath": "/"
  }
}
```

## 📁 Estructura del Proyecto

```
planix-3d-landing/
├── src/
│   ├── components/          # Componentes React
│   │   ├── 3d/             # Componentes 3D
│   │   └── ui/             # Componentes UI
│   ├── sections/           # Secciones de la página
│   ├── hooks/              # Hooks personalizados
│   ├── utils/              # Utilidades
│   └── types/              # Tipos TypeScript
├── public/                 # Assets estáticos
├── railway.json           # Configuración Railway
└── package.json           # Dependencias
```

## 🎨 Componentes Principales

### Componentes 3D
- **ParticleSystem**: Sistema de partículas interactivo
- **FloatingElements**: Elementos flotantes que siguen el mouse
- **InteractiveOrb**: Orbe central que cambia con el scroll

### Secciones
- **Hero**: Sección principal con impacto visual
- **Services**: Servicios ofrecidos por Planix
- **Technology**: Stack tecnológico y habilidades
- **Portfolio**: Proyectos destacados
- **About**: Historia y valores de la empresa
- **Contact**: Formulario de contacto funcional

## ⚡ Optimizaciones de Performance

- 📱 **Detección de dispositivo**: Reduce la complejidad 3D en móviles
- 🎯 **Lazy loading**: Carga componentes bajo demanda
- 📊 **Bundle splitting**: Optimización de chunks
- 🔄 **Adaptive DPR**: Ajusta resolución según dispositivo

## 🌐 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- 📱 Dispositivos móviles (con optimizaciones)

## 📞 Soporte y Contribución

¿Encontraste un problema o tienes una sugerencia?

1. Abre un [Issue](https://github.com/oreginha/planix-3d-landing/issues)
2. Crea un [Pull Request](https://github.com/oreginha/planix-3d-landing/pulls)
3. Contacta al equipo de desarrollo

## 📝 Licencia

Este proyecto es propiedad de Planix. Todos los derechos reservados.

---

**Desarrollado con ❤️ por el equipo de Planix**

🌐 [Website](https://planix.com) • 📧 [Contacto](mailto:contact@planix.com) • 🐙 [GitHub](https://github.com/oreginha)
