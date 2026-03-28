<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

function requireDashboardAccess(): array {
  $SECRET = "SUPER_SECRET_KEY_123";

  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

  if (!is_string($auth) || !str_starts_with($auth, 'Bearer ')) {
    jsonResponse(['error' => 'No autorizado'], 401);
  }

  $token = substr($auth, 7);
  $payload = verify_jwt($token, $SECRET);

  if (!$payload) {
    jsonResponse(['error' => 'Token inválido'], 401);
  }

  if (!in_array(($payload['role'] ?? ''), ['admin', 'teacher'], true)) {
    jsonResponse(['error' => 'Prohibido'], 403);
  }

  return $payload;
}

function dashboard_stats(): void {
  requireDashboardAccess();

  $pdo = db();

  $groups = (int) $pdo->query("SELECT COUNT(*) FROM groups")->fetchColumn();
  $subjects = (int) $pdo->query("SELECT COUNT(*) FROM subjects")->fetchColumn();
  $students = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
  $tasks = (int) $pdo->query("SELECT COUNT(*) FROM tasks")->fetchColumn();
  $submissions = (int) $pdo->query("SELECT COUNT(*) FROM submissions")->fetchColumn();
  $grades = (int) $pdo->query("SELECT COUNT(*) FROM grades")->fetchColumn();

  $avgGradeRaw = $pdo->query("SELECT AVG(score) FROM grades")->fetchColumn();
  $avgGrade = $avgGradeRaw !== null ? round((float)$avgGradeRaw, 2) : 0;

  // Entregas a tiempo / fuera de plazo
  $lateStmt = $pdo->query("
    SELECT
      SUM(CASE WHEN s.submitted_at > t.due_date THEN 1 ELSE 0 END) AS late_count,
      SUM(CASE WHEN s.submitted_at <= t.due_date THEN 1 ELSE 0 END) AS on_time_count
    FROM submissions s
    JOIN tasks t ON t.id = s.task_id
  ");
  $lateRow = $lateStmt->fetch();
  $lateCount = (int)($lateRow['late_count'] ?? 0);
  $onTimeCount = (int)($lateRow['on_time_count'] ?? 0);

  // Media de notas por alumno
  $studentsGradesStmt = $pdo->query("
    SELECT
      u.name,
      ROUND(AVG(g.score), 2) AS avg_score
    FROM grades g
    JOIN submissions s ON s.id = g.submission_id
    JOIN users u ON u.id = s.student_id
    GROUP BY u.id, u.name
    ORDER BY avg_score DESC
    LIMIT 10
  ");
  $studentsGrades = $studentsGradesStmt->fetchAll();

  // Media de notas por asignatura
  $subjectsGradesStmt = $pdo->query("
    SELECT
      sub.name,
      ROUND(AVG(g.score), 2) AS avg_score
    FROM grades g
    JOIN submissions s ON s.id = g.submission_id
    JOIN tasks t ON t.id = s.task_id
    JOIN subjects sub ON sub.id = t.subject_id
    GROUP BY sub.id, sub.name
    ORDER BY sub.name ASC
  ");
  $subjectsGrades = $subjectsGradesStmt->fetchAll();

  jsonResponse([
    'data' => [
      'groups' => $groups,
      'subjects' => $subjects,
      'students' => $students,
      'tasks' => $tasks,
      'submissions' => $submissions,
      'grades' => $grades,
      'avg_grade' => $avgGrade,
      'late_count' => $lateCount,
      'on_time_count' => $onTimeCount,
      'students_grades' => $studentsGrades,
      'subjects_grades' => $subjectsGrades
    ]
  ]);
}