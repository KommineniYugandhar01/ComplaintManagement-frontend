import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Electrical");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const complaint = {
            title: title,
            description: description,
            category: category,
            location: location
        };

        try {

            const response = await axios.post(
                `http://localhost:8080/api/complaints/user/${user.id}`,
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

                console.log(
                    "Backend response:",
                    error.response.data
                );

                alert(
                    "Failed to submit complaint!\n" +
                    JSON.stringify(error.response.data)
                );

            } else {

                alert("Cannot connect to backend!");

            }
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
                        <option value="Electrical">
                            Electrical
                        </option>

                        <option value="Cleaning">
                            Cleaning
                        </option>

                        <option value="Water">
                            Water
                        </option>

                        <option value="Classroom">
                            Classroom
                        </option>

                        <option value="Hostel">
                            Hostel
                        </option>

                        <option value="Other">
                            Other
                        </option>
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

                <button type="submit">
                    Submit Complaint
                </button>

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