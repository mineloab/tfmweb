<?php
require_once __DIR__ . '/db.php';

function dashboard_stats() {
    $pdo = db();

    try {
        $groups = (int)$pdo->query("SELECT COUNT(*) FROM `groups`")->fetchColumn();
        $subjects = (int)$pdo->query("SELECT COUNT(*) FROM subjects")->fetchColumn();
        $students = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        $tasks = (int)$pdo->query("SELECT COUNT(*) FROM tasks")->fetchColumn();
        $submissions = (int)$pdo->query("SELECT COUNT(*) FROM submissions")->fetchColumn();

        $grades = (int)$pdo->query("SELECT COUNT(*) FROM grades WHERE score IS NOT NULL")->fetchColumn();

        $avg = $pdo->query("SELECT AVG(score) FROM grades WHERE score IS NOT NULL")->fetchColumn();
        $avg = $avg !== null ? round((float)$avg, 2) : 0;

        // Media por alumno
        $stmtStudents = $pdo->query("
            SELECT 
                u.name AS name,
                ROUND(AVG(g.score), 2) AS avg_score
            FROM grades g
            INNER JOIN submissions s ON s.id = g.submission_id
            INNER JOIN users u ON u.id = s.student_id
            WHERE g.score IS NOT NULL
            GROUP BY u.id, u.name
            ORDER BY u.name ASC
        ");
        $students_grades = $stmtStudents->fetchAll(PDO::FETCH_ASSOC);

        // Media por asignatura
        $stmtSubjects = $pdo->query("
            SELECT 
                sub.name AS name,
                ROUND(AVG(g.score), 2) AS avg_score
            FROM grades g
            INNER JOIN submissions s ON s.id = g.submission_id
            INNER JOIN tasks t ON t.id = s.task_id
            INNER JOIN subjects sub ON sub.id = t.subject_id
            WHERE g.score IS NOT NULL
            GROUP BY sub.id, sub.name
            ORDER BY sub.name ASC
        ");
        $subjects_grades = $stmtSubjects->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'groups' => $groups,
            'subjects' => $subjects,
            'students' => $students,
            'tasks' => $tasks,
            'submissions' => $submissions,
            'grades' => $grades,
            'avg' => $avg,
            'avg_grade' => $avg,

            'students_grades' => $students_grades,
            'subjects_grades' => $subjects_grades,

            'late_count' => 0,
            'on_time_count' => $submissions
        ], JSON_UNESCAPED_UNICODE);

        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error en dashboard',
            'details' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}