<?php
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function create_jwt($payload, $secret) {
    $header = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + 3600;
    $payload = base64url_encode(json_encode($payload));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    return "$header.$payload.$signature";
}

function verify_jwt($token, $secret) {
    $parts = explode('.', $token);
    if(count($parts) !== 3) return null;

    [$header,$payload,$signature] = $parts;
    $valid = base64url_encode(hash_hmac('sha256', "$header.$payload", $secret, true));

    if(!hash_equals($valid,$signature)) return null;

    $payload = json_decode(base64url_decode($payload), true);

    if($payload['exp'] < time()) return null;

    return $payload;
}