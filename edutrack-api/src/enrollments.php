<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function readJsonEnroll(): array {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function requireAdminEnroll() {

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

// GET
function enrollments_index() {

  requireAdminEnroll();

  $stmt = db()->query("
    SELECT e.id,
           u.name AS student,
           g.name AS group_name
    FROM enrollments e
    JOIN users u ON u.id = e.user_id
    JOIN groups g ON g.id = e.group_id
    ORDER BY e.id DESC
  ");

  jsonResponse(['data' => $stmt->fetchAll()]);
}

// POST
function enrollments_store() {

  requireAdminEnroll();

  $in = readJsonEnroll();

  $stmt = db()->prepare("
    INSERT INTO enrollments (user_id, group_id)
    VALUES (?, ?)
  ");

  $stmt->execute([
    $in['user_id'],
    $in['group_id']
  ]);

  jsonResponse(['ok' => true]);
}

// DELETE
function enrollments_destroy($id) {

  requireAdminEnroll();

  $stmt = db()->prepare("DELETE FROM enrollments WHERE id = ?");
  $stmt->execute([$id]);

  jsonResponse(['ok' => true]);
}