import React from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    if (!user) {
        navigate("/");
        return null;
    }

    return (
        <div style={styles.page}>

            {/* Header */}
            <header style={styles.header}>

                <div>
                    <h1 style={styles.logo}>
                        Online Complaint Management
                    </h1>

                    <p style={styles.subtitle}>
                        User Portal
                    </p>
                </div>

                <button
                    style={styles.logoutButton}
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* Main Content */}
            <main style={styles.container}>

                {/* Welcome Section */}
                <section style={styles.welcomeCard}>

                    <div>
                        <h2 style={styles.welcomeTitle}>
                            Welcome, {user.name}! 👋
                        </h2>

                        <p style={styles.welcomeText}>
                            Manage your complaints and track their progress
                            easily from your dashboard.
                        </p>
                    </div>

                    <div style={styles.userBadge}>
                        USER
                    </div>

                </section>


                {/* User Information */}
                <section style={styles.infoCard}>

                    <h3 style={styles.sectionTitle}>
                        Your Account
                    </h3>

                    <div style={styles.infoGrid}>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Name
                            </span>

                            <strong>
                                {user.name}
                            </strong>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Email
                            </span>

                            <strong>
                                {user.email}
                            </strong>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Role
                            </span>

                            <strong>
                                {user.role}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* Actions */}
                <section>

                    <h3 style={styles.sectionTitle}>
                        Complaint Management
                    </h3>

                    <div style={styles.cardGrid}>

                        {/* Submit Complaint */}
                        <div style={styles.actionCard}>

                            <div style={styles.icon}>
                                📝
                            </div>

                            <h3>
                                Submit Complaint
                            </h3>

                            <p>
                                Report a new issue or problem
                                in your college.
                            </p>

                            <button
                                style={styles.primaryButton}
                                onClick={() =>
                                    navigate("/submit-complaint")
                                }
                            >
                                Submit Complaint
                            </button>

                        </div>


                        {/* My Complaints */}
                        <div style={styles.actionCard}>

                            <div style={styles.icon}>
                                📋
                            </div>

                            <h3>
                                My Complaints
                            </h3>

                            <p>
                                View your submitted complaints
                                and track their status.
                            </p>

                            <button
                                style={styles.secondaryButton}
                                onClick={() =>
                                    navigate("/my-complaints")
                                }
                            >
                                View My Complaints
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* Footer */}
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

    logoutButton: {
        background: "white",
        color: "#1e3a8a",
        border: "none",
        padding: "10px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px"
    },

    container: {
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "0 20px"
    },

    welcomeCard: {
        background: "white",
        borderRadius: "12px",
        padding: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
        marginBottom: "25px"
    },

    welcomeTitle: {
        margin: 0,
        fontSize: "28px",
        color: "#1f2937"
    },

    welcomeText: {
        color: "#6b7280",
        marginTop: "10px"
    },

    userBadge: {
        background: "#dbeafe",
        color: "#1e40af",
        padding: "10px 18px",
        borderRadius: "20px",
        fontWeight: "bold"
    },

    infoCard: {
        background: "white",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "30px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
    },

    sectionTitle: {
        color: "#1f2937",
        marginBottom: "18px"
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
    },

    infoItem: {
        background: "#f8fafc",
        padding: "18px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    label: {
        color: "#6b7280",
        fontSize: "13px"
    },

    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "25px"
    },

    actionCard: {
        background: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
    },

    icon: {
        fontSize: "35px",
        marginBottom: "10px"
    },

    primaryButton: {
        background: "#1e3a8a",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    secondaryButton: {
        background: "#e5e7eb",
        color: "#1f2937",
        border: "none",
        padding: "12px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    footer: {
        textAlign: "center",
        padding: "25px",
        color: "#6b7280",
        marginTop: "30px"
    }

};

export default UserDashboard;