
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!API_URL) {
            alert("Backend URL is not configured. Check Vercel environment variables.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL.replace(/\/+$/, "")}/api/users/login`,
                {
                    email: email.trim(),
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 20000
                }
            );

            const user = response.data;

            if (!user || !user.id || !user.role) {
                alert("Login response is missing user details. Please check the backend.");
                return;
            }

            const role = String(user.role).toUpperCase();

            if (role !== "ADMIN" && role !== "USER") {
                alert("Your account has an invalid role. Please contact the administrator.");
                return;
            }

            // Do not store a password in browser storage.
            const safeUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: role
            };

            localStorage.setItem("user", JSON.stringify(safeUser));

            alert("Login successful!");

            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/user");
            }

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || data?.error;

                if (status === 401 || status === 403) {
                    alert("Login failed. Please check your email and password.");
                } else if (status === 404) {
                    alert("Login API not found. Check the backend endpoint /api/users/login.");
                } else if (status >= 500) {
                    alert("Backend server error. Please check your Render logs.");
                } else {
                    alert(`Login failed (${status}): ${message || "Please try again."}`);
                }

            } else if (error.code === "ECONNABORTED") {
                alert("The backend request timed out. Please try again.");
            } else if (error.request) {
                alert(
                    "No response from backend. Check CORS settings, the backend URL, and Render service status."
                );
            } else {
                alert(`Request error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Online Complaint Management System</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <br />

            <button
                type="button"
                onClick={() => navigate("/register")}
                disabled={loading}
            >
                Create Account
            </button>
        </div>
    );
}

export default Login;
