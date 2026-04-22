import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permission";

const ProtectedRoute = ({ children, permission }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/login" />;

    if (permission && !hasPermission(user, permission)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;