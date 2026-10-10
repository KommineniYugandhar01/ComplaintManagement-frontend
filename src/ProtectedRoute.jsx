import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

    const userData = localStorage.getItem("user");

    // Not logged in
    if (!userData) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userData);

    // Wrong role
    if (role && user.role !== role) {

        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/user" replace />;
    }

    return children;
}

export default ProtectedRoute;