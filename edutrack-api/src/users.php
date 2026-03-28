<?php

require_once __DIR__ . '/db.php';

function users_index() {

  $stmt = db()->query("
    SELECT id, name, email
    FROM users
    WHERE role = 'student'
    ORDER BY name
  ");

  jsonResponse([
    'data' => $stmt->fetchAll()
  ]);

}