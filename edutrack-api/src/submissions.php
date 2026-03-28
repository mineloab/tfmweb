<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function submissions_index() {
  $stmt = db()->query("
    SELECT
      s.id,
      t.title AS task,
      u.name AS student,
      s.file_path,
      s.submitted_at
    FROM submissions s
    JOIN tasks t ON t.id = s.task_id
    JOIN users u ON u.id = s.student_id
    ORDER BY s.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}

function submissions_store() {
  $task_id = (int)($_POST['task_id'] ?? 0);
  $user_id = (int)($_POST['user_id'] ?? 0);

  if ($task_id <= 0) {
    jsonResponse(['error' => 'task_id inválido'], 422);
  }

  if ($user_id <= 0) {
    jsonResponse(['error' => 'user_id inválido'], 422);
  }

  if (!isset($_FILES['file'])) {
    jsonResponse(['error' => 'Archivo requerido'], 400);
  }

  $file = $_FILES['file'];

  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'Error al subir el archivo'], 400);
  }

  // Validar tarea
  $stmt = db()->prepare("SELECT id FROM tasks WHERE id = ?");
  $stmt->execute([$task_id]);
  if (!$stmt->fetch()) {
    jsonResponse(['error' => 'La tarea no existe'], 404);
  }

  // Validar usuario
  $stmt = db()->prepare("SELECT id, role FROM users WHERE id = ?");
  $stmt->execute([$user_id]);
  $user = $stmt->fetch();

  if (!$user) {
    jsonResponse(['error' => 'Usuario no existe'], 404);
  }

  // Solo alumnos
  if (($user['role'] ?? '') !== 'student') {
    jsonResponse(['error' => 'Solo se pueden registrar entregas para alumnos'], 422);
  }

  $dir = __DIR__ . '/../uploads/';

  if (!is_dir($dir)) {
    if (!mkdir($dir, 0777, true)) {
      jsonResponse(['error' => 'No se pudo crear la carpeta uploads'], 500);
    }
  }

  $originalName = $file['name'] ?? 'archivo';
  $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $originalName);
  $path = $dir . $safeName;

  if (!move_uploaded_file($file['tmp_name'], $path)) {
    jsonResponse(['error' => 'Error moviendo archivo'], 500);
  }

  try {
    $stmt = db()->prepare("
      INSERT INTO submissions (task_id, student_id, file_path)
      VALUES (?, ?, ?)
    ");

    $ok = $stmt->execute([
      $task_id,
      $user_id,
      $safeName
    ]);

    if (!$ok) {
      jsonResponse(['error' => 'Error al guardar en BD'], 500);
    }

    $id = (int)db()->lastInsertId();

    $stmt = db()->prepare("
      SELECT
        s.id,
        t.title AS task,
        u.name AS student,
        s.file_path,
        s.submitted_at
      FROM submissions s
      JOIN tasks t ON t.id = s.task_id
      JOIN users u ON u.id = s.student_id
      WHERE s.id = ?
      LIMIT 1
    ");
    $stmt->execute([$id]);

    jsonResponse([
      'ok' => true,
      'data' => $stmt->fetch()
    ], 201);

  } catch (Throwable $e) {
    jsonResponse([
      'error' => 'Error al guardar la entrega',
      'details' => $e->getMessage()
    ], 500);
  }
}

function submissions_destroy($id) {
  $stmt = db()->prepare("SELECT file_path FROM submissions WHERE id = ?");
  $stmt->execute([(int)$id]);
  $submission = $stmt->fetch();

  if (!$submission) {
    jsonResponse(['error' => 'Entrega no encontrada'], 404);
  }

  $stmt = db()->prepare("DELETE FROM submissions WHERE id = ?");
  $stmt->execute([(int)$id]);

  if (!empty($submission['file_path'])) {
    $fullPath = __DIR__ . '/../uploads/' . $submission['file_path'];
    if (is_file($fullPath)) {
      @unlink($fullPath);
    }
  }

  jsonResponse(['ok' => true]);
}