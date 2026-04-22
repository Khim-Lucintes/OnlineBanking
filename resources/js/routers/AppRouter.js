import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/shared/ProtectedRoute";

// Public pages
import Home from "../components/public/LandingPage/LandingPage";
import About from "../components/public/LandingPage/About";
import Login from "../components/public/LandingPage/Login";
import Register from "../components/public/LandingPage/Register";

// Private pages
import Dashboard from "../components/private/Dashboard/Dashboard";
import AdminDashboard from "../components/private/admin/AdminDashboard/AdminDashboard";
import SuperAdminDashboard from "../components/private/superadmin/SuperAdminDashboard/SuperAdminDashboard";

const getUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

function PrivateRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" replace />;
}

function CustomerRoute({ children }) {
  const user = getUser();
  return Number(user?.role_id) === 1 ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const user = getUser();
  return Number(user?.role_id) === 2 ? children : <Navigate to="/login" replace />;
}

function SuperAdminRoute({ children }) {
  const user = getUser();
  return Number(user?.role_id) === 3 ? children : <Navigate to="/login" replace />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <CustomerRoute>
              <Dashboard />
            </CustomerRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/superadmin/dashboard"
        element={
          <PrivateRoute>
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          </PrivateRoute>
        }
      />

      {/* SUPERADMIN FEATURES */}

      <Route
        path="/superadmin/audit-logs"
        element={
          <PrivateRoute>
            <SuperAdminRoute>
              <ProtectedRoute permission="full_audit_logs">
                <AuditLogs />
              </ProtectedRoute>
            </SuperAdminRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/superadmin/backup"
        element={
          <PrivateRoute>
            <SuperAdminRoute>
              <ProtectedRoute permission="backup_restore">
                <BackupRestore />
              </ProtectedRoute>
            </SuperAdminRoute>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;