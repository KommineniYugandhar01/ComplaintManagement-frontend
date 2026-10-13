import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function MyComplaints() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let user = null;

        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch (error) {
            console.error("Invalid user data:", error);
        }

        if (!user || !user.id) {
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
            setLoading(false);
            return;
        }

        fetchComplaints(user.id);
    }, [navigate]);

    const fetchComplaints = async (userId) => {
        if (!API_URL) {
            setErrorMessage("Backend URL is not configured.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const response = await axios.get(
                `${API_URL}/api/complaints/user/${userId}`
            );

            setComplaints(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error("Error fetching complaints:", error);

            if (error.response) {
                setErrorMessage(
                    `Unable to load complaints. Server returned ${error.response.status}.`
                );
            } else {
                setErrorMessage(
                    "Cannot connect to backend. Check your Render URL, CORS settings, and backend status."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING":
                return styles.pending;
            case "IN_PROGRESS":
                return styles.inProgress;
            case "RESOLVED":
                return styles.resolved;
            default:
                return styles.pending;
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        return Number.isNaN(parsedDate.getTime())
            ? "Not available"
            : parsedDate.toLocaleString();
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.logo}>
                        Online Complaint Management
                    </h1>
                    <p style={styles.subtitle}>My Complaints</p>
                </div>

                <div style={styles.headerButtons}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/user")}
                    >
                        Dashboard
                    </button>

                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.titleSection}>
                    <h2 style={styles.pageTitle}>My Complaints</h2>
                    <p style={styles.pageDescription}>
                        Track the status and progress of your submitted
                        complaints.
                    </p>
                </div>

                {loading && (
                    <div style={styles.messageCard}>
                        <div style={styles.loadingIcon}>⏳</div>
                        <h3>Loading complaints...</h3>
                    </div>
                )}

                {!loading && errorMessage && (
                    <div style={styles.messageCard}>
                        <div style={styles.emptyIcon}>⚠️</div>
                        <h3>Unable to load complaints</h3>
                        <p style={styles.emptyText}>{errorMessage}</p>

                        <button
                            style={styles.primaryButton}
                            onClick={() => {
                                let user = null;

                                try {
                                    user = JSON.parse(
                                        localStorage.getItem("user")
                                    );
                                } catch {
                                    user = null;
                                }

                                if (user?.id) {
                                    fetchComplaints(user.id);
                                } else {
                                    navigate("/login");
                                }
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !errorMessage && complaints.length === 0 && (
                    <div style={styles.messageCard}>
                        <div style={styles.emptyIcon}>📋</div>
                        <h3>No complaints submitted yet</h3>
                        <p style={styles.emptyText}>
                            You have not submitted any complaints.
                        </p>

                        <button
                            style={styles.primaryButton}
                            onClick={() =>
                                navigate("/submit-complaint")
                            }
                        >
                            Submit Your First Complaint
                        </button>
                    </div>
                )}

                {!loading && !errorMessage && complaints.length > 0 && (
                    <div style={styles.complaintsContainer}>
                        {complaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                style={styles.complaintCard}
                            >
                                <div style={styles.cardHeader}>
                                    <div>
                                        <span style={styles.complaintNumber}>
                                            COMPLAINT #{complaint.id}
                                        </span>

                                        <h3 style={styles.complaintTitle}>
                                            {complaint.title}
                                        </h3>
                                    </div>

                                    <span
                                        style={getStatusClass(
                                            complaint.status
                                        )}
                                    >
                                        {complaint.status || "PENDING"}
                                    </span>
                                </div>

                                <div style={styles.section}>
                                    <h4 style={styles.sectionTitle}>
                                        Description
                                    </h4>
                                    <p style={styles.description}>
                                        {complaint.description}
                                    </p>
                                </div>

                                <div style={styles.detailsGrid}>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>
                                            Category
                                        </span>
                                        <strong style={styles.detailValue}>
                                            {complaint.category || "N/A"}
                                        </strong>
                                    </div>

                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>
                                            Location
                                        </span>
                                        <strong style={styles.detailValue}>
                                            {complaint.location || "N/A"}
                                        </strong>
                                    </div>
                                </div>

                                <div style={styles.remarksBox}>
                                    <h4 style={styles.sectionTitle}>
                                        Admin Remarks
                                    </h4>
                                    <p style={styles.remarksText}>
                                        {complaint.adminRemarks ||
                                            "No remarks yet"}
                                    </p>
                                </div>

                                <div style={styles.dateSection}>
                                    <div>
                                        <span style={styles.detailLabel}>
                                            Created
                                        </span>
                                        <p style={styles.dateText}>
                                            {formatDate(
                                                complaint.createdDate
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <span style={styles.detailLabel}>
                                            Last Updated
                                        </span>
                                        <p style={styles.dateText}>
                                            {formatDate(
                                                complaint.updatedDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer style={styles.footer}>
                Online Complaint Management System
            </footer>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif"
    },
    header: {
        background: "#1e3a8a",
        color: "white",
        padding: "20px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    },
    logo: {
        margin: 0,
        fontSize: "25px"
    },
    subtitle: {
        margin: "5px 0 0",
        opacity: 0.85
    },
    headerButtons: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },
    backButton: {
        background: "white",
        color: "#1e3a8a",
        border: "none",
        padding: "10px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    logoutButton: {
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    container: {
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "0 20px"
    },
    titleSection: {
        marginBottom: "25px"
    },
    pageTitle: {
        margin: 0,
        color: "#1f2937",
        fontSize: "30px"
    },
    pageDescription: {
        color: "#6b7280",
        marginTop: "8px"
    },
    complaintsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "25px"
    },
    complaintCard: {
        background: "white",
        borderRadius: "12px",
        padding: "28px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "15px",
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "20px"
    },
    complaintNumber: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#6b7280"
    },
    complaintTitle: {
        margin: "8px 0 0",
        fontSize: "23px",
        color: "#1f2937"
    },
    pending: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "8px 14px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "13px"
    },
    inProgress: {
        background: "#dbeafe",
        color: "#1e40af",
        padding: "8px 14px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "13px"
    },
    resolved: {
        background: "#dcfce7",
        color: "#166534",
        padding: "8px 14px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "13px"
    },
    section: {
        marginTop: "20px"
    },
    sectionTitle: {
        margin: "0 0 8px",
        color: "#374151"
    },
    description: {
        color: "#4b5563",
        lineHeight: "1.6",
        margin: 0,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere"
    },
    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginTop: "20px"
    },
    detailItem: {
        background: "#f8fafc",
        padding: "15px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        overflowWrap: "anywhere"
    },
    detailLabel: {
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    detailValue: {
        color: "#1f2937"
    },
    remarksBox: {
        background: "#f8fafc",
        borderRadius: "8px",
        padding: "18px",
        marginTop: "20px"
    },
    remarksText: {
        margin: 0,
        color: "#4b5563",
        lineHeight: "1.5",
        overflowWrap: "anywhere"
    },
    dateSection: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #e5e7eb"
    },
    dateText: {
        margin: "5px 0 0",
        color: "#4b5563"
    },
    messageCard: {
        background: "white",
        padding: "50px 25px",
        borderRadius: "12px",
        textAlign: "center",
        overflowWrap: "anywhere",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
    },
    loadingIcon: {
        fontSize: "40px"
    },
    emptyIcon: {
        fontSize: "45px"
    },
    emptyText: {
        color: "#6b7280"
    },
    primaryButton: {
        background: "#1e3a8a",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "10px"
    },
    footer: {
        textAlign: "center",
        padding: "25px",
        color: "#6b7280",
        marginTop: "30px"
    }
};

export default MyComplaints;
