# EduTrack – Sistema Web de Gestión y Evaluación Académica

EduTrack es una aplicación web desarrollada como Trabajo Final de Máster (TFM) para la gestión académica y seguimiento educativo en entornos formativos.

El sistema permite gestionar usuarios, grupos, asignaturas, tareas, entregas y calificaciones mediante una arquitectura cliente-servidor desacoplada basada en React, PHP y MySQL.

---

# Tecnologías utilizadas

## Frontend

* React
* Vite
* Bootstrap
* Axios
* React Router

## Backend

* PHP
* API REST
* JWT (JSON Web Token)

## Base de datos

* MySQL

## Entorno de desarrollo

* XAMPP
* Apache
* GitHub
* Jira

---

# Funcionalidades principales

## Gestión administrativa

* Gestión de usuarios y roles
* Gestión de grupos
* Gestión de asignaturas
* Matrículas de alumnos

## Gestión académica

* Creación de tareas
* Entregas de actividades
* Sistema de evaluación
* Feedback del profesor

## Dashboard académico

* Métricas y estadísticas
* Seguimiento del rendimiento
* Visualización gráfica de datos

## Exportación de datos

* Exportación CSV
* Informes PDF

---

# Arquitectura del sistema

El proyecto utiliza una arquitectura cliente-servidor desacoplada:

* Frontend desarrollado en React.
* Backend desarrollado en PHP mediante API REST.
* Comunicación mediante peticiones HTTP en formato JSON.
* Autenticación mediante JWT.
* Persistencia de datos mediante MySQL.

---

# Instalación del proyecto

## 1. Clonar el repositorio


git clone https://github.com/joseleonjaime/edutrack.git


---

# Configuración del backend

## 1. Copiar el proyecto en XAMPP

Copiar la carpeta:


edutrack-api


dentro de:


C:\xampp\htdocs\


## 2. Crear base de datos

Crear una base de datos MySQL llamada:


edutrack


## 3. Importar el archivo SQL

Importar el archivo:


edutrack.sql


mediante phpMyAdmin.

## 4. Iniciar Apache y MySQL

Desde el panel de control de XAMPP iniciar:

* Apache
* MySQL

---

# Configuración del frontend

## 1. Acceder al proyecto frontend


cd edutrack-frontend


## 2. Instalar dependencias


npm install


## 3. Ejecutar el proyecto


npm run dev


La aplicación se ejecutará normalmente en:


http://localhost:5173


---

# Credenciales de prueba

## Administrador

Email:


admin@demo.com


Contraseña:


123456


---

# Estructura del proyecto

## Frontend


edutrack-frontend/


* Componentes React
* Rutas protegidas
* Dashboard
* Gestión de tareas
* Panel alumno/profesor

## Backend


edutrack-api/


* API REST
* JWT
* Controladores PHP
* Conexión MySQL
* Gestión de permisos

---

# Seguridad implementada

* Autenticación JWT
* Protección de rutas
* Validación de roles
* Consultas preparadas PDO
* Validación básica de formularios
* Control de acceso por usuario

---

# Estado del proyecto

Proyecto desarrollado como Trabajo Final de Máster (TFM).

Actualmente implementa:

* autenticación,
* gestión académica,
* dashboard,
* entregas,
* evaluación,
* exportación de datos.

---

# Trabajos futuros

* Notificaciones por email
* Rúbricas de evaluación
* Accesibilidad WCAG
* Despliegue cloud
* Aplicación móvil
* Docker
* Auditoría de seguridad

---

# Autor

José León Jaime

Máster Universitario en Desarrollo de Sitios y Aplicaciones Web – UOC
