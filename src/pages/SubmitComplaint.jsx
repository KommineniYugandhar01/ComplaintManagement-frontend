
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Render backend URL
const API_URL = import.meta.env.VITE_API_URL;

function SubmitComplaint() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Electrical");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let user;

        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch {
            user = null;
        }

        if (!user || !user.id) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        if (!API_URL) {
            alert("Backend URL is not configured!");
            return;
        }

        const complaint = {
            title,
            description,
            category,
            location
        };

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/complaints/user/${user.id}`,
                complaint
            );

            console.log("Complaint created:", response.data);

            alert("Complaint submitted successfully!");

            setTitle("");
            setDescription("");
            setCategory("Electrical");
            setLocation("");

            navigate("/my-complaints");
        } catch (error) {
            console.error("Complaint submission error:", error);

            if (error.response) {
                alert(
                    "Failed to submit complaint!\n" +
                    JSON.stringify(error.response.data)
                );
            } else {
                alert(
                    "Cannot connect to backend. Check your Render URL, CORS settings, and backend status."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Online Complaint Management System</h1>

            <h2>Submit Complaint</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Complaint Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <textarea
                        placeholder="Complaint Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >
                        <option value="Electrical">Electrical</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Water">Water</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <br />

                <div>
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Complaint"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() => navigate("/user")}
                >
                    Back
                </button>
            </form>
        </div>
    );
}

export default SubmitComplaint;
