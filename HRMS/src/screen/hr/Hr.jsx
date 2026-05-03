import React from 'react'
import { useNavigate } from 'react-router'
import '../hr/hr.css'

const Hr = () => {

    const navigate = useNavigate()

    return (
        <div style={{ height: "100vh" }} className="main-container">

            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">XCELTECH</h2>

                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="" />
                    <h4>Aman Admin</h4>
                    <p>Admin</p>
                </div>

                <ul>
                    <li className="active">Dashboard</li>
                    <li>Messages</li>
                    <li>Jobs</li>
                    <li><button>Candidates</button></li>
                    <li>Employee Management</li>
                    <li>Leave Management</li>
                    <li>Performance</li>
                    <li>Payroll</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="content">

                {/* Topbar */}
                <div className="topbar">
                    <input type="text" placeholder="Search..." />
                    <div className="icons">
                        <span>
                            <button onClick={() => navigate("/add")}>Add member</button>
                        </span>
                        <span>🔔</span>
                        <span>⚙️</span>
                        <span>✉️</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="buttons">
                    <button>Leave Settings</button>
                    <button>Leave Recall</button>
                    <button className="active-btn">Leave History</button>
                    <button>Relief Officers</button>
                </div>

                {/* Table */}
                <div className="table-box">
                    <div className="table-header">
                        <h3>Leave History</h3>
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
                                <td><button className="action">Actions</button></td>
                            </tr>

                            <tr>
                                <td>Rahul</td>
                                <td>7</td>
                                <td>22/04/22</td>
                                <td>30/04/22</td>
                                <td>Exam</td>
                                <td>Study</td>
                                <td><button className="action">Actions</button></td>
                            </tr>

                            <tr>
                                <td>Neha</td>
                                <td>10</td>
                                <td>22/04/22</td>
                                <td>02/05/22</td>
                                <td>Maternity</td>
                                <td>Family</td>
                                <td><button className="action">Actions</button></td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    )
}

export default Hr