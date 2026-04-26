
# EduTrack - Plataforma LMS para gestión académica

Proyecto desarrollado como Trabajo Fin de Máster. EduTrack es una aplicación web tipo LMS que permite gestionar grupos, asignaturas, matrículas, tareas, entregas y calificaciones.

---

## Tecnologías utilizadas

### Frontend
- React
- Vite
- Axios
- React Router
- Chart.js
- Bootstrap

### Backend
- PHP
- MySQL
- API REST
- JWT para autenticación

### Entorno local
- XAMPP
- Apache
- MySQL / phpMyAdmin

---

## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

- XAMPP
- Node.js
- npm
- Navegador web
- Visual Studio Code o editor similar

---
## Estructura general del proyecto

edutrack-api/
 ├── public/
 │   └── index.php
 ├── src/
 │   ├── auth.php
 │   ├── dashboard.php
 │   ├── groups.php
 │   ├── subjects.php
 │   ├── tasks.php
 │   ├── submissions.php
 │   └── grades.php
 └── uploads/

edutrack-frontend/
 ├── src/
 │   ├── api/
 │   ├── auth/
 │   ├── components/
 │   └── pages/
 └── package.json
 
 ---
 
---

## Cómo ejecutar el proyecto 


1. Iniciar XAMPP (Apache + MySQL)
2. Importar base de datos
3. Ejecutar backend en htdocs
4. Ejecutar frontend con `npm run dev`
5. Acceder a http://localhost:5173
 
