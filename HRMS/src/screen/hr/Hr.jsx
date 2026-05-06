import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import '../hr/hr.css'

const Hr = () => {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [leaves, setLeaves] = useState([])
    const [search, setSearch] = useState("")

    // 🔥 Fetch Data
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

    // 🔥 Stats
    const totalEmployees = users.length
    const pending = leaves.filter(l => l.status === "pending").length
    const approved = leaves.filter(l => l.status === "approved").length

    // 🔥 Search Filter (Name + Type + Status)
    const filteredLeaves = leaves.filter(l => {
        const searchText = search.toLowerCase()

        return (
            l.name?.toLowerCase().includes(searchText) ||
            l.type?.toLowerCase().includes(searchText) ||
            l.status?.toLowerCase().includes(searchText)
        )
    })

    return (
        <div className="main-container overflow-y-scroll"  style={{ height: "100vh", overflowY: "auto" }}>

            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">XCELTECH</h2>

                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="" />
                    <h4>HR Panel</h4>
                </div>

                <ul>
                    <li className="active" onClick={()=> navigate("/hr")}>Dashboard</li>
                    <li onClick={()=> navigate("/user")}>Employees</li>
                    <li onClick={()=> navigate("/attendance")}>Attendance</li>
                    <li onClick={()=>navigate("/hrdashboard")}>Leave</li>
                     <li onClick={()=>navigate("/payroll")}>Payroll</li>
                </ul>
            </div>

            {/* Content */}
            <div className="content">

                {/* Topbar */}
                <div className="topbar">
                    <input 
                        type="text" 
                        placeholder="Search employee..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button onClick={() => navigate("/add")} className="add-btn">
                        + Add Employee
                    </button>
                </div>

                {/* Cards */}
                <div className="cards">
                    <div className="card">
                        <h3>Total Employees</h3>
                        <p>{totalEmployees}</p>
                    </div>

                    <div className="card">
                        <h3>Pending Requests</h3>
                        <p>{pending}</p>
                    </div>

                    <div className="card">
                        <h3>Approved</h3>
                        <p>{approved}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="table-box">
                    <div className="table-header">
                        <h3>Leave Requests</h3>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Days</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLeaves.length > 0 ? (
                                filteredLeaves.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.name}</td>
                                        <td>{l.days}</td>
                                        <td>{l.start}</td>
                                        <td>{l.end}</td>
                                        <td>{l.type}</td>
                                        <td>{l.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No Data Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Hr