import React from 'react'
import { useNavigate } from 'react-router'
import '../hr/hr.css'

const Hr = () => {

    const navigate = useNavigate()

    return (
        <div className="main-container">

            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">XCELTECH</h2>

                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="" />
                    <h4>Aman Admin</h4>
                    <p>HR Panel</p>
                </div>

                <ul>
                    <li className="active" onClick={()=>navigate("/hrdashboard")}>Dashboard</li>
                    <li onClick={()=> navigate("/user")}>Employees</li>
                    <li>Attendance</li>
                    <li>Leave</li>
                    <li>Payroll</li>
                    <li>Performance</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="content">

                {/* Topbar */}
                <div className="topbar">
                    <input type="text" placeholder="Search employee..." />

                    <div className="icons">
                        <button onClick={() => navigate("/add")} className="add-btn">
                            + Add Employee
                        </button>
                        <span>🔔</span>
                        <span>⚙️</span>
                    </div>
                </div>

                {/* 🔥 Dashboard Cards */}
                <div className="cards">
                    <div className="card">
                        <h3>Total Employees</h3>
                        <p>120</p>
                    </div>

                    <div className="card">
                        <h3>On Leave</h3>
                        <p>8</p>
                    </div>

                    <div className="card">
                        <h3>New Joinees</h3>
                        <p>5</p>
                    </div>

                    <div className="card">
                        <h3>Pending Requests</h3>
                        <p>3</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-box">
                    <div className="table-header">
                        <h3>Leave Requests</h3>
                        <button className="export">Export</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Days</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Aman</td>
                                <td>5</td>
                                <td>22/04/22</td>
                                <td>28/04/22</td>
                                <td>Sick</td>
                                <td>Personal</td>
                                <td><span className="pending">Pending</span></td>
                                <td>
                                    <button className="approve">Approve</button>
                                    <button className="reject">Reject</button>
                                </td>
                            </tr>

                            <tr>
                                <td>Rahul</td>
                                <td>7</td>
                                <td>22/04/22</td>
                                <td>30/04/22</td>
                                <td>Exam</td>
                                <td>Study</td>
                                <td><span className="approved">Approved</span></td>
                                <td>-</td>
                            </tr>

                            <tr>
                                <td>Neha</td>
                                <td>10</td>
                                <td>22/04/22</td>
                                <td>02/05/22</td>
                                <td>Maternity</td>
                                <td>Family</td>
                                <td><span className="rejected">Rejected</span></td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Hr