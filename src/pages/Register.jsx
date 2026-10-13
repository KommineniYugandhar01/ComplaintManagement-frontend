import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!API_URL) {
            alert("Backend URL is not configured.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/users/register`,
                formData
            );

            console.log("Registration response:", response.data);

            alert("Registration successful!");

            navigate("/login");
        } catch (error) {
            console.error(
                "Registration error:",
                error.response?.data || error.message
            );

            if (error.response) {
                const message =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    "Please check your registration details.";

                alert(`Registration failed: ${message}`);
            } else {
                alert(
                    "Cannot connect to backend. Check the backend URL, server status, and CORS settings."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Online Complaint Management System</h1>

            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p>Already have an account?</p>

            <button onClick={() => navigate("/login")}>
                Login
            </button>
        </div>
    );
}

export default Register;