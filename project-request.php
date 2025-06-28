<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Solo permitir métodos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener datos JSON del request
$input = json_decode(file_get_contents('php://input'), true);

// Validar que se recibieron los datos
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos no válidos']);
    exit;
}

// Extraer y validar campos
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$projectReference = isset($input['projectReference']) ? $input['projectReference'] : null;

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

if (!$projectReference || !isset($projectReference['title']) || !isset($projectReference['category'])) {
    $errors[] = 'La referencia del proyecto es requerida';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => implode(', ', $errors)]);
    exit;
}

// Configuración del email
$to = 'presupuestos@planix.com.ar'; // Email de presupuestos de Planix
$subject = 'Solicitud de proyecto similar a: ' . $projectReference['title'];

// Construir el mensaje
$emailMessage = "Nueva solicitud de proyecto basado en referencia:\n\n";
$emailMessage .= "=== DATOS DEL CLIENTE ===\n";
$emailMessage .= "Nombre: " . $name . "\n";
$emailMessage .= "Email: " . $email . "\n\n";

$emailMessage .= "=== PROYECTO DE REFERENCIA ===\n";
$emailMessage .= "Título: " . $projectReference['title'] . "\n";
$emailMessage .= "Categoría: " . $projectReference['category'] . "\n\n";

$emailMessage .= "=== DESCRIPCIÓN DEL PROYECTO SOLICITADO ===\n";
$emailMessage .= $message . "\n\n";

$emailMessage .= "=== INFORMACIÓN TÉCNICA ===\n";
$emailMessage .= "Enviado desde: " . $_SERVER['HTTP_HOST'] . "\n";
$emailMessage .= "IP del cliente: " . $_SERVER['REMOTE_ADDR'] . "\n";
$emailMessage .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
$emailMessage .= "Fecha y hora: " . date('Y-m-d H:i:s') . " (servidor)\n";
$emailMessage .= "Zona horaria: " . date_default_timezone_get() . "\n\n";

$emailMessage .= "=== PRÓXIMOS PASOS ===\n";
$emailMessage .= "1. Revisar el proyecto de referencia en el portfolio\n";
$emailMessage .= "2. Analizar los requerimientos del cliente\n";
$emailMessage .= "3. Preparar propuesta y presupuesto\n";
$emailMessage .= "4. Contactar al cliente en un plazo de 24 horas\n";

// Headers del email
$headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Priority: 2\r\n"; // Alta prioridad para presupuestos
$headers .= "X-Project-Reference: " . $projectReference['title'] . "\r\n";
$headers .= "X-Project-Category: " . $projectReference['category'] . "\r\n";

// Intentar enviar el email
$emailSent = mail($to, $subject, $emailMessage, $headers);

// Guardar en archivo de log como respaldo
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'type' => 'project_request',
    'client' => [
        'name' => $name,
        'email' => $email
    ],
    'projectReference' => $projectReference,
    'message' => $message,
    'technical' => [
        'ip' => $_SERVER['REMOTE_ADDR'],
        'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'host' => $_SERVER['HTTP_HOST'],
        'emailSent' => $emailSent
    ]
];

// Crear directorio logs si no existe
if (!is_dir('logs')) {
    mkdir('logs', 0755, true);
}

// Guardar en log específico para proyectos
file_put_contents(
    'logs/projects_' . date('Y-m') . '.log',
    json_encode($logEntry) . "\n",
    FILE_APPEND | LOCK_EX
);

// También guardar en log general como respaldo
file_put_contents(
    'logs/contact_' . date('Y-m') . '.log',
    json_encode($logEntry) . "\n",
    FILE_APPEND | LOCK_EX
);

// Respuesta al cliente
if ($emailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud de proyecto enviada correctamente',
        'details' => 'Te contactaremos en un plazo de 24 horas para discutir tu proyecto'
    ]);
} else {
    // El email falló pero se guardó en log
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud recibida correctamente',
        'note' => 'Se ha guardado tu consulta y te contactaremos pronto'
    ]);
}
?>