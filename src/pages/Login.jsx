import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/users/login`,
                {
                    email: email,
                    password: password
                }
            );

            const user = response.data;

            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");

            if (user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/user");
            }

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                alert(
                    `Login failed: ${
                        error.response.data?.message ||
                        error.response.statusText ||
                        "Check your email and password"
                    }`
                );
            } else {
                alert(
                    "Cannot connect to backend. Check backend URL, CORS, and Render logs."
                );
            }
        }
    };

    return (
        <div>
            <h1>Online Complaint Management System</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">Login</button>
            </form>

            <br />

            <button onClick={() => navigate("/register")}>
                Create Account
            </button>
        </div>
    );
}

export default Login;