# 🤖 Nuevo Flujo del Chat - Planix

## **🔄 Flujo Completo Implementado:**

### **1️⃣ Saludo Inicial (Humano)**
```
🤖 "¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?"
```

### **2️⃣ Primera Respuesta del Usuario**
**El sistema valida la longitud del mensaje:**

#### **📏 Mensaje Corto (≤ 30 caracteres)**
Ejemplo: `👤 "Hola, necesito ayuda"`
```
🤖 "Perfecto, gracias por tu consulta. Para seguir con la conversación, ¿podrías compartir tu email? 📧"
```

#### **📏 Mensaje Largo (> 30 caracteres)**
Ejemplo: `👤 "Necesito un sitio web para mi empresa de venta de productos"`
```
🤖 "Perfecto, gracias por tu consulta. Para poder darte una respuesta personalizada y encontrar un asesor disponible ¿podrías compartir tu email?"
```

### **3️⃣ Captura y Validación de Email**
```
👤 "juan@miempresa.com"

🤖 "¡Excelente! Gracias juan@miempresa.com. Ahora puedo ayudarte mejor. 🚀

Puedes ampliar tu consulta o esperar una respuesta de nuestro equipo especializado. Nuestros servicios: desarrollo web, apps móviles, e-commerce, diseño, o sistemas personalizados. ¿Qué te interesa más?"
```

### **4️⃣ Derivación a Especialista**
**Cualquier mensaje posterior:**
```
👤 "¿Cuánto cuesta un sitio web?"

🤖 "¡Excelente! Estamos buscando un asistente especializado que se unirá pronto al chat o te responderá por email."
```

---

## **🎯 Validaciones Implementadas:**

### **✅ Longitud de Mensaje**
- **≤ 30 caracteres**: Mensaje corto para seguimiento básico
- **> 30 caracteres**: Mensaje detallado, requiere asesor especializado

### **✅ Validación de Email**
- **Email válido**: Continúa el flujo normalmente
- **Email inválido**: Solicita nuevamente el email con formato correcto
- **Extracción automática**: Detecta emails dentro del texto del mensaje

### **✅ Estados del Chat**
- **`isFirstMessage`**: Controla si es el primer mensaje del usuario
- **`waitingForEmail`**: Indica si está esperando que el usuario proporcione email
- **Indicadores visuales**: Muestra al usuario qué se espera en cada momento

---

## **📋 Ejemplos de Conversaciones:**

### **Ejemplo 1: Mensaje Corto**
```
🤖 "¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?"
👤 "Hola, necesito ayuda" (20 caracteres)
🤖 "Perfecto, gracias por tu consulta. Para seguir con la conversación, ¿podrías compartir tu email? 📧"
👤 "maria@empresa.com"
🤖 "¡Excelente! Gracias maria@empresa.com. Ahora puedo ayudarte mejor. 🚀..."
👤 "Necesito ayuda con mi sitio web"
🤖 "¡Excelente! Estamos buscando un asistente especializado que se unirá pronto al chat o te responderá por email."
```

### **Ejemplo 2: Mensaje Largo**
```
🤖 "¡Hola! 👋 Soy parte del equipo de Planix. ¿En qué puedo ayudarte hoy?"
👤 "Necesito un sitio web para mi empresa de venta de productos que funcione bien" (78 caracteres)
🤖 "Perfecto, gracias por tu consulta. Para poder darte una respuesta personalizada y encontrar un asesor disponible ¿podrías compartir tu email?"
👤 "carlos@ventasmax.com"
🤖 "¡Excelente! Gracias carlos@ventasmax.com. Ahora puedo ayudarte mejor. 🚀..."
👤 "¿Cuánto tiempo tomaría el desarrollo?"
🤖 "¡Excelente! Estamos buscando un asistente especializado que se unirá pronto al chat o te responderá por email."
```

---

## **🔧 Características Técnicas:**

### **🎨 Interfaz de Usuario**
- **Indicador de espera de email**: Barra azul que informa al usuario
- **Placeholder dinámico**: Cambia según el estado (mensaje normal vs email)
- **Validación en tiempo real**: Detecta y valida emails automáticamente

### **💾 Gestión de Datos**
- **Email guardado**: Se almacena para toda la sesión del chat
- **Estados persistentes**: Se mantienen hasta limpiar el chat
- **Logs del servidor**: Todos los mensajes se guardan con el email asociado

### **📧 Validación de Email**
- **Regex robusto**: Detecta formatos de email válidos
- **Extracción inteligente**: Encuentra emails dentro de texto largo
- **Feedback claro**: Mensajes específicos para emails inválidos

---

## **🚀 Beneficios del Nuevo Flujo:**

✅ **Experiencia humana inicial** - Primera impresión siempre personal
✅ **Captura garantizada de datos** - No continúa sin email
✅ **Respuestas contextuales** - Diferentes según longitud del mensaje
✅ **Derivación clara** - Usuario sabe que será contactado por especialista
✅ **Seguimiento asegurado** - Equipo tiene email para respuesta
✅ **Experiencia sin fricciones** - Flujo natural y fácil de seguir

Este flujo asegura que **cada lead quede capturado** con su email y **derivado correctamente** al equipo de especialistas para seguimiento personalizado.