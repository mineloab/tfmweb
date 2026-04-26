<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function readJsonTask(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function requireAdminTask(): array {
  $SECRET = "SUPER_SECRET_KEY_123";

  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

  if (!is_string($auth) || !str_starts_with($auth, 'Bearer ')) {
    jsonResponse(['error' => 'No autorizado'], 401);
  }

  $token = substr($auth, 7);
  $payload = verify_jwt($token, $SECRET);

  if (!$payload) jsonResponse(['error' => 'Token inválido'], 401);
  if (($payload['role'] ?? null) !== 'admin') jsonResponse(['error' => 'Prohibido'], 403);

  return $payload;
}


function tasks_index(): void {
  requireAdminTask();

  $stmt = db()->query("
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      s.name AS subject,
      g.name AS group_name
    FROM tasks t
    LEFT JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN groups g ON g.id = t.group_id
    ORDER BY t.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}


function tasks_store(): void {
  $user = requireAdminTask();

  $in = readJsonTask();

  $title = trim((string)($in['title'] ?? ''));
  $description = (string)($in['description'] ?? '');
  $subject_id = (int)($in['subject_id'] ?? 0);
  $group_id = (int)($in['group_id'] ?? 0);
  $due_date = $in['due_date'] ?? null;


  $teacher_id = (int)($user['id'] ?? $user['user_id'] ?? 0);

  if ($title === '') jsonResponse(['error' => 'El título es obligatorio'], 422);
  if ($subject_id <= 0) jsonResponse(['error' => 'Asignatura obligatoria'], 422);
  if ($group_id <= 0) jsonResponse(['error' => 'Grupo obligatorio'], 422);
  if ($teacher_id <= 0) jsonResponse(['error' => 'teacher_id inválido en token'], 500);

  if ($due_date === '' || $due_date === false) $due_date = null;

  $stmt = db()->prepare("
    INSERT INTO tasks (subject_id, group_id, teacher_id, title, description, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  ");

  $stmt->execute([$subject_id, $group_id, $teacher_id, $title, $description, $due_date]);

  $id = (int)db()->lastInsertId();

  $out = db()->prepare("
    SELECT
      t.id, t.title, t.description, t.due_date,
      s.name AS subject,
      g.name AS group_name
    FROM tasks t
    LEFT JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN groups g ON g.id = t.group_id
    WHERE t.id = ?
  ");
  $out->execute([$id]);

  jsonResponse(['data' => $out->fetch()], 201);
}


function tasks_destroy($id): void {
  requireAdminTask();

  $stmt = db()->prepare("DELETE FROM tasks WHERE id = ?");
  $stmt->execute([(int)$id]);

  jsonResponse(['ok' => true]);
}