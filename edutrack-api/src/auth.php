<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

$SECRET = "SUPER_SECRET_KEY_123";

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

function login() {
    global $SECRET;

    $input = json_decode(file_get_contents("php://input"), true);

    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');

    if ($email === '' || $password === '') {
        jsonResponse(['error' => 'Email y contraseña son obligatorios'], 422);
    }

    $stmt = db()->prepare("
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = ?
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Credenciales incorrectas'], 401);
    }

    $token = create_jwt([
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ], $SECRET);

    jsonResponse(['token' => $token]);
}

function me() {
    global $SECRET;

    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!is_string($auth) || !str_starts_with($auth, 'Bearer ')) {
        jsonResponse(['error' => 'No autorizado'], 401);
    }

    $token = substr($auth, 7);
    $payload = verify_jwt($token, $SECRET);

    if (!$payload) {
        jsonResponse(['error' => 'Token inválido'], 401);
    }

    jsonResponse(['user' => $payload]);
}