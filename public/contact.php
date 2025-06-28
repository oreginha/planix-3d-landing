<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$nombre = $input['nombre'] ?? '';
$email = $input['email'] ?? '';
$empresa = $input['empresa'] ?? '';
$mensaje = $input['mensaje'] ?? '';

// Validaciones
if (empty($nombre) || empty($email) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['error' => 'Campos obligatorios faltantes']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

// Configuración del email
$to = 'hola@planix.com.ar';
$subject = 'Nuevo contacto desde el sitio web';

$emailContent = "
Nuevo mensaje de contacto:

Nombre: $nombre
Email: $email
Empresa: $empresa
Mensaje: $mensaje

---
Enviado desde el formulario de contacto de planix.com.ar
";

$headers = [
    'From: ' . $to,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Enviar email
if (mail($to, $subject, $emailContent, implode("\r\n", $headers))) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al enviar el mensaje']);
}
?>
