import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/public/LandingPage/LandingPage";
import About from "./components/public/LandingPage/About";
import Login from "./components/public/LandingPage/Login";
import Register from "./components/public/LandingPage/Register";
import Dashboard from "./components/private/Dashboard/Dashboard";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth");
  return isAuth === "true" ? children : <Navigate to="/login" />;
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
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;