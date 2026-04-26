<?php
<<<<<<< HEAD
require_once __DIR__ . '/db.php';

function getJsonInput(): array {
    $input = json_decode(file_get_contents("php://input"), true);
    return is_array($input) ? $input : [];
}

function grades_index(): void {
    $pdo = db();

    try {
        $stmt = $pdo->query("
            SELECT 
                g.id,
                g.submission_id,
                g.teacher_id,
                g.score AS grade,
                g.feedback,
                g.graded_at
            FROM grades g
            ORDER BY g.graded_at DESC
        ");

        echo json_encode([
            'success' => true,
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error de base de datos',
            'error' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function grades_show(int $id): void {
    $pdo = db();

    try {
        $stmt = $pdo->prepare("
            SELECT 
                g.id,
                g.submission_id,
                g.teacher_id,
                g.score AS grade,
                g.feedback,
                g.graded_at
            FROM grades g
            WHERE g.id = ?
        ");
        $stmt->execute([$id]);
        $grade = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$grade) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Nota no encontrada'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $grade], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function grades_store(): void {
    $pdo = db();

    try {
        $data = getJsonInput();

        $submission_id = isset($data['submission_id']) ? (int)$data['submission_id'] : 0;
        $teacher_id = isset($data['teacher_id']) && $data['teacher_id'] !== '' ? (int)$data['teacher_id'] : 1;
        $score = isset($data['grade']) ? (float)$data['grade'] : null;
        $feedback = isset($data['feedback']) ? trim($data['feedback']) : '';

        if ($submission_id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'submission_id es obligatorio'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($score === null || $score < 0 || $score > 10) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'La nota debe estar entre 0 y 10'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM submissions WHERE id = ?");
        $stmt->execute([$submission_id]);

        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'La entrega no existe'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM grades WHERE submission_id = ?");
        $stmt->execute([$submission_id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            $stmt = $pdo->prepare("
                UPDATE grades
                SET score = ?, feedback = ?
                WHERE submission_id = ?
            ");
            $stmt->execute([$score, $feedback, $submission_id]);

            echo json_encode([
                'success' => true,
                'message' => 'Nota actualizada correctamente',
                'id' => (int)$existing['id']
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO grades (submission_id, teacher_id, score, feedback, graded_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$submission_id, $teacher_id, $score, $feedback]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Nota creada correctamente',
            'id' => (int)$pdo->lastInsertId()
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error de base de datos',
            'error' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function grades_update(int $id): void {
    $pdo = db();

    try {
        $data = getJsonInput();

        $score = isset($data['grade']) ? (float)$data['grade'] : null;
        $feedback = isset($data['feedback']) ? trim($data['feedback']) : '';

        if ($score === null || $score < 0 || $score > 10) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'La nota debe estar entre 0 y 10'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE grades
            SET score = ?, feedback = ?
            WHERE id = ?
        ");
        $stmt->execute([$score, $feedback, $id]);

        echo json_encode(['success' => true, 'message' => 'Nota actualizada correctamente'], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function grades_destroy(int $id): void {
    $pdo = db();

    try {
        $stmt = $pdo->prepare("DELETE FROM grades WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Nota eliminada correctamente'], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error de base de datos', 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        exit;
    }
=======

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
>>>>>>> 1e6634cdc72506e2983dcfae2d70978c731ae84b
}