<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function requireUserSubmission() {

  $SECRET = "SUPER_SECRET_KEY_123";

  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

  if (!str_starts_with($auth, 'Bearer ')) {
    jsonResponse(['error' => 'No autorizado'], 401);
  }

  $token = substr($auth, 7);
  $payload = verify_jwt($token, $SECRET);

  if (!$payload) {
    jsonResponse(['error' => 'Token inválido'], 401);
  }

  return $payload;
}


function submissions_index() {

  requireUserSubmission();

  $stmt = db()->query("
    SELECT
      s.id,
      s.file_path,
      s.created_at,
      u.name AS student,
      t.title AS task
    FROM submissions s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN tasks t ON t.id = s.task_id
    ORDER BY s.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}


function submissions_store() {

  $user = requireUserSubmission();

  $task_id = (int)($_POST['task_id'] ?? 0);
  $user_id = (int)($user['id'] ?? $user['user_id'] ?? 0);

  if ($task_id <= 0) {
    jsonResponse(['error' => 'task_id obligatorio'], 422);
  }

  if (!isset($_FILES['file'])) {
    jsonResponse(['error' => 'Archivo obligatorio'], 422);
  }

  $file = $_FILES['file'];

  if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'Error subiendo archivo'], 500);
  }

  $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

  $allowed = ['pdf','doc','docx','zip'];

  if (!in_array($ext, $allowed)) {
    jsonResponse(['error' => 'Tipo de archivo no permitido'], 422);
  }

  $dir = __DIR__ . '/../uploads/submissions/';

  if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
  }

  $safeName = time().'_'.$user_id.'_'.preg_replace('/[^A-Za-z0-9_\.-]/','_',$file['name']);

  $fullPath = $dir.$safeName;

  if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
    jsonResponse(['error'=>'No se pudo guardar el archivo'],500);
  }

  $stmt = db()->prepare("
    INSERT INTO submissions (task_id,user_id,file_path)
    VALUES (?,?,?)
  ");

  $stmt->execute([
    $task_id,
    $user_id,
    $safeName
  ]);

  jsonResponse(['ok'=>true]);
}


function submissions_destroy($id){

  requireUserSubmission();

  $q = db()->prepare("SELECT file_path FROM submissions WHERE id=?");
  $q->execute([$id]);
  $s = $q->fetch();

  if($s && !empty($s['file_path'])){

    $file = __DIR__ . '/../uploads/submissions/'.$s['file_path'];

    if(is_file($file)){
      unlink($file);
    }

  }

  $stmt = db()->prepare("DELETE FROM submissions WHERE id=?");
  $stmt->execute([$id]);

  jsonResponse(['ok'=>true]);
}