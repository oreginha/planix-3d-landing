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
$name = isset($input['name']) ? trim($input['name']) : (isset($input['nombre']) ? trim($input['nombre']) : '');
$email = isset($input['email']) ? trim($input['email']) : '';
$message = isset($input['message']) ? trim($input['message']) : (isset($input['mensaje']) ? trim($input['mensaje']) : '');
$empresa = isset($input['empresa']) ? trim($input['empresa']) : '';
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

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => implode(', ', $errors)]);
    exit;
}

// Configuración del email
$to = 'hola@planix.com.ar'; // Email de contacto de Planix
$subject = $projectReference 
    ? 'Nueva solicitud de proyecto similar a: ' . $projectReference['title']
    : 'Nuevo mensaje de contacto desde la web';

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
$emailMessage .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$emailMessage .= "Fecha: " . date('Y-m-d H:i:s') . "\n";

// Headers del email
$headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Intentar enviar el email
$emailSent = mail($to, $subject, $emailMessage, $headers);

// Guardar en archivo de log como respaldo
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'empresa' => $empresa,
    'message' => $message,
    'projectReference' => $projectReference,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
];

// Crear directorio logs si no existe
if (!is_dir('logs')) {
    mkdir('logs', 0755, true);
}

// Guardar en log
file_put_contents(
    'logs/contact_' . date('Y-m') . '.log',
    json_encode($logEntry) . "\n",
    FILE_APPEND | LOCK_EX
);

// Respuesta al cliente
if ($emailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ]);
} else {
    // El email falló pero se guardó en log
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje recibido correctamente',
        'note' => 'Se ha guardado tu consulta y te contactaremos pronto'
    ]);
}
?>