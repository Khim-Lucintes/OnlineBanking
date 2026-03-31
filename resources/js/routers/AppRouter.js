import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "../components/public/LandingPage/LandingPage";
import About from "../components/public/LandingPage/About";
import Login from "../components/public/LandingPage/Login";
import Register from "../components/public/LandingPage/Register";

// Private pages
import Dashboard from "../components/private/Dashboard/Dashboard";
import AdminDashboard from "../components/private/AdminDashboard/AdminDashboard";
import SuperAdminDashboard from "../components/private/SuperAdminDashboard/SuperAdminDashboard";

// ==========================
// AUTH HELPERS
// ==========================
const getUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const isAuthenticated = () => {
  return !!getUser();
};

// ==========================
// PRIVATE ROUTE (GENERAL)
// ==========================
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// ==========================
// ROLE-BASED ROUTES
// ==========================
function CustomerRoute({ children }) {
  const user = getUser();
  return user?.role_id === 1 ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = getUser();
  return user?.role_id === 2 ? children : <Navigate to="/login" />;
}

function SuperAdminRoute({ children }) {
  const user = getUser();
  return user?.role_id === 3 ? children : <Navigate to="/login" />;
}

// ==========================
// ROUTER
// ==========================
function AppRouter() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= CUSTOMER ================= */}
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

      {/* ================= ADMIN ================= */}
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

      {/* ================= SUPERADMIN ================= */}
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

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;