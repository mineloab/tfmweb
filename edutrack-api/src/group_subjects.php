<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function readJsonGS(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function requireAdminGS() {
  $SECRET = "SUPER_SECRET_KEY_123";

  $headers = getallheaders();
  $auth = $headers['Authorization'] ?? '';

  if (!str_starts_with($auth, 'Bearer ')) {
    jsonResponse(['error' => 'No autorizado'], 401);
  }

  $token = substr($auth, 7);
  $payload = verify_jwt($token, $SECRET);

  if (!$payload || $payload['role'] !== 'admin') {
    jsonResponse(['error' => 'Prohibido'], 403);
  }

  return $payload;
}

function groupSubjects_index() {
  requireAdminGS();

  $stmt = db()->query("
    SELECT gs.id,
           g.name AS group_name,
           s.name AS subject_name
    FROM group_subjects gs
    JOIN groups g ON g.id = gs.group_id
    JOIN subjects s ON s.id = gs.subject_id
    ORDER BY gs.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}

function groupSubjects_store() {
  requireAdminGS();

  $in = readJsonGS();

  $stmt = db()->prepare("
    INSERT INTO group_subjects (group_id, subject_id)
    VALUES (?, ?)
  ");

  $stmt->execute([
    $in['group_id'],
    $in['subject_id']
  ]);

  jsonResponse(['ok' => true]);
}

function groupSubjects_destroy($id) {
  requireAdminGS();

  $stmt = db()->prepare("DELETE FROM group_subjects WHERE id = ?");
  $stmt->execute([$id]);

  jsonResponse(['ok' => true]);
}