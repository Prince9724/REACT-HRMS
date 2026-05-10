import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Manager = () => {

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("dashboard")
    
    const [users, setUsers] = useState([])
    const [leaves, setLeaves] = useState([])
    const [attendance, setAttendance] = useState([])
    const [search, setSearch] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState("all")

    // Manager's own attendance
    const [checkInTime, setCheckInTime] = useState("")
    const [checkOutTime, setCheckOutTime] = useState("")

    const currentUser = JSON.parse(localStorage.getItem("user"))

    // Fetch Data
    useEffect(() => {
        fetchData()
        fetchManagerAttendance()
    }, [])

    const fetchData = async () => {
        try {
            const userRes = await axios.get("http://localhost:3000/employe")
            const leaveRes = await axios.get("http://localhost:3000/leaves")
            const attRes = await axios.get("http://localhost:3000/attendance")

            setUsers(userRes.data || [])
            setLeaves(leaveRes.data || [])
            setAttendance(attRes.data || [])
        } catch (err) {
            console.log(err)
        }
    }

    // Fetch Manager's Today Attendance
    const fetchManagerAttendance = async () => {
        if (!currentUser) return
        
        const today = new Date().toLocaleDateString()
        try {
            const res = await axios.get("http://localhost:3000/attendance")
            const todayData = res.data.find(
                a => a.userId === currentUser.id && a.date === today
            )
            if (todayData) {
                setCheckInTime(todayData.checkIn || "")
                setCheckOutTime(todayData.checkOut || "")
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Manager Check In
    const handleCheckIn = async () => {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        const today = new Date().toLocaleDateString()

        try {
            const res = await axios.get("http://localhost:3000/attendance")
            const already = res.data.find(a => a.userId === currentUser.id && a.date === today)

            if (already) {
                alert("Already checked in today!")
                return
            }

            await axios.post("http://localhost:3000/attendance", {
                userId: currentUser.id,
                name: currentUser.firstName,
                contact: currentUser.contact,
                department: currentUser.department,
                salary: currentUser.salary,
                date: today,
                checkIn: time,
                checkOut: ""
            })

            setCheckInTime(time)
            alert("Checked In Successfully!")
            fetchManagerAttendance()
        } catch (err) {
            console.log(err)
            alert("Error checking in")
        }
    }

    // Manager Check Out
    const handleCheckOut = async () => {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        const today = new Date().toLocaleDateString()

        try {
            const res = await axios.get("http://localhost:3000/attendance")
            const record = res.data.find(a => a.userId === currentUser.id && a.date === today)

            if (!record) {
                alert("Please check in first!")
                return
            }

            if (record.checkOut) {
                alert("Already checked out!")
                return
            }

            await axios.patch(`http://localhost:3000/attendance/${record.id}`, {
                checkOut: time
            })

            setCheckOutTime(time)
            alert("Checked Out Successfully!")
            fetchManagerAttendance()
        } catch (err) {
            console.log(err)
            alert("Error checking out")
        }
    }

    // Stats
    const totalEmployees = users.filter(u => u.role === "employee").length
    const pendingLeaves = leaves.filter(l => l.status === "pending").length
    const approvedLeaves = leaves.filter(l => l.status === "approved").length

    // Today's attendance
    const today = new Date().toLocaleDateString()
    const todayAttendance = attendance.filter(a => a.date === today)
    const presentToday = todayAttendance.filter(a => a.checkIn && a.checkIn !== "").length

    // Filter Employees
    const filteredEmployees = users.filter(u => {
        const matchRole = u.role === "employee"
        const matchSearch = (u.firstName + " " + (u.lastName || "")).toLowerCase().includes(search.toLowerCase())
        const matchDept = departmentFilter === "all" || u.department === departmentFilter
        return matchRole && matchSearch && matchDept
    })

    // Get unique departments
    const departments = [...new Set(users.map(u => u.department).filter(d => d))]

    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
            
            {/* Top Bar */}
            <div style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)", padding: "15px 20px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>🏢 XCELTECH HRMS - Manager Panel</h3>
                <div>
                    <span style={{ marginRight: 15 }}>👋 Welcome, <strong>{currentUser?.firstName}</strong></span>
                    <button 
                        style={{ padding: "5px 15px", background: "transparent", border: "1px solid white", color: "white", borderRadius: 5, cursor: "pointer" }}
                        onClick={() => {
                            localStorage.removeItem("user")
                            navigate("/")
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: "flex" }}>
                
                {/* Sidebar */}
                <div style={{ width: 280, background: "white", minHeight: "calc(100vh - 60px)", borderRight: "1px solid #ddd", padding: 20 }}>
                    
                    {/* Profile */}
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${currentUser?.firstName}&background=1e3c72&color=fff&rounded=true&size=80`} 
                            alt="Profile"
                            style={{ width: 70, height: 70, borderRadius: "50%", marginBottom: 10 }}
                        />
                        <h5 style={{ margin: 0 }}>{currentUser?.firstName}</h5>
                        <small style={{ color: "#666" }}>Manager</small>
                    </div>

                    <hr />

                    {/* Manager's Attendance Card */}
                    <div style={{ background: "#f8f9fa", padding: 15, borderRadius: 10, marginBottom: 20 }}>
                        <h6 style={{ margin: "0 0 10px 0" }}>📅 My Attendance</h6>
                        <p style={{ margin: "5px 0" }}>✅ Check In: <strong>{checkInTime || "--"}</strong></p>
                        <p style={{ margin: "5px 0 10px 0" }}>❌ Check Out: <strong>{checkOutTime || "--"}</strong></p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button 
                                style={{ flex: 1, padding: "8px", background: checkInTime ? "#ccc" : "#28a745", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}
                                onClick={handleCheckIn}
                                disabled={checkInTime}
                            >
                                Check In
                            </button>
                            <button 
                                style={{ flex: 1, padding: "8px", background: (!checkInTime || checkOutTime) ? "#ccc" : "#dc3545", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}
                                onClick={handleCheckOut}
                                disabled={!checkInTime || checkOutTime}
                            >
                                Check Out
                            </button>
                        </div>
                    </div>

                    <hr />

                    {/* Navigation */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button 
                            style={{ padding: "10px", textAlign: "left", background: activeTab === "dashboard" ? "#007bff" : "transparent", color: activeTab === "dashboard" ? "white" : "#333", border: "none", borderRadius: 8, cursor: "pointer" }}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            📊 Dashboard
                        </button>
                        <button 
                            style={{ padding: "10px", textAlign: "left", background: activeTab === "employees" ? "#007bff" : "transparent", color: activeTab === "employees" ? "white" : "#333", border: "none", borderRadius: 8, cursor: "pointer" }}
                            onClick={() => setActiveTab("employees")}
                        >
                            👥 Employees
                        </button>
                        <button 
                            style={{ padding: "10px", textAlign: "left", background: activeTab === "attendance" ? "#007bff" : "transparent", color: activeTab === "attendance" ? "white" : "#333", border: "none", borderRadius: 8, cursor: "pointer" }}
                            onClick={() => setActiveTab("attendance")}
                        >
                            📅 Attendance
                        </button>
                        <button 
                            style={{ padding: "10px", textAlign: "left", background: activeTab === "leaves" ? "#007bff" : "transparent", color: activeTab === "leaves" ? "white" : "#333", border: "none", borderRadius: 8, cursor: "pointer" }}
                            onClick={() => setActiveTab("leaves")}
                        >
                            📋 Leave Requests
                        </button>
                    </div>

                    <hr style={{ margin: "20px 0" }} />
                    
                    <button 
                        style={{ width: "100%", padding: "10px", background: "#6c757d", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, padding: 20, overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}>
                    
                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && (
                        <>
                            {/* Welcome Banner */}
                            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: 20, borderRadius: 10, color: "white", marginBottom: 20 }}>
                                <h4>Welcome back, {currentUser?.firstName}!</h4>
                                <p style={{ margin: 0, opacity: 0.8 }}>Here's what's happening in your team today.</p>
                            </div>

                            {/* Stats Cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 15, marginBottom: 20 }}>
                                <div style={{ background: "white", padding: 20, borderRadius: 10, textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                    <h2 style={{ margin: 0, color: "#007bff" }}>{totalEmployees}</h2>
                                    <small>Total Employees</small>
                                </div>
                                <div style={{ background: "white", padding: 20, borderRadius: 10, textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                    <h2 style={{ margin: 0, color: "#28a745" }}>{presentToday}</h2>
                                    <small>Present Today</small>
                                </div>
                                <div style={{ background: "white", padding: 20, borderRadius: 10, textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                    <h2 style={{ margin: 0, color: "#ffc107" }}>{pendingLeaves}</h2>
                                    <small>Pending Leaves</small>
                                </div>
                                <div style={{ background: "white", padding: 20, borderRadius: 10, textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                    <h2 style={{ margin: 0, color: "#17a2b8" }}>{approvedLeaves}</h2>
                                    <small>Approved Leaves</small>
                                </div>
                            </div>

                            {/* Recent Leaves */}
                            <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                <h5>📋 Recent Leave Requests</h5>
                                <hr />
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                            <th style={{ padding: 10 }}>Name</th>
                                            <th style={{ padding: 10 }}>Type</th>
                                            <th style={{ padding: 10 }}>Period</th>
                                            <th style={{ padding: 10 }}>Days</th>
                                            <th style={{ padding: 10 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.slice(0, 5).map(l => (
                                            <tr key={l.id} style={{ borderBottom: "1px solid #ddd" }}>
                                                <td style={{ padding: 10 }}><strong>{l.name}</strong></td>
                                                <td style={{ padding: 10 }}>
                                                    <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 12, background: l.type === "free" ? "#28a745" : "#ffc107", color: l.type === "free" ? "white" : "black" }}>
                                                        {l.type === "free" ? "🎁 Free" : "💰 Paid"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: 10 }}>{l.start} to {l.end}</td>
                                                <td style={{ padding: 10 }}>{l.days}</td>
                                                <td style={{ padding: 10 }}>
                                                    <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 12, background: l.status === "approved" ? "#28a745" : l.status === "rejected" ? "#dc3545" : "#ffc107", color: "white" }}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {leaves.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>No leave requests</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Employees Tab */}
                    {activeTab === "employees" && (
                        <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                                <h5 style={{ margin: 0 }}>👥 All Employees</h5>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <input 
                                        type="text" 
                                        placeholder="Search by name..." 
                                        style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 5, width: 200 }}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <select 
                                        style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 5 }}
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                    >
                                        <option value="all">All Departments</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                        <th style={{ padding: 10 }}>ID</th>
                                        <th style={{ padding: 10 }}>Name</th>
                                        <th style={{ padding: 10 }}>Email</th>
                                        <th style={{ padding: 10 }}>Department</th>
                                        <th style={{ padding: 10 }}>Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map(u => (
                                        <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                                            <td style={{ padding: 10 }}>{u.id}</td>
                                            <td style={{ padding: 10 }}><strong>{u.firstName} {u.lastName || ""}</strong></td>
                                            <td style={{ padding: 10 }}>{u.email}</td>
                                            <td style={{ padding: 10 }}>{u.department || "N/A"}</td>
                                            <td style={{ padding: 10 }}>₹ {u.salary?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {filteredEmployees.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>No employees found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === "attendance" && (
                        <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <h5>📅 Today's Attendance</h5>
                            <hr />
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                        <th style={{ padding: 10 }}>Employee</th>
                                        <th style={{ padding: 10 }}>Department</th>
                                        <th style={{ padding: 10 }}>Check In</th>
                                        <th style={{ padding: 10 }}>Check Out</th>
                                        <th style={{ padding: 10 }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayAttendance.map(a => (
                                        <tr key={a.id} style={{ borderBottom: "1px solid #ddd" }}>
                                            <td style={{ padding: 10 }}><strong>{a.name}</strong></td>
                                            <td style={{ padding: 10 }}>{a.department}</td>
                                            <td style={{ padding: 10 }}>{a.checkIn || "--"}</td>
                                            <td style={{ padding: 10 }}>{a.checkOut || "--"}</td>
                                            <td style={{ padding: 10 }}>
                                                <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 12, background: a.checkIn ? "#28a745" : "#dc3545", color: "white" }}>
                                                    {a.checkIn ? "Present" : "Absent"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {todayAttendance.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>No attendance records for today</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Leaves Tab */}
                    {activeTab === "leaves" && (
                        <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                <h5 style={{ margin: 0 }}>📋 All Leave Requests</h5>
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 5, width: 200 }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                                        <th style={{ padding: 10 }}>Employee</th>
                                        <th style={{ padding: 10 }}>Type</th>
                                        <th style={{ padding: 10 }}>Reason</th>
                                        <th style={{ padding: 10 }}>Period</th>
                                        <th style={{ padding: 10 }}>Days</th>
                                        <th style={{ padding: 10 }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.filter(l => l.name?.toLowerCase().includes(search.toLowerCase())).map(l => (
                                        <tr key={l.id} style={{ borderBottom: "1px solid #ddd" }}>
                                            <td style={{ padding: 10 }}><strong>{l.name}</strong></td>
                                            <td style={{ padding: 10 }}>
                                                <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 12, background: l.type === "free" ? "#28a745" : "#ffc107", color: l.type === "free" ? "white" : "black" }}>
                                                    {l.type === "free" ? "🎁 Free" : "💰 Paid"}
                                                </span>
                                            </td>
                                            <td style={{ padding: 10 }}>{l.reason || "No reason"}</td>
                                            <td style={{ padding: 10 }}>{l.start} to {l.end}</td>
                                            <td style={{ padding: 10, textAlign: "center" }}>{l.days}</td>
                                            <td style={{ padding: 10 }}>
                                                <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 12, background: l.status === "approved" ? "#28a745" : l.status === "rejected" ? "#dc3545" : "#ffc107", color: "white" }}>
                                                    {l.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {leaves.filter(l => l.name?.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ padding: 20, textAlign: "center" }}>No leave requests found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Manager