import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/login",
                {
                    email: email,
                    password: password
                }
            );

            const user = response.data;

            // Save logged-in user
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");

            // Redirect based on role
            if (user.role === "ADMIN") {

                navigate("/admin");

            } else {

                navigate("/user");

            }

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {
                alert("Invalid email or password!");
            } else {
                alert("Cannot connect to backend!");
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

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            <button onClick={() => navigate("/register")}>
                Create Account
            </button>

        </div>
    );
}

export default Login;