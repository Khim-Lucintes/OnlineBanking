import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, hasPermission } from "../../utils/permission";

function ProtectedRoute({ children, permission }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;