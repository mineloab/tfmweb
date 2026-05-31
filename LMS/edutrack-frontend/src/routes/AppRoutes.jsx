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
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <Admin />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth role={["admin", "teacher"]}>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/groups"
        element={
          <RequireAuth role="admin">
            <Groups />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/subjects"
        element={
          <RequireAuth role="admin">
            <Subjects />
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
          <RequireAuth role={["admin", "teacher"]}>
            <Tasks />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/submissions"
        element={
          <RequireAuth role={["admin", "teacher"]}>
            <Submissions />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher"
        element={
          <RequireAuth role="teacher">
            <Teacher />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <RequireAuth role="teacher">
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher/tasks"
        element={
          <RequireAuth role="teacher">
            <Tasks />
          </RequireAuth>
        }
      />

      <Route
        path="/teacher/submissions"
        element={
          <RequireAuth role="teacher">
            <Submissions />
          </RequireAuth>
        }
      />

      <Route
        path="/student"
        element={
          <RequireAuth role="student">
            <Student />
          </RequireAuth>
        }
      />

      <Route
        path="*"
        element={<div style={{ padding: 16 }}>Página no encontrada</div>}
      />
    </Routes>
  );
}