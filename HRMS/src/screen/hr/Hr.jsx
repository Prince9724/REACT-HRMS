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
        <div
            className="d-flex"
            style={{
                minHeight: "100vh",
                background: "#f1f5f9"
            }}
        >

            {/* ================= SIDEBAR ================= */}

            <div
                className="d-flex flex-column flex-shrink-0 p-4 text-white shadow-lg"
                style={{
                    width: "280px",
                    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
                }}
            >

                {/* LOGO */}

                <div className="text-center mb-4 pb-4 border-bottom border-secondary">
                    <h2 className="fw-bold mb-1">
                        XCELTECH
                    </h2>
                    <small className="text-light opacity-75">
                        HR Management System
                    </small>
                </div>

                {/* PROFILE */}

                <div className="card border-0 rounded-4 shadow mb-4">

                    <div className="card-body text-center p-4">

                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="profile"
                            className="rounded-circle shadow border border-4 border-white mb-3"
                            style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover"
                            }}
                        />

                        <h5 className="fw-bold mb-1">
                            HR Panel
                        </h5>

                        <p className="text-muted mb-0 small">
                            Administrator
                        </p>

                    </div>

                </div>

                {/* NAVIGATION */}

                <div className="d-flex flex-column gap-2">

                    <button
                        onClick={() => navigate("/hr")}
                        className="btn btn-primary text-start rounded-3 py-3 fw-semibold shadow-sm"
                    >
                        <i className="bi bi-grid-fill me-2"></i>
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/user")}
                        className="btn btn-light text-start rounded-3 py-3 fw-semibold"
                    >
                        <i className="bi bi-people-fill me-2"></i>
                        Employees
                    </button>

                    <button
                        onClick={() => navigate("/attendance")}
                        className="btn btn-light text-start rounded-3 py-3 fw-semibold"
                    >
                        <i className="bi bi-calendar-check-fill me-2"></i>
                        Attendance
                    </button>

                    <button
                        onClick={() => navigate("/hrdashboard")}
                        className="btn btn-light text-start rounded-3 py-3 fw-semibold"
                    >
                        <i className="bi bi-file-earmark-text-fill me-2"></i>
                        Leave Requests
                    </button>

                    <button
                        onClick={() => navigate("/payroll")}
                        className="btn btn-light text-start rounded-3 py-3 fw-semibold"
                    >
                        <i className="bi bi-cash-stack me-2"></i>
                        Payroll
                    </button>

                </div>

                {/* BACK BUTTON */}

                <div className="mt-auto pt-4">

                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-outline-light w-100 rounded-3 py-3 fw-semibold"
                    >
                        <i className="bi bi-arrow-left-circle me-2"></i>
                        Logout 
                    </button>

                </div>

            </div>

            {/* ================= MAIN CONTENT ================= */}

            <div className="flex-grow-1 overflow-auto">

                {/* TOP BAR */}

                <div
                    className="bg-white shadow-sm border-bottom px-4 py-3"
                >

                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">

                        <div>

                            <h2 className="fw-bold mb-1 text-dark">
                                HR Dashboard
                            </h2>

                            <p className="text-muted mb-0">
                                Welcome back! Manage employees, attendance & payroll.
                            </p>

                        </div>

                        <div className="d-flex flex-column flex-md-row gap-3">

                            <div className="position-relative">

                                <i
                                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                ></i>

                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control rounded-3 ps-5 shadow-sm"
                                    style={{
                                        minWidth: "280px"
                                    }}
                                />

                            </div>

                            <button
                                onClick={() => navigate("/add")}
                                className="btn btn-primary rounded-3 px-4 shadow-sm fw-semibold"
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Add Employee
                            </button>

                        </div>

                    </div>

                </div>

                {/* PAGE CONTENT */}

                <div className="p-4">

                    {/* KPI CARDS */}

                    <div className="row g-4 mb-4">

                        {/* TOTAL EMPLOYEE */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow rounded-4 h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2 fw-semibold">
                                                Total Employees
                                            </p>

                                            <h1 className="fw-bold text-primary mb-0">
                                                {totalEmployees}
                                            </h1>

                                        </div>

                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                background: "rgba(13,110,253,0.1)"
                                            }}
                                        >
                                            <i className="bi bi-people-fill text-primary fs-2"></i>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* PENDING */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow rounded-4 h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2 fw-semibold">
                                                Pending Requests
                                            </p>

                                            <h1 className="fw-bold text-warning mb-0">
                                                {pending}
                                            </h1>

                                        </div>

                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                background: "rgba(255,193,7,0.15)"
                                            }}
                                        >
                                            <i className="bi bi-hourglass-split text-warning fs-2"></i>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* APPROVED */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow rounded-4 h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2 fw-semibold">
                                                Approved Leaves
                                            </p>

                                            <h1 className="fw-bold text-success mb-0">
                                                {approved}
                                            </h1>

                                        </div>

                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                background: "rgba(25,135,84,0.12)"
                                            }}
                                        >
                                            <i className="bi bi-check-circle-fill text-success fs-2"></i>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* TABLE SECTION */}

                    <div className="card border-0 shadow rounded-4 overflow-hidden">

                        {/* HEADER */}

                        <div
                            className="px-4 py-3 border-bottom bg-white"
                        >

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                                <div>

                                    <h4 className="fw-bold mb-1">
                                        Leave Requests
                                    </h4>

                                    <p className="text-muted mb-0">
                                        Employee leave request management
                                    </p>

                                </div>

                                <span className="badge bg-primary rounded-pill px-3 py-2">
                                    {filteredLeaves.length} Records
                                </span>

                            </div>

                        </div>

                        {/* TABLE */}

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead
                                    className="table-light"
                                >

                                    <tr>

                                        <th className="px-4 py-3 fw-bold">
                                            Employee
                                        </th>

                                        <th className="px-4 py-3 fw-bold">
                                            Days
                                        </th>

                                        <th className="px-4 py-3 fw-bold">
                                            Start Date
                                        </th>

                                        <th className="px-4 py-3 fw-bold">
                                            End Date
                                        </th>

                                        <th className="px-4 py-3 fw-bold">
                                            Leave Type
                                        </th>

                                        <th className="px-4 py-3 fw-bold">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        filteredLeaves.length > 0 ? (

                                            filteredLeaves.map(l => (

                                                <tr key={l.id}>

                                                    <td className="px-4 py-3">

                                                        <div className="d-flex align-items-center gap-3">

                                                            <img
                                                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                                                alt="employee"
                                                                className="rounded-circle"
                                                                style={{
                                                                    width: "45px",
                                                                    height: "45px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />

                                                            <div>

                                                                <h6 className="mb-0 fw-bold">
                                                                    {l.name}
                                                                </h6>

                                                                <small className="text-muted">
                                                                    Employee
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-3 fw-semibold">
                                                        {l.days}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {l.start}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {l.end}
                                                    </td>

                                                    <td className="px-4 py-3">

                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${l.type === "free"
                                                                    ? "bg-success-subtle text-success"
                                                                    : "bg-secondary-subtle text-secondary"
                                                                }`}
                                                        >
                                                            {l.type}
                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-3">

                                                        <span
                                                            className={`badge rounded-pill px-3 py-2 ${l.status === "approved"
                                                                    ? "bg-success"
                                                                    : l.status === "rejected"
                                                                        ? "bg-danger"
                                                                        : "bg-warning text-dark"
                                                                }`}
                                                        >
                                                            {l.status}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="text-center py-5 text-muted fw-semibold"
                                                >

                                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>

                                                    No Leave Requests Found

                                                </td>

                                            </tr>

                                        )
                                    }

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