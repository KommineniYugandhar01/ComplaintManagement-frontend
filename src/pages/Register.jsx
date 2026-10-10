import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/users/register",
                formData
            );

            console.log(response.data);

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {
            console.error(error);

            alert("Registration failed!");
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

                <button type="submit">
                    Register
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