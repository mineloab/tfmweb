<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

// Reutiliza jsonResponse() que ya tienes en auth.php (se carga desde index.php)

function readJsonSubjects(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function requireAdminSubjects(): array {
  $SECRET = "SUPER_SECRET_KEY_123"; // misma clave que auth.php

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

  if (($payload['role'] ?? null) !== 'admin') {
    jsonResponse(['error' => 'Prohibido'], 403);
  }

  return $payload;
}

// GET /api/subjects
function subjects_index(): void {
  requireAdminSubjects();
  $stmt = db()->query("SELECT id, name, code, created_at FROM subjects ORDER BY id DESC");
  jsonResponse(['data' => $stmt->fetchAll()]);
}

// POST /api/subjects  body: {name, code}
function subjects_store(): void {
  requireAdminSubjects();

  $in = readJsonSubjects();
  $name = trim((string)($in['name'] ?? ''));
  $code = trim((string)($in['code'] ?? ''));

  if ($name === '') jsonResponse(['error' => 'El nombre es obligatorio'], 422);

  $stmt = db()->prepare("INSERT INTO subjects (name, code) VALUES (?, ?)");
  $stmt->execute([$name, $code !== '' ? $code : null]);

  $id = (int)db()->lastInsertId();
  $out = db()->prepare("SELECT id, name, code, created_at FROM subjects WHERE id = ?");
  $out->execute([$id]);

  jsonResponse(['data' => $out->fetch()], 201);
}

// PUT /api/subjects/{id}
function subjects_update(int $id): void {
  requireAdminSubjects();

  $in = readJsonSubjects();
  $name = trim((string)($in['name'] ?? ''));
  $code = trim((string)($in['code'] ?? ''));

  if ($name === '') jsonResponse(['error' => 'El nombre es obligatorio'], 422);

  $chk = db()->prepare("SELECT id FROM subjects WHERE id = ?");
  $chk->execute([$id]);
  if (!$chk->fetch()) jsonResponse(['error' => 'Asignatura no encontrada'], 404);

  $stmt = db()->prepare("UPDATE subjects SET name = ?, code = ? WHERE id = ?");
  $stmt->execute([$name, $code !== '' ? $code : null, $id]);

  $out = db()->prepare("SELECT id, name, code, created_at FROM subjects WHERE id = ?");
  $out->execute([$id]);

  jsonResponse(['data' => $out->fetch()]);
}

// DELETE /api/subjects/{id}
function subjects_destroy(int $id): void {
  requireAdminSubjects();

  $chk = db()->prepare("SELECT id FROM subjects WHERE id = ?");
  $chk->execute([$id]);
  if (!$chk->fetch()) jsonResponse(['error' => 'Asignatura no encontrada'], 404);

  $stmt = db()->prepare("DELETE FROM subjects WHERE id = ?");
  $stmt->execute([$id]);

  jsonResponse(['ok' => true]);
}