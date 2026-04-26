<?php
require_once __DIR__ . '/db.php';


function jsonResponse($data, int $code = 200): void {
  http_response_code($code);
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode($data);
  exit;
}


function readJson(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}


function requireAuth(?string $role = null): array {
  require_once __DIR__ . '/jwt.php';

  $SECRET = "SUPER_SECRET_KEY_123"; // MISMA clave que usaste en auth.php

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

  if ($role && (($payload['role'] ?? null) !== $role)) {
    jsonResponse(['error' => 'Prohibido (rol insuficiente)'], 403);
  }

  return $payload;
}

/
function groups_index(): void {
  requireAuth('admin');

  $stmt = db()->query("SELECT id, name, year, created_at FROM groups ORDER BY id DESC");
  $rows = $stmt->fetchAll();
  jsonResponse(['data' => $rows]);
}


function groups_store(): void {
  requireAuth('admin');

  $in = readJson();
  $name = trim((string)($in['name'] ?? ''));
  $year = trim((string)($in['year'] ?? ''));

  if ($name === '') {
    jsonResponse(['error' => 'El nombre es obligatorio'], 422);
  }

  $stmt = db()->prepare("INSERT INTO groups (name, year) VALUES (?, ?)");
  $stmt->execute([$name, $year !== '' ? $year : null]);

  $id = (int)db()->lastInsertId();

  $out = db()->prepare("SELECT id, name, year, created_at FROM groups WHERE id = ?");
  $out->execute([$id]);
  jsonResponse(['data' => $out->fetch()], 201);
}


function groups_update(int $id): void {
  requireAuth('admin');

  $in = readJson();
  $name = trim((string)($in['name'] ?? ''));
  $year = trim((string)($in['year'] ?? ''));

  if ($name === '') {
    jsonResponse(['error' => 'El nombre es obligatorio'], 422);
  }

  $chk = db()->prepare("SELECT id FROM groups WHERE id = ?");
  $chk->execute([$id]);
  if (!$chk->fetch()) {
    jsonResponse(['error' => 'Grupo no encontrado'], 404);
  }

  $stmt = db()->prepare("UPDATE groups SET name = ?, year = ? WHERE id = ?");
  $stmt->execute([$name, $year !== '' ? $year : null, $id]);

  $out = db()->prepare("SELECT id, name, year, created_at FROM groups WHERE id = ?");
  $out->execute([$id]);
  jsonResponse(['data' => $out->fetch()]);
}


function groups_destroy(int $id): void {
  requireAuth('admin');

  $chk = db()->prepare("SELECT id FROM groups WHERE id = ?");
  $chk->execute([$id]);
  if (!$chk->fetch()) {
    jsonResponse(['error' => 'Grupo no encontrado'], 404);
  }

  $stmt = db()->prepare("DELETE FROM groups WHERE id = ?");
  $stmt->execute([$id]);

  jsonResponse(['ok' => true]);
}