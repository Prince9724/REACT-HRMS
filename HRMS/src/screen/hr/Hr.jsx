import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

const Hr = () => {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [leaves, setLeaves] = useState([])
    const [search, setSearch] = useState("")

    // Fetch Data
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const userRes = await axios.get("http://localhost:3000/employe")
            const leaveRes = await axios.get("http://localhost:3000/leaves")

            setUsers(userRes.data || [])
            setLeaves(leaveRes.data || [])
        } catch (err) {
            console.log(err)
        }
    }

    // Stats
    const totalEmployees = users.length
    const pending = leaves.filter(l => l.status === "pending").length
    const approved = leaves.filter(l => l.status === "approved").length

    // Search Filter
    const filteredLeaves = leaves.filter(l => {
        const searchText = search.toLowerCase()
        return (
            l.name?.toLowerCase().includes(searchText) ||
            l.type?.toLowerCase().includes(searchText) ||
            l.status?.toLowerCase().includes(searchText)
        )
    })

    // ==================== UI STARTS HERE ====================

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>

            {/* ========== SIDEBAR ========== */}
            <div style={{
                width: "280px",
                backgroundColor: "white",
                borderRight: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                padding: "20px"
            }}>
                
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #e0e0e0" }}>
                    <h2 style={{ color: "#1e3c72", margin: 0 }}>XCELTECH</h2>
                </div>

                {/* Profile */}
                <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #e0e0e0" }}>
                    <img 
                        src="https://i.pravatar.cc/80" 
                        alt="profile"
                        style={{ width: "70px", height: "70px", borderRadius: "50%", marginBottom: "10px" }}
                    />
                    <h4 style={{ margin: "5px 0", fontSize: "18px" }}>HR Panel</h4>
                    <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>Administrator</p>
                </div>

                {/* Navigation Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                        onClick={() => navigate("/hr")}
                        style={{
                            padding: "10px 15px",
                            textAlign: "left",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/user")}
                        style={{
                            padding: "10px 15px",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            color: "#333",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        👥 Employees
                    </button>

                    <button
                        onClick={() => navigate("/attendance")}
                        style={{
                            padding: "10px 15px",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            color: "#333",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        📅 Attendance
                    </button>

                    <button
                        onClick={() => navigate("/hrdashboard")}
                        style={{
                            padding: "10px 15px",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            color: "#333",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        📋 Leave
                    </button>

                    <button
                        onClick={() => navigate("/payroll")}
                        style={{
                            padding: "10px 15px",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            color: "#333",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        💰 Payroll
                    </button>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "auto"
            }}>

                {/* Top Bar */}
                <div style={{
                    backgroundColor: "white",
                    padding: "15px 20px",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            width: "300px"
                        }}
                    />
                    <button
                        onClick={() => navigate("/add")}
                        style={{
                            padding: "8px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        + Add Employee
                    </button>
                </div>

                {/* Content Area */}
                <div style={{ padding: "20px" }}>

                    {/* Stats Cards */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px",
                        marginBottom: "30px"
                    }}>
                        {/* Card 1 */}
                        <div style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>
                            <h2 style={{ margin: 0, color: "#007bff" }}>{totalEmployees}</h2>
                            <p style={{ margin: "5px 0 0", color: "#666" }}>Total Employees</p>
                        </div>

                        {/* Card 2 */}
                        <div style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>
                            <h2 style={{ margin: 0, color: "#ffc107" }}>{pending}</h2>
                            <p style={{ margin: "5px 0 0", color: "#666" }}>Pending Requests</p>
                        </div>

                        {/* Card 3 */}
                        <div style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>
                            <h2 style={{ margin: 0, color: "#28a745" }}>{approved}</h2>
                            <p style={{ margin: "5px 0 0", color: "#666" }}>Approved</p>
                        </div>
                    </div>

                    {/* Leave Requests Table */}
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            padding: "15px 20px",
                            borderBottom: "1px solid #e0e0e0"
                        }}>
                            <h3 style={{ margin: 0 }}>Leave Requests</h3>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}>
                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                    <tr>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Name</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Days</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Start</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>End</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Type</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeaves.length > 0 ? (
                                        filteredLeaves.map(l => (
                                            <tr key={l.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                                                <td style={{ padding: "12px 15px", fontWeight: "bold" }}>{l.name}</td>
                                                <td style={{ padding: "12px 15px" }}>{l.days}</td>
                                                <td style={{ padding: "12px 15px" }}>{l.start}</td>
                                                <td style={{ padding: "12px 15px" }}>{l.end}</td>
                                                <td style={{ padding: "12px 15px" }}>
                                                    <span style={{
                                                        padding: "3px 8px",
                                                        borderRadius: "5px",
                                                        fontSize: "12px",
                                                        backgroundColor: l.type === "free" ? "#28a745" : "#6c757d",
                                                        color: "white"
                                                    }}>
                                                        {l.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px 15px" }}>
                                                    <span style={{
                                                        padding: "3px 8px",
                                                        borderRadius: "5px",
                                                        fontSize: "12px",
                                                        backgroundColor: l.status === "approved" ? "#28a745" : (l.status === "rejected" ? "#dc3545" : "#ffc107"),
                                                        color: "white"
                                                    }}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hr