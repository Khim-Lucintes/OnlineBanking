import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./components/public/LandingPage/LandingPage";
import About from "./components/public/LandingPage/About";
import Login from "./components/public/LandingPage/Login";
import Register from "./components/public/LandingPage/Register";

// Private pages
import Dashboard from "./components/private/customer/Dashboard/Dashboard";
import AdminDashboard from "./components/private/admin/AdminDashboard/AdminDashboard";
import SuperAdminDashboard from "./components/private/superadmin/SuperAdminDashboard/SuperAdminDashboard";

// AUTH HELPERS
const getUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const isAuthenticated = () => {
  return !!getUser();
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const CustomerRoute = ({ children }) => {
  const user = getUser();
  return Number(user?.role_id) === 1 ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = getUser();
  return Number(user?.role_id) === 2 ? children : <Navigate to="/login" />;
};

const SuperAdminRoute = ({ children }) => {
  const user = getUser();
  return Number(user?.role_id) === 3 ? children : <Navigate to="/login" />;
};

function Main() {
  return (
    <BrowserRouter>
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

        {/* Uncomment later when your superadmin dashboard exists */}
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;