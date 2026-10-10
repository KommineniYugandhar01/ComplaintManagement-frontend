import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";


function ProtectedRoute({ children, role }) {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (role && user.role !== role) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/user" replace />;
    }

    return children;
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* USER DASHBOARD */}

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute role="USER">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* SUBMIT COMPLAINT */}

                <Route
                    path="/submit-complaint"
                    element={
                        <ProtectedRoute role="USER">
                            <SubmitComplaint />
                        </ProtectedRoute>
                    }
                />


                {/* MY COMPLAINTS */}

                <Route
                    path="/my-complaints"
                    element={
                        <ProtectedRoute role="USER">
                            <MyComplaints />
                        </ProtectedRoute>
                    }
                />


                {/* ADMIN DASHBOARD */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;