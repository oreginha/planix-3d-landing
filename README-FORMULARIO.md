# Formularios de Contacto - Planix

## Archivos del Sistema

### 1. contact.php
- **Propósito**: Formulario de contacto general
- **Email destino**: hola@planix.com.ar
- **Usado por**: ContactModal (formulario principal)

### 2. project-request.php  
- **Propósito**: Solicitudes de proyectos con referencia
- **Email destino**: presupuestos@planix.com.ar
- **Usado por**: ProjectContactModal ("Quiero algo como esto")

## Instalación en el Servidor

### 1. Subir archivos
- Sube `contact.php` y `project-request.php` a la raíz de tu servidor web
- Asegúrate de que ambos archivos tengan permisos de lectura (644)

### 2. Configuración de emails
Los emails ya están configurados:
- **contact.php**: `hola@planix.com.ar` (contacto general)
- **project-request.php**: `presupuestos@planix.com.ar` (solicitudes de proyectos)

### 3. Permisos necesarios
El script necesita:
- Permisos para crear el directorio `logs/` (se crea automáticamente)
- Permisos para escribir archivos de log
- Función `mail()` habilitada en PHP

### 4. Verificación
Prueba ambos formularios:
1. **Formulario general**: Botón "Iniciar conversación" → `hola@planix.com.ar`
2. **Solicitud de proyecto**: Click en proyecto → "Quiero algo como esto" → `presupuestos@planix.com.ar`

Ambos scripts:
- Envían emails a las direcciones configuradas
- Guardan logs de respaldo
- Retornan respuestas JSON

## Estructura de datos

### Formulario normal (ContactModal)
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com", 
  "empresa": "Mi Empresa",
  "mensaje": "Mensaje del usuario"
}
```

### Formulario de proyecto (ProjectContactModal)
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "message": "Quiero algo similar pero con estas modificaciones...",
  "projectReference": {
    "title": "E-commerce Moderno",
    "category": "E-commerce"
  }
}
```

**Características especiales del project-request.php:**
- Email con alta prioridad
- Headers personalizados con referencia del proyecto
- Mensaje estructurado con secciones claras
- Log específico para seguimiento de proyectos

## Logs
- **Contacto general**: `logs/contact_YYYY-MM.log`
- **Solicitudes de proyectos**: `logs/projects_YYYY-MM.log` (+ respaldo en contact)
- Formato JSON para fácil procesamiento

## Solución de problemas

### El email no se envía
1. Verifica que la función `mail()` esté habilitada
2. Revisa el log del servidor
3. Los mensajes se guardan en log aunque falle el email

### Error de CORS
Si tienes problemas de CORS, ajusta los headers en `contact.php`:
```php
header('Access-Control-Allow-Origin: https://tudominio.com');
```

### Error 500
- Verifica permisos de archivos
- Revisa que PHP tenga permisos para crear directorios
- Consulta error_log del servidor
