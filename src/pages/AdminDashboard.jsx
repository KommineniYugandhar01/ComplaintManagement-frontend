import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({});
    const [remarks, setRemarks] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "ADMIN") {
            navigate("/login");
            return;
        }

        fetchComplaints();
    }, [navigate]);

    // Fetch all complaints from the backend
    const fetchComplaints = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/complaints`
            );

            setComplaints(response.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);

            if (error.response) {
                alert(
                    `Failed to load complaints. Status: ${error.response.status}`
                );
            } else {
                alert(
                    "Cannot connect to backend. Check the API URL, backend status, and CORS settings."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Update complaint status and admin remarks
    const handleUpdate = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/complaints/${id}/status`,
                {
                    status: status[id] || "PENDING",
                    adminRemarks: remarks[id] || ""
                }
            );

            alert("Complaint updated successfully!");

            await fetchComplaints();
        } catch (error) {
            console.error("Update error:", error);

            if (error.response) {
                alert(
                    "Failed to update complaint: " +
                    JSON.stringify(error.response.data)
                );
            } else {
                alert(
                    "Cannot connect to backend. Check the API URL and CORS settings."
                );
            }
        }
    };

    // Logout admin
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Dashboard statistics
    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "PENDING"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) => complaint.status === "IN_PROGRESS"
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "RESOLVED"
    ).length;

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading Admin Dashboard...
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        Admin Dashboard
                    </h1>

                    <p style={styles.subtitle}>
                        Online Complaint Management System
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>
            </div>

            {/* STATISTICS */}
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <h3>Total Complaints</h3>
                    <p style={styles.statNumber}>
                        {totalComplaints}
                    </p>
                </div>

                <div style={styles.statCard}>
                    <h3>Pending</h3>
                    <p style={styles.statNumber}>
                        {pendingComplaints}
                    </p>
                </div>

                <div style={styles.statCard}>
                    <h3>In Progress</h3>
                    <p style={styles.statNumber}>
                        {inProgressComplaints}
                    </p>
                </div>

                <div style={styles.statCard}>
                    <h3>Resolved</h3>
                    <p style={styles.statNumber}>
                        {resolvedComplaints}
                    </p>
                </div>
            </div>

            {/* COMPLAINTS */}
            <div style={styles.content}>
                <h2 style={styles.heading}>
                    All Complaints
                </h2>

                {complaints.length === 0 ? (
                    <div style={styles.empty}>
                        No complaints available.
                    </div>
                ) : (
                    complaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            style={styles.complaintCard}
                        >
                            <div style={styles.complaintHeader}>
                                <h2>
                                    {complaint.title || `Complaint #${complaint.id}`}
                                </h2>

                                <span
                                    style={{
                                        ...styles.status,
                                        ...(complaint.status === "PENDING"
                                            ? styles.pending
                                            : complaint.status === "IN_PROGRESS"
                                            ? styles.progress
                                            : styles.resolved)
                                    }}
                                >
                                    {complaint.status}
                                </span>
                            </div>

                            <p>
                                <strong>Complaint ID:</strong>{" "}
                                {complaint.id}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {complaint.description}
                            </p>

                            <p>
                                <strong>Category:</strong>{" "}
                                {complaint.category}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {complaint.location}
                            </p>

                            <p>
                                <strong>User:</strong>{" "}
                                {complaint.user?.name || "N/A"}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {complaint.user?.email || "N/A"}
                            </p>

                            <hr />

                            <h3>Update Complaint</h3>

                            <label htmlFor={`status-${complaint.id}`}>
                                Status
                            </label>

                            <select
                                id={`status-${complaint.id}`}
                                value={
                                    status[complaint.id] ??
                                    complaint.status ??
                                    "PENDING"
                                }
                                onChange={(e) =>
                                    setStatus((previous) => ({
                                        ...previous,
                                        [complaint.id]: e.target.value
                                    }))
                                }
                                style={styles.input}
                            >
                                <option value="PENDING">
                                    PENDING
                                </option>

                                <option value="IN_PROGRESS">
                                    IN_PROGRESS
                                </option>

                                <option value="RESOLVED">
                                    RESOLVED
                                </option>
                            </select>

                            <label htmlFor={`remarks-${complaint.id}`}>
                                Admin Remarks
                            </label>

                            <textarea
                                id={`remarks-${complaint.id}`}
                                placeholder="Enter remarks..."
                                value={
                                    remarks[complaint.id] ??
                                    complaint.adminRemarks ??
                                    ""
                                }
                                onChange={(e) =>
                                    setRemarks((previous) => ({
                                        ...previous,
                                        [complaint.id]: e.target.value
                                    }))
                                }
                                style={styles.textarea}
                            />

                            <button
                                onClick={() => handleUpdate(complaint.id)}
                                style={styles.updateButton}
                            >
                                Update Complaint
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif"
    },

    header: {
        backgroundColor: "#1f2937",
        color: "white",
        padding: "25px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    title: {
        margin: 0,
        fontSize: "30px"
    },

    subtitle: {
        marginTop: "8px",
        color: "#d1d5db"
    },

    logoutButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "12px 22px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    statsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        padding: "30px 40px"
    },

    statCard: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        textAlign: "center"
    },

    statNumber: {
        fontSize: "32px",
        fontWeight: "bold",
        margin: "10px 0 0"
    },

    content: {
        padding: "0 40px 40px"
    },

    heading: {
        marginBottom: "25px"
    },

    complaintCard: {
        backgroundColor: "white",
        padding: "25px",
        marginBottom: "25px",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
    },

    complaintHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "15px"
    },

    status: {
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold"
    },

    pending: {
        backgroundColor: "#fef3c7",
        color: "#92400e"
    },

    progress: {
        backgroundColor: "#dbeafe",
        color: "#1e40af"
    },

    resolved: {
        backgroundColor: "#dcfce7",
        color: "#166534"
    },

    input: {
        display: "block",
        width: "100%",
        maxWidth: "500px",
        boxSizing: "border-box",
        padding: "11px",
        marginTop: "8px",
        marginBottom: "18px",
        border: "1px solid #d1d5db",
        borderRadius: "6px"
    },

    textarea: {
        display: "block",
        width: "100%",
        maxWidth: "500px",
        boxSizing: "border-box",
        minHeight: "90px",
        padding: "11px",
        marginTop: "8px",
        marginBottom: "18px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        resize: "vertical"
    },

    updateButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    empty: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center"
    },

    loading: {
        padding: "50px",
        textAlign: "center",
        fontSize: "20px"
    }
};

export default AdminDashboard;