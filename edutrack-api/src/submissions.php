<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function submissions_index() {
<<<<<<< HEAD
  try {

    $stmt = db()->query("
      SELECT
        s.id,
        s.task_id,
        s.student_id,
        t.title AS task_title,
        u.name AS student_name,
        s.file_path,
        s.submitted_at,

        g.id AS grade_id,
        g.score AS grade,        
        g.feedback

      FROM submissions s

      JOIN tasks t ON t.id = s.task_id
      JOIN users u ON u.id = s.student_id

      LEFT JOIN grades g ON g.submission_id = s.id

      ORDER BY s.id DESC
    ");

    jsonResponse([
      'data' => $stmt->fetchAll()
    ]);

  } catch (Throwable $e) {

    jsonResponse([
      'error' => 'Error al listar entregas',
      'details' => $e->getMessage()
    ], 500);
  }
}


function submissions_store() {

  $task_id = (int)($_POST['task_id'] ?? 0);
  $student_id = (int)($_POST['student_id'] ?? 0);
=======
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
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b

  if ($task_id <= 0) {
    jsonResponse(['error' => 'task_id inválido'], 422);
  }

<<<<<<< HEAD
  if ($student_id <= 0) {
    jsonResponse(['error' => 'student_id inválido'], 422);
=======
  if ($user_id <= 0) {
    jsonResponse(['error' => 'user_id inválido'], 422);
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
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
<<<<<<< HEAD
  $stmt->execute([$student_id]);
=======
  $stmt->execute([$user_id]);
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
  $user = $stmt->fetch();

  if (!$user) {
    jsonResponse(['error' => 'Usuario no existe'], 404);
  }

<<<<<<< HEAD
  if (($user['role'] ?? '') !== 'student') {
    jsonResponse(['error' => 'Solo alumnos pueden subir entregas'], 422);
=======
  // Solo alumnos
  if (($user['role'] ?? '') !== 'student') {
    jsonResponse(['error' => 'Solo se pueden registrar entregas para alumnos'], 422);
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
  }

  $dir = __DIR__ . '/../uploads/';

  if (!is_dir($dir)) {
<<<<<<< HEAD
    mkdir($dir, 0777, true);
  }

  $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file['name']);
=======
    if (!mkdir($dir, 0777, true)) {
      jsonResponse(['error' => 'No se pudo crear la carpeta uploads'], 500);
    }
  }

  $originalName = $file['name'] ?? 'archivo';
  $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $originalName);
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
  $path = $dir . $safeName;

  if (!move_uploaded_file($file['tmp_name'], $path)) {
    jsonResponse(['error' => 'Error moviendo archivo'], 500);
  }

<<<<<<< HEAD
  $stmt = db()->prepare("
    INSERT INTO submissions (task_id, student_id, file_path)
    VALUES (?, ?, ?)
  ");

  $stmt->execute([$task_id, $student_id, $safeName]);

  jsonResponse(['ok' => true]);
}


function submissions_destroy($id) {

  $stmt = db()->prepare("SELECT file_path FROM submissions WHERE id = ?");
  $stmt->execute([$id]);
=======
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
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
  $submission = $stmt->fetch();

  if (!$submission) {
    jsonResponse(['error' => 'Entrega no encontrada'], 404);
  }

<<<<<<< HEAD
  db()->prepare("DELETE FROM submissions WHERE id = ?")->execute([$id]);

  if (!empty($submission['file_path'])) {
    $file = __DIR__ . '/../uploads/' . $submission['file_path'];
    if (file_exists($file)) unlink($file);
=======
  $stmt = db()->prepare("DELETE FROM submissions WHERE id = ?");
  $stmt->execute([(int)$id]);

  if (!empty($submission['file_path'])) {
    $fullPath = __DIR__ . '/../uploads/' . $submission['file_path'];
    if (is_file($fullPath)) {
      @unlink($fullPath);
    }
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
  }

  jsonResponse(['ok' => true]);
}