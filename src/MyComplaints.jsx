import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/complaints/user/${user.id}`
            );

            setComplaints(response.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
            alert("Unable to load complaints.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const getStatusClass = (status) => {
        if (status === "PENDING") {
            return styles.pending;
        }

        if (status === "IN_PROGRESS") {
            return styles.inProgress;
        }

        if (status === "RESOLVED") {
            return styles.resolved;
        }

        return styles.pending;
    };

    if (!user) {
        return null;
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <header style={styles.header}>

                <div>
                    <h1 style={styles.logo}>
                        Online Complaint Management
                    </h1>

                    <p style={styles.subtitle}>
                        My Complaints
                    </p>
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


            {/* MAIN */}
            <main style={styles.container}>

                <div style={styles.titleSection}>

                    <h2 style={styles.pageTitle}>
                        My Complaints
                    </h2>

                    <p style={styles.pageDescription}>
                        Track the status and progress of your submitted complaints.
                    </p>

                </div>


                {/* LOADING */}
                {loading && (
                    <div style={styles.messageCard}>
                        <div style={styles.loadingIcon}>
                            ⏳
                        </div>

                        <h3>
                            Loading complaints...
                        </h3>
                    </div>
                )}


                {/* NO COMPLAINTS */}
                {!loading && complaints.length === 0 && (

                    <div style={styles.messageCard}>

                        <div style={styles.emptyIcon}>
                            📋
                        </div>

                        <h3>
                            No complaints submitted yet
                        </h3>

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


                {/* COMPLAINTS */}
                {!loading && complaints.length > 0 && (

                    <div style={styles.complaintsContainer}>

                        {complaints.map((complaint) => (

                            <div
                                key={complaint.id}
                                style={styles.complaintCard}
                            >

                                {/* CARD HEADER */}
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
                                        {complaint.status}
                                    </span>

                                </div>


                                {/* DESCRIPTION */}
                                <div style={styles.section}>

                                    <h4 style={styles.sectionTitle}>
                                        Description
                                    </h4>

                                    <p style={styles.description}>
                                        {complaint.description}
                                    </p>

                                </div>


                                {/* DETAILS */}
                                <div style={styles.detailsGrid}>

                                    <div style={styles.detailItem}>

                                        <span style={styles.detailLabel}>
                                            Category
                                        </span>

                                        <strong style={styles.detailValue}>
                                            {complaint.category}
                                        </strong>

                                    </div>


                                    <div style={styles.detailItem}>

                                        <span style={styles.detailLabel}>
                                            Location
                                        </span>

                                        <strong style={styles.detailValue}>
                                            {complaint.location}
                                        </strong>

                                    </div>

                                </div>


                                {/* ADMIN REMARKS */}
                                <div style={styles.remarksBox}>

                                    <h4 style={styles.sectionTitle}>
                                        Admin Remarks
                                    </h4>

                                    <p style={styles.remarksText}>
                                        {complaint.adminRemarks ||
                                            "No remarks yet"}
                                    </p>

                                </div>


                                {/* DATES */}
                                <div style={styles.dateSection}>

                                    <div>

                                        <span style={styles.detailLabel}>
                                            Created
                                        </span>

                                        <p style={styles.dateText}>
                                            {new Date(
                                                complaint.createdDate
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    <div>

                                        <span style={styles.detailLabel}>
                                            Last Updated
                                        </span>

                                        <p style={styles.dateText}>
                                            {new Date(
                                                complaint.updatedDate
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>


            {/* FOOTER */}
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
        gap: "10px"
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
        gap: "20px",
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
        margin: 0
    },


    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginTop: "20px"
    },


    detailItem: {
        background: "#f8fafc",
        padding: "15px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
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
        lineHeight: "1.5"
    },


    dateSection: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
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
        padding: "50px",
        borderRadius: "12px",
        textAlign: "center",
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