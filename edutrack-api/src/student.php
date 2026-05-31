<?php

require_once __DIR__ . '/db.php';

function student_dashboard($student_id) {

    $pdo = db();

    try {

        // Tareas
        $stmtTasks = $pdo->prepare("
            SELECT
                t.id,
                t.title,
                t.description,
                t.due_date
            FROM tasks t
            ORDER BY t.due_date ASC
        ");

        $stmtTasks->execute();

        $tasks = $stmtTasks->fetchAll(PDO::FETCH_ASSOC);

        // Entregas + notas
        $stmtGrades = $pdo->prepare("
            SELECT
                s.id AS submission_id,
                t.title,
                s.file_path,
                s.submitted_at,
                g.score AS grade,
                g.feedback
            FROM submissions s
            INNER JOIN tasks t ON t.id = s.task_id
            LEFT JOIN grades g ON g.submission_id = s.id
            WHERE s.student_id = ?
            ORDER BY s.submitted_at DESC
        ");

        $stmtGrades->execute([$student_id]);

        $grades = $stmtGrades->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'tasks' => $tasks,
            'grades' => $grades
        ], JSON_UNESCAPED_UNICODE);

    } catch (Throwable $e) {

        http_response_code(500);

        echo json_encode([
            'error' => $e->getMessage()
        ]);
    }
}