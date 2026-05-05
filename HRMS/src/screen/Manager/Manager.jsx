import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import '../hr/hr.css'

const Manager = () => {

    const navigate = useNavigate()

    const [leaves, setLeaves] = useState([])
    const [users, setUsers] = useState([])

    const currentUser = JSON.parse(localStorage.getItem("user"))

    // 🔥 Fetch Data
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const userRes = await axios.get("http://localhost:3000/employe")
        const leaveRes = await axios.get("http://localhost:3000/leaves")

        setUsers(userRes.data)
        setLeaves(leaveRes.data)
    }

    // 🔥 Stats
    const totalEmployees = users.length
    const pending = leaves.filter(l => l.status === "pending").length
    const approved = leaves.filter(l => l.status === "approved").length
    const rejected = leaves.filter(l => l.status === "rejected").length

    return (
        <div className="main-container">

            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">XCELTECH</h2>

                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="" />
                    <h4>{currentUser?.firstName}</h4>
                    <p>Manager Panel</p>
                </div>

                <ul>
                    <li className="active">Dashboard</li>
                    <li onClick={()=> navigate("/user")}>Employees</li>
                    <li>Attendance</li>
                    <li>Leave</li>
                </ul>
            </div>

            {/* Content */}
            <div className="content">

                {/* Topbar */}
                <div className="topbar">
                    <input type="text" placeholder="Search employee..." />
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

                    <div className="card">
                        <h3>Rejected</h3>
                        <p>{rejected}</p>
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
                            {leaves.map(l => (
                                <tr key={l.id}>
                                    <td>{l.name}</td>
                                    <td>{l.days}</td>
                                    <td>{l.start}</td>
                                    <td>{l.end}</td>
                                    <td>{l.type}</td>
                                    <td>{l.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Manager