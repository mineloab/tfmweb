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
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = db()->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error'=>'Credenciales incorrectas'], 401);
    }

    $token = create_jwt([
        'id'=>$user['id'],
        'name'=>$user['name'],
        'role'=>$user['role']
    ], $SECRET);

    jsonResponse(['token'=>$token]);
}

function me() {
    global $SECRET;

    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';

    if(!str_starts_with($auth,'Bearer ')) {
        jsonResponse(['error'=>'No autorizado'],401);
    }

    $token = substr($auth,7);
    $payload = verify_jwt($token,$SECRET);

    if(!$payload) {
        jsonResponse(['error'=>'Token inválido'],401);
    }

    jsonResponse(['user'=>$payload]);
}