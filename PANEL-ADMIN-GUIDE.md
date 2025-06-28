# 📊 Panel de Administración del Chat - Planix

## **🎯 Acceso al Panel**

### **URL de acceso:**
```
https://tu-dominio.com/login.php
```

### **Credenciales por defecto:**
- **Usuario:** `admin`
- **Contraseña:** `planix2025`

*(Puedes cambiar estas credenciales en el archivo `login.php`)*

---

## **📋 Características del Panel**

### **🔐 Sistema de Autenticación**
- **Login seguro** con sesiones PHP
- **Protección de rutas** - redirige a login si no está autenticado
- **Logout seguro** que destruye la sesión

### **📊 Dashboard con Estadísticas**
- **Mensajes Hoy** - Conversaciones recibidas en el día
- **Pendientes** - Mensajes que requieren respuesta
- **Respondidos** - Conversaciones ya atendidas
- **Emails Capturados** - Total de leads con email válido

### **🔍 Sistema de Filtros Avanzados**
- **Por Estado:** Todos, Pendientes, Respondidos
- **Por Fecha:** Hoy, Esta semana, Este mes, Todos
- **Búsqueda:** Por email, nombre o contenido del mensaje

### **💬 Gestión de Conversaciones**
- **Vista completa** del historial de cada conversación
- **Información del cliente** (nombre, email, fecha)
- **Análisis automático** del tipo de mensaje (corto/detallado)
- **Indicadores de prioridad** visual

### **📧 Sistema de Respuestas**
- **Modal completo** para responder conversaciones
- **Plantillas predefinidas** para respuestas rápidas
- **Envío por email** automático al cliente
- **Marcado automático** como "respondido"

### **📈 Funcionalidades Adicionales**
- **Exportación a CSV** con todos los datos
- **Auto-refresh** cada 30 segundos
- **Notificaciones** en tiempo real
- **Atajos de teclado** (ESC para cerrar, F5 para actualizar)

---

## **🎨 Plantillas de Respuesta Incluidas**

### **💻 Desarrollo Web**
```
Gracias por tu consulta sobre desarrollo web. Nos especializamos en crear sitios modernos, responsive y optimizados para SEO. Me gustaría agendar una llamada para entender mejor tus necesidades y brindarte una cotización personalizada.

¿Cuándo sería un buen momento para conversar?
```

### **📱 Apps Móviles**
```
¡Excelente que consideres desarrollar una app móvil! Trabajamos con las últimas tecnologías (Flutter, React Native) para crear aplicaciones nativas que funcionen perfectamente en iOS y Android.

Para poder darte una propuesta precisa, me gustaría conocer más detalles sobre tu proyecto. ¿Podríamos agendar una reunión?
```

### **🛒 E-commerce**
```
Perfecto, el e-commerce es una excelente inversión. Desarrollamos tiendas online completas con pasarelas de pago seguras, gestión de inventario y todas las funcionalidades que necesitas para vender online.

¿Te parece si coordinamos una reunión para revisar tus requerimientos específicos?
```

### **💰 Cotización**
```
Gracias por tu interés en nuestros servicios. Para brindarte una cotización precisa, necesitamos entender mejor el alcance de tu proyecto.

¿Podrías contarme más detalles sobre:
- Qué tipo de proyecto tienes en mente
- Funcionalidades específicas que necesitas
- Timeline aproximado

¡Estamos aquí para ayudarte!
```

---

## **🔧 Flujo de Trabajo Recomendado**

### **1. Revisión Diaria**
1. **Acceder al panel** cada mañana
2. **Revisar estadísticas** del día anterior
3. **Filtrar por "Pendientes"** para ver nuevas consultas
4. **Priorizar respuestas** según longitud del mensaje y email

### **2. Gestión de Respuestas**
1. **Abrir conversación** haciendo clic en el mensaje
2. **Revisar el historial** completo en el modal
3. **Seleccionar plantilla apropiada** o escribir respuesta personalizada
4. **Enviar respuesta** que llegará automáticamente por email
5. **El sistema marca automáticamente** como "respondido"

### **3. Seguimiento**
1. **Exportar datos** semanalmente para reportes
2. **Revisar métricas** de respuesta y conversión
3. **Ajustar plantillas** según feedback de clientes

---

## **📁 Estructura de Archivos**

```
public/
├── login.php              # Página de login
├── logout.php             # Cierre de sesión
├── chat-admin.html        # Panel principal
├── chat-admin.php         # API para obtener mensajes
├── admin-reply.php        # API para enviar respuestas
├── chat-message.php       # API para recibir mensajes del chat
├── chat-messages.log      # Log de mensajes recibidos
└── chat-responses.log     # Log de respuestas enviadas
```

---

## **🔒 Seguridad y Personalización**

### **Cambiar Credenciales:**
Edita el archivo `login.php` línea 6:
```php
$valid_users = [
    'tu_usuario' => 'tu_password_segura',
    'otro_admin' => 'otra_password'
];
```

### **Configurar Email:**
En `admin-reply.php` línea 45, cambia:
```php
$to = 'tu-email@tu-dominio.com';
```

### **Personalizar Plantillas:**
En `chat-admin.html` líneas 290-300, modifica las plantillas según tu negocio.

---

## **📊 Métricas Importantes**

### **KPIs del Chat:**
- **Tasa de captura de email:** (Emails capturados / Total mensajes) × 100
- **Tiempo de respuesta promedio:** Tiempo entre mensaje y respuesta
- **Tasa de conversión:** (Respuestas enviadas / Mensajes recibidos) × 100
- **Calidad de leads:** Mensajes detallados vs mensajes cortos

### **Reportes Sugeridos:**
- **Diario:** Nuevos mensajes y respuestas pendientes
- **Semanal:** Métricas de conversión y export CSV
- **Mensual:** Análisis de tendencias y ajuste de estrategia

---

## **🚀 Beneficios del Panel**

✅ **Gestión centralizada** de todas las conversaciones
✅ **Respuestas rápidas** con plantillas predefinidas
✅ **100% de seguimiento** - ningún lead se pierde
✅ **Análisis automático** del tipo de consulta
✅ **Exportación de datos** para reportes y CRM
✅ **Interfaz intuitiva** que no requiere capacitación
✅ **Notificaciones en tiempo real** de nuevos mensajes
✅ **Escalabilidad** - maneja cientos de conversaciones

¡El panel está listo para gestionar eficientemente todas las conversaciones del chat! 🎉