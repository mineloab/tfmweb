<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function requireTeacher() {

  $SECRET = "SUPER_SECRET_KEY_123";

  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $headers['Authorization'] ?? '';

  if (!str_starts_with($auth, 'Bearer ')) {
    jsonResponse(['error'=>'No autorizado'],401);
  }

  $token = substr($auth,7);
  $payload = verify_jwt($token,$SECRET);

  if(!$payload){
    jsonResponse(['error'=>'Token inválido'],401);
  }

  return $payload;
}

function grades_index(){

  requireTeacher();

  $stmt = db()->query("SELECT * FROM grades ORDER BY id DESC");

  jsonResponse(['data'=>$stmt->fetchAll()]);
}

function grades_store(){

  $user = requireTeacher();

  $in = json_decode(file_get_contents("php://input"), true);

  $submission_id = (int)($in['submission_id'] ?? 0);
  $grade = (float)($in['grade'] ?? 0);
  $feedback = $in['feedback'] ?? '';

  $teacher_id = (int)($user['id'] ?? $user['user_id'] ?? 0);

  $stmt = db()->prepare("
    INSERT INTO grades (submission_id,teacher_id,grade,feedback)
    VALUES (?,?,?,?)
  ");

  $stmt->execute([
    $submission_id,
    $teacher_id,
    $grade,
    $feedback
  ]);

  jsonResponse(['ok'=>true]);
}

function grades_destroy($id){

  requireTeacher();

  $stmt = db()->prepare("DELETE FROM grades WHERE id=?");
  $stmt->execute([$id]);

  jsonResponse(['ok'=>true]);
}