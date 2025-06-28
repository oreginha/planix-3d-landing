<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');

// Test básico del servidor
$tests = [];

// Test 1: Versión de PHP
$tests['php_version'] = phpversion();

// Test 2: Función mail disponible
$tests['mail_function'] = function_exists('mail') ? 'Disponible' : 'NO DISPONIBLE';

// Test 3: Permisos de escritura
$tests['write_permissions'] = is_writable('.') ? 'Escritura OK' : 'Sin permisos de escritura';

// Test 4: Crear directorio logs
try {
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    $tests['logs_directory'] = is_dir('logs') ? 'Directorio logs OK' : 'Error creando logs';
} catch (Exception $e) {
    $tests['logs_directory'] = 'Error: ' . $e->getMessage();
}

// Test 5: Escribir archivo de prueba
try {
    $testWrite = file_put_contents('logs/test.log', 'Test: ' . date('Y-m-d H:i:s') . "\n");
    $tests['file_write'] = $testWrite ? 'Escritura de archivos OK' : 'Error escribiendo archivos';
} catch (Exception $e) {
    $tests['file_write'] = 'Error: ' . $e->getMessage();
}

// Test 6: Configuración de email
$tests['sendmail_path'] = ini_get('sendmail_path') ?: 'No configurado';
$tests['smtp'] = ini_get('SMTP') ?: 'No configurado';

// Test 7: Variables del servidor
$tests['server_software'] = $_SERVER['SERVER_SOFTWARE'] ?? 'Desconocido';
$tests['document_root'] = $_SERVER['DOCUMENT_ROOT'] ?? 'Desconocido';

// Test 8: Test de envío de email (solo si se solicita)
if (isset($_GET['test_email']) && $_GET['test_email'] === 'true') {
    $testEmail = mail(
        'test@planix.com.ar', 
        'Test desde servidor - ' . date('Y-m-d H:i:s'),
        "Este es un email de prueba enviado desde:\n" . $_SERVER['HTTP_HOST'] . "\n\nFecha: " . date('Y-m-d H:i:s'),
        "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\nX-Mailer: PHP/" . phpversion()
    );
    $tests['email_test'] = $testEmail ? 'Email de prueba enviado' : 'Falló el envío de email';
}

// Responder según el método
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Test de recepción de datos POST
    $input = file_get_contents('php://input');
    $jsonData = json_decode($input, true);
    
    $tests['post_data_received'] = !empty($input) ? 'Datos POST recibidos' : 'Sin datos POST';
    $tests['json_decode'] = $jsonData ? 'JSON decodificado OK' : 'Error en JSON: ' . json_last_error_msg();
    
    if ($jsonData) {
        $tests['received_fields'] = array_keys($jsonData);
    }
}

// Respuesta
echo json_encode([
    'status' => 'Servidor funcionando',
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'tests' => $tests,
    'recommendations' => [
        'Si mail_function no está disponible, contacta a tu proveedor de hosting',
        'Si hay errores de permisos, configura chmod 755 en el directorio',
        'Para probar email: accede a este archivo con ?test_email=true'
    ]
], JSON_PRETTY_PRINT);
?>