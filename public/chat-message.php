<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    // Leer datos del request
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido');
    }
    
    // Validar campos requeridos
    if (empty($data['message'])) {
        throw new Exception('El mensaje es requerido');
    }
    
    // Sanitizar datos
    $message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
    $userName = htmlspecialchars(trim($data['userName'] ?? 'Usuario Anónimo'), ENT_QUOTES, 'UTF-8');
    $userEmail = filter_var($data['userEmail'] ?? '', FILTER_SANITIZE_EMAIL);
    $timestamp = $data['timestamp'] ?? date('c');
    $messageId = $data['messageId'] ?? uniqid();
    
    // Crear el contenido del mensaje para el archivo
    $logEntry = [
        'messageId' => $messageId,
        'timestamp' => $timestamp,
        'userName' => $userName,
        'userEmail' => $userEmail,
        'message' => $message,
        'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'received_at' => date('Y-m-d H:i:s')
    ];
    
    // Guardar en archivo de log
    $logFile = 'chat-messages.log';
    $logLine = date('Y-m-d H:i:s') . " | " . json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n";
    
    if (file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX) === false) {
        throw new Exception('Error al guardar el mensaje');
    }
    
    // Opcional: Enviar email de notificación
    $emailSent = false;
    if (!empty($userEmail) && filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        $to = 'hola@planix.com.ar'; // Tu email
        $subject = 'Nuevo mensaje de chat - Planix';
        $emailMessage = "
Nuevo mensaje recibido en el chat del sitio web:

Nombre: {$userName}
Email: {$userEmail}
Fecha: " . date('d/m/Y H:i:s', strtotime($timestamp)) . "
Mensaje: {$message}

---
IP: {$_SERVER['REMOTE_ADDR']}
User Agent: {$_SERVER['HTTP_USER_AGENT']}
        ";
        
        $headers = [
            'From: noreply@planix.com.ar',
            'Reply-To: ' . $userEmail,
            'Content-Type: text/plain; charset=UTF-8'
        ];
        
        $emailSent = mail($to, $subject, $emailMessage, implode("\r\n", $headers));
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje recibido correctamente',
        'messageId' => $messageId,
        'emailSent' => $emailSent,
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>