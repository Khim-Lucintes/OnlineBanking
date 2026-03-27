import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "../components/public/LandingPage/LandingPage";
import About from "../components/public/LandingPage/About";
import Login from "../components/public/LandingPage/Login";
import Register from "../components/public/LandingPage/Register";

// Private pages
import Dashboard from "../components/private/Dashboard/Dashboard";

// Simple auth check (replace later with real login system)
const isAuthenticated = false;

// Private Route Wrapper
function PrivateRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;