<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

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

// GET /api/tasks
function tasks_index(): void {
  requireAdminTask();

  $stmt = db()->query("
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.attachment_path,
      s.name AS subject,
      g.name AS group_name
    FROM tasks t
    LEFT JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN groups g ON g.id = t.group_id
    ORDER BY t.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}

// POST /api/tasks
function tasks_store(): void {
  $user = requireAdminTask();

  $title = trim((string)($_POST['title'] ?? ''));
  $description = (string)($_POST['description'] ?? '');
  $subject_id = (int)($_POST['subject_id'] ?? 0);
  $group_id = (int)($_POST['group_id'] ?? 0);
  $due_date = $_POST['due_date'] ?? null;

  $teacher_id = (int)($user['id'] ?? $user['user_id'] ?? 0);

  if ($title === '') jsonResponse(['error' => 'El título es obligatorio'], 422);
  if ($subject_id <= 0) jsonResponse(['error' => 'Asignatura obligatoria'], 422);
  if ($group_id <= 0) jsonResponse(['error' => 'Grupo obligatorio'], 422);
  if ($teacher_id <= 0) jsonResponse(['error' => 'teacher_id inválido en token'], 500);

  if ($due_date === '' || $due_date === false) $due_date = null;

  $attachment_path = null;

  if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['attachment'];

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['pdf'];

    if (!in_array($ext, $allowed, true)) {
      jsonResponse(['error' => 'Solo se permiten archivos PDF para el enunciado'], 422);
    }

    $dir = __DIR__ . '/../uploads/tasks/';
    if (!is_dir($dir)) {
      mkdir($dir, 0777, true);
    }

    $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9_\.-]/', '_', $file['name']);
    $fullPath = $dir . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
      jsonResponse(['error' => 'No se pudo guardar el archivo adjunto'], 500);
    }

    $attachment_path = $safeName;
  }

  $stmt = db()->prepare("
    INSERT INTO tasks (subject_id, group_id, teacher_id, title, description, due_date, attachment_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->execute([
    $subject_id,
    $group_id,
    $teacher_id,
    $title,
    $description,
    $due_date,
    $attachment_path
  ]);

  $id = (int)db()->lastInsertId();

  $out = db()->prepare("
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.attachment_path,
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

// DELETE /api/tasks/{id}
function tasks_destroy($id): void {
  requireAdminTask();

  $q = db()->prepare("SELECT attachment_path FROM tasks WHERE id = ?");
  $q->execute([(int)$id]);
  $task = $q->fetch();

  if ($task && !empty($task['attachment_path'])) {
    $file = __DIR__ . '/../uploads/tasks/' . $task['attachment_path'];
    if (is_file($file)) {
      unlink($file);
    }
  }

  $stmt = db()->prepare("DELETE FROM tasks WHERE id = ?");
  $stmt->execute([(int)$id]);

  jsonResponse(['ok' => true]);
}