<?php
// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Función para log de debugging
function writeDebugLog($message) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    
    file_put_contents('logs/debug.log', $logMessage, FILE_APPEND | LOCK_EX);
}

try {
    writeDebugLog("=== INICIO DE REQUEST ===");
    writeDebugLog("Método: " . $_SERVER['REQUEST_METHOD']);
    
    // Manejo de preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        writeDebugLog("Preflight OPTIONS request - respondiendo OK");
        exit(0);
    }

    // Solo permitir métodos POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        writeDebugLog("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        exit;
    }

    // Obtener datos JSON del request
    $rawInput = file_get_contents('php://input');
    writeDebugLog("Raw input recibido: " . $rawInput);
    
    $input = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        writeDebugLog("Error JSON: " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
        exit;
    }

    // Validar que se recibieron los datos
    if (!$input) {
        writeDebugLog("Input vacío o null");
        http_response_code(400);
        echo json_encode(['error' => 'Datos no válidos']);
        exit;
    }

    writeDebugLog("Datos recibidos: " . print_r($input, true));

    // Extraer y validar campos
    $name = isset($input['name']) ? trim($input['name']) : (isset($input['nombre']) ? trim($input['nombre']) : '');
    $email = isset($input['email']) ? trim($input['email']) : '';
    $message = isset($input['message']) ? trim($input['message']) : (isset($input['mensaje']) ? trim($input['mensaje']) : '');
    $empresa = isset($input['empresa']) ? trim($input['empresa']) : '';
    $projectReference = isset($input['projectReference']) ? $input['projectReference'] : null;

    writeDebugLog("Campos extraídos - Nombre: $name, Email: $email, Empresa: $empresa");

    // Validaciones básicas
    $errors = [];

    if (empty($name)) {
        $errors[] = 'El nombre es requerido';
    }

    if (empty($email)) {
        $errors[] = 'El email es requerido';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'El email no es válido';
    }

    if (empty($message)) {
        $errors[] = 'El mensaje es requerido';
    }

    if (!empty($errors)) {
        writeDebugLog("Errores de validación: " . implode(', ', $errors));
        http_response_code(400);
        echo json_encode(['error' => implode(', ', $errors)]);
        exit;
    }

    // Configuración del email
    $to = 'hola@planix.com.ar';
    $subject = $projectReference 
        ? 'Nueva solicitud de proyecto similar a: ' . $projectReference['title']
        : 'Nuevo mensaje de contacto desde la web';

    writeDebugLog("Preparando email para: $to con asunto: $subject");

    // Construir el mensaje
    $emailMessage = "Nuevo mensaje de contacto:\n\n";
    $emailMessage .= "Nombre: " . $name . "\n";
    $emailMessage .= "Email: " . $email . "\n";
    if (!empty($empresa)) {
        $emailMessage .= "Empresa: " . $empresa . "\n";
    }
    $emailMessage .= "\n";

    if ($projectReference) {
        $emailMessage .= "Proyecto de referencia:\n";
        $emailMessage .= "- Título: " . $projectReference['title'] . "\n";
        $emailMessage .= "- Categoría: " . $projectReference['category'] . "\n\n";
    }

    $emailMessage .= "Mensaje:\n" . $message . "\n\n";
    $emailMessage .= "---\n";
    $emailMessage .= "Enviado desde: " . $_SERVER['HTTP_HOST'] . "\n";
    $emailMessage .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    $emailMessage .= "Fecha: " . date('Y-m-d H:i:s') . "\n";

    // Headers del email
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    writeDebugLog("Headers preparados: $headers");

    // Verificar si la función mail está disponible
    if (!function_exists('mail')) {
        writeDebugLog("ERROR: Función mail() no disponible");
        throw new Exception("Función mail() no está disponible en el servidor");
    }

    // Intentar enviar el email
    writeDebugLog("Intentando enviar email...");
    $emailSent = mail($to, $subject, $emailMessage, $headers);
    
    writeDebugLog("Resultado del envío de email: " . ($emailSent ? 'ÉXITO' : 'FALLÓ'));

    // Guardar en archivo de log como respaldo
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $name,
        'email' => $email,
        'empresa' => $empresa,
        'message' => $message,
        'projectReference' => $projectReference,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'emailSent' => $emailSent,
        'to' => $to,
        'subject' => $subject
    ];

    // Crear directorio logs si no existe
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }

    // Guardar en log
    $logSaved = file_put_contents(
        'logs/contact_' . date('Y-m') . '.log',
        json_encode($logEntry) . "\n",
        FILE_APPEND | LOCK_EX
    );

    writeDebugLog("Log guardado: " . ($logSaved ? 'SÍ' : 'NO'));

    // Respuesta al cliente
    if ($emailSent) {
        writeDebugLog("Respondiendo ÉXITO al cliente");
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente'
        ]);
    } else {
        writeDebugLog("Email falló pero log guardado - respondiendo como éxito");
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje recibido correctamente',
            'note' => 'Se ha guardado tu consulta y te contactaremos pronto'
        ]);
    }

    writeDebugLog("=== FIN DE REQUEST EXITOSO ===");

} catch (Exception $e) {
    writeDebugLog("EXCEPCIÓN CAPTURADA: " . $e->getMessage());
    writeDebugLog("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Error interno del servidor: ' . $e->getMessage(),
        'debug' => 'Revisa logs/debug.log para más detalles'
    ]);
} catch (Error $e) {
    writeDebugLog("ERROR FATAL: " . $e->getMessage());
    writeDebugLog("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Error fatal: ' . $e->getMessage(),
        'debug' => 'Revisa logs/debug.log para más detalles'
    ]);
}
?>