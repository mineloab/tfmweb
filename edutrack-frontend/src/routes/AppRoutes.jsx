import { Routes, Route } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Teacher from "../pages/Teacher";
import Student from "../pages/Student";

import Groups from "../pages/Admin/Groups";
import Subjects from "../pages/Admin/Subjects";
import GroupSubjects from "../pages/Admin/GroupSubjects";
import Enrollments from "../pages/Admin/Enrollments";
import Tasks from "../pages/Admin/Tasks";
import Submissions from "../pages/Admin/Submissions";
import Dashboard from "../pages/Admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<Login />} />

      {/* Home (redirige según rol) */}
      <Route path="/" element={<Home />} />

      {/* Admin */}
     <Route
  path="/admin"
  element={
    <RequireAuth role="admin">
      <Admin />
    </RequireAuth>
  }
>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="groups" element={<Groups />} />
  <Route path="subjects" element={<Subjects />} />
  <Route path="group-subjects" element={<GroupSubjects />} />
  <Route path="enrollments" element={<Enrollments />} />
  <Route path="tasks" element={<Tasks />} />
  <Route path="submissions" element={<Submissions />} />
</Route>

      {/* CRUD Grupos */}
      <Route
        path="/admin/groups"
        element={
          <RequireAuth role="admin">
            <Groups />
          </RequireAuth>
        }
      />

      {/* CRUD Asignaturas */}
      <Route
        path="/admin/subjects"
        element={
          <RequireAuth role="admin">
            <Subjects />
          </RequireAuth>
        }
      />

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <RequireAuth role="teacher">
            <Teacher />
          </RequireAuth>
        }
      />

      {/* Student */}
      <Route
        path="/student"
        element={
          <RequireAuth role="student">
            <Student />
          </RequireAuth>
        }
      />
      <Route
  path="/admin/group-subjects"
  element={
    <RequireAuth role="admin">
      <GroupSubjects />
    </RequireAuth>
  }
/>
<Route
  path="/admin/enrollments"
  element={
    <RequireAuth role="admin">
      <Enrollments />
    </RequireAuth>
  }
/>

<Route
  path="/admin/tasks"
  element={
    <RequireAuth role="admin">
      <Tasks />
    </RequireAuth>
  }
/>
<Route
  path="/admin/submissions"
  element={
    <RequireAuth role="admin">
      <Submissions />
    </RequireAuth>
  }

/>
<Route
  path="/admin/dashboard"
  element={
    <RequireAuth role="admin">
      <Dashboard />
    </RequireAuth>
  }
/>

      {/* 404 */}
      <Route
        path="*"
        element={<div style={{ padding: 16 }}>Página no encontrada</div>}
      />
    </Routes>
    



    
  );
}