<?php
// =========================
// CORS (SIEMPRE)
// =========================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// =========================
// INCLUDES
// =========================
require_once __DIR__ . '/../src/auth.php';
require_once __DIR__ . '/../src/groups.php';
require_once __DIR__ . '/../src/subjects.php';
require_once __DIR__ . '/../src/group_subjects.php';
require_once __DIR__ . '/../src/enrollments.php';
require_once __DIR__ . '/../src/users.php';
require_once __DIR__ . '/../src/tasks.php';
require_once __DIR__ . '/../src/submissions.php';
require_once __DIR__ . '/../src/grades.php';
require_once __DIR__ . '/../src/dashboard.php';

// =========================
// ROUTING
// =========================
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = '/edutrack-api/public';
$route = str_starts_with($path, $base) ? substr($path, strlen($base)) : $path;
$method = $_SERVER['REQUEST_METHOD'];


// =========================
// AUTH
// =========================
if ($route === '/api/auth/login' && $method === 'POST') {
  login();
  exit;
}

if ($route === '/api/auth/me' && $method === 'GET') {
  me();
  exit;
}


// =========================
// GROUPS
// =========================
if ($route === '/api/groups' && $method === 'GET') {
  groups_index();
  exit;
}

if ($route === '/api/groups' && $method === 'POST') {
  groups_store();
  exit;
}

if (preg_match('#^/api/groups/(\d+)$#', $route, $m)) {
  $id = (int)$m[1];

  if ($method === 'PUT') {
    groups_update($id);
    exit;
  }

  if ($method === 'DELETE') {
    groups_destroy($id);
    exit;
  }
}


// =========================
// SUBJECTS
// =========================
if ($route === '/api/subjects' && $method === 'GET') {
  subjects_index();
  exit;
}

if ($route === '/api/subjects' && $method === 'POST') {
  subjects_store();
  exit;
}

if (preg_match('#^/api/subjects/(\d+)$#', $route, $m)) {
  $id = (int)$m[1];

  if ($method === 'PUT') {
    subjects_update($id);
    exit;
  }

  if ($method === 'DELETE') {
    subjects_destroy($id);
    exit;
  }
}


// =========================
// GROUP - SUBJECTS
// =========================
if ($route === '/api/group-subjects' && $method === 'GET') {
  groupSubjects_index();
  exit;
}

if ($route === '/api/group-subjects' && $method === 'POST') {
  groupSubjects_store();
  exit;
}

if (preg_match('#^/api/group-subjects/(\d+)$#', $route, $m)) {
  if ($method === 'DELETE') {
    groupSubjects_destroy((int)$m[1]);
    exit;
  }
}


// =========================
// ENROLLMENTS
// =========================
if ($route === '/api/enrollments' && $method === 'GET') {
  enrollments_index();
  exit;
}

if ($route === '/api/enrollments' && $method === 'POST') {
  enrollments_store();
  exit;
}

if (preg_match('#^/api/enrollments/(\d+)$#', $route, $m)) {
  if ($method === 'DELETE') {
    enrollments_destroy((int)$m[1]);
    exit;
  }
}


// =========================
// USERS
// =========================
if ($route === '/api/users' && $method === 'GET') {
  users_index();
  exit;
}


// =========================
// TASKS
// =========================
if ($route === '/api/tasks' && $method === 'GET') {
  tasks_index();
  exit;
}

if ($route === '/api/tasks' && $method === 'POST') {
  tasks_store();
  exit;
}

if (preg_match('#^/api/tasks/(\d+)$#', $route, $m)) {
  if ($method === 'DELETE') {
    tasks_destroy((int)$m[1]);
    exit;
  }
}


// =========================
// SUBMISSIONS
// =========================
if ($route === '/api/submissions' && $method === 'GET') {
  submissions_index();
  exit;
}

if ($route === '/api/submissions' && $method === 'POST') {
  submissions_store();
  exit;
}

if (preg_match('#^/api/submissions/(\d+)$#', $route, $m)) {
  if ($method === 'DELETE') {
    submissions_destroy((int)$m[1]);
    exit;
  }
}


// =========================
// GRADES (MEJORADO 🔥)
// =========================
if ($route === '/api/grades' && $method === 'GET') {
  grades_index();
  exit;
}

if ($route === '/api/grades' && $method === 'POST') {
  grades_store();
  exit;
}

// GET por ID
if (preg_match('#^/api/grades/(\d+)$#', $route, $m)) {
  $id = (int)$m[1];

  if ($method === 'GET') {
    grades_show($id);
    exit;
  }

  if ($method === 'PUT') {
    grades_update($id);
    exit;
  }

  if ($method === 'DELETE') {
    grades_destroy($id);
    exit;
  }
}


// =========================
// DASHBOARD
// =========================
if ($route === '/api/dashboard/stats' && $method === 'GET') {
  dashboard_stats();
  exit;
}


// =========================
// 404
// =========================
http_response_code(404);
echo json_encode([
  'error' => 'Ruta no encontrada',
  'route' => $route
]);
exit;