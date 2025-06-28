<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    $messages = [];
    $logFile = 'chat-messages.log';
    
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            $parts = explode(' | ', $line, 2);
            if (count($parts) === 2) {
                $data = json_decode($parts[1], true);
                if ($data) {
                    $messages[] = [
                        'messageId' => $data['messageId'] ?? uniqid(),
                        'timestamp' => $data['timestamp'] ?? $data['received_at'],
                        'userName' => $data['userName'] ?? 'Usuario Anónimo',
                        'userEmail' => $data['userEmail'] ?? '',
                        'message' => $data['message'] ?? '',
                        'ip' => $data['ip'] ?? '',
                        'userAgent' => $data['userAgent'] ?? '',
                        'replied' => false // Por defecto no respondido
                    ];
                }
            }
        }
    }
    
    // Ordenar por fecha (más reciente primero)
    usort($messages, function($a, $b) {
        return strtotime($b['timestamp']) - strtotime($a['timestamp']);
    });
    
    // Verificar respuestas (opcional: leer archivo de respuestas)
    $responsesFile = 'chat-responses.log';
    $respondedIds = [];
    
    if (file_exists($responsesFile)) {
        $responseLines = file($responsesFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($responseLines as $line) {
            $parts = explode(' | ', $line, 2);
            if (count($parts) === 2) {
                $responseData = json_decode($parts[1], true);
                if ($responseData && isset($responseData['chatId'])) {
                    $respondedIds[] = $responseData['chatId'];
                }
            }
        }
    }
    
    // Marcar mensajes respondidos
    foreach ($messages as &$message) {
        if (in_array($message['messageId'], $respondedIds)) {
            $message['replied'] = true;
        }
    }
    
    echo json_encode([
        'success' => true,
        'messages' => $messages,
        'total' => count($messages)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>