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
    if (empty($data['message']) || empty($data['userEmail']) || empty($data['adminName'])) {
        throw new Exception('Faltan campos requeridos');
    }
    
    // Sanitizar datos
    $message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
    $userEmail = filter_var($data['userEmail'], FILTER_SANITIZE_EMAIL);
    $adminName = htmlspecialchars(trim($data['adminName']), ENT_QUOTES, 'UTF-8');
    $chatId = $data['chatId'] ?? '';
    
    if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Enviar respuesta por email
    $subject = 'Respuesta de Planix - Tu consulta';
    $emailMessage = "
Hola,

Gracias por contactarte con nosotros. Aquí tienes nuestra respuesta:

{$message}

---
Saludos,
{$adminName}
Equipo Planix

Si tienes más preguntas, puedes responder directamente a este email.
    ";
    
    $headers = [
        'From: ' . $adminName . ' <hola@planix.com.ar>',
        'Reply-To: hola@planix.com.ar',
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    $emailSent = mail($userEmail, $subject, $emailMessage, implode("\r\n", $headers));
    
    if (!$emailSent) {
        throw new Exception('Error al enviar el email');
    }
    
    // Guardar respuesta en log
    $logEntry = [
        'type' => 'admin_response',
        'timestamp' => date('c'),
        'adminName' => $adminName,
        'userEmail' => $userEmail,
        'message' => $message,
        'chatId' => $chatId,
        'sent_at' => date('Y-m-d H:i:s')
    ];
    
    $logFile = 'chat-responses.log';
    $logLine = date('Y-m-d H:i:s') . " | " . json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n";
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Respuesta enviada correctamente'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>