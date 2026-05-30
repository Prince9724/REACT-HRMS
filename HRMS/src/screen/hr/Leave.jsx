import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"

const HrDashboard = () => {

  const navigate = useNavigate()

  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:3000/leaves")
      const data = await res.json()
      setLeaves(data.reverse())
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, status) => {
    try {
      await fetch(`http://localhost:3000/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      setLeaves(prev =>
        prev.map(l =>
          l.id === id ? { ...l, status } : l
        )
      )

    } catch (err) {
      console.log(err)
    }
  }

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {

      const matchSearch =
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(l.userId).includes(search)

      const matchStatus =
        statusFilter === "all" ? true : l.status === statusFilter

      const month = l.start?.slice(0, 7)
      const matchMonth = month === selectedMonth

      return matchSearch && matchStatus && matchMonth
    })
  }, [leaves, search, statusFilter, selectedMonth])

  const approved = filteredLeaves.filter(l => l.status === "approved").length
  const pending = filteredLeaves.filter(l => l.status === "pending").length
  const rejected = filteredLeaves.filter(l => l.status === "rejected").length
  const total = filteredLeaves.length

  const exportData = () => {
    const blob = new Blob([JSON.stringify(filteredLeaves, null, 2)], {
      type: "application/json"
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leave-data.json"
    a.click()
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

        <div>
          <h2 className="fw-bold text-primary">
            HR Leave Dashboard
          </h2>
          <p className="text-muted">
            Manage employee leave requests
          </p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={exportData}>
            <i className="fa-solid fa-file-export me-2"></i>
            Export
          </button>

          <button className="btn btn-dark" onClick={() => navigate("/hr")}>
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back
          </button>
        </div>

      </div>

      {/* CARDS */}
      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center border-0">
            <i className="fa-solid fa-users text-primary fs-4"></i>
            <h6>Total</h6>
            <h3 className="text-primary">{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center border-0">
            <i className="fa-solid fa-circle-check text-success fs-4"></i>
            <h6>Approved</h6>
            <h3 className="text-success">{approved}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center border-0">
            <i className="fa-solid fa-clock text-warning fs-4"></i>
            <h6>Pending</h6>
            <h3 className="text-warning">{pending}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center border-0">
            <i className="fa-solid fa-circle-xmark text-danger fs-4"></i>
            <h6>Rejected</h6>
            <h3 className="text-danger">{rejected}</h3>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="card p-3 shadow-sm mb-4 border-0">

        <div className="row g-3">

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="month"
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">

        <div className="table-responsive" style={{ maxHeight: "600px" }}>

          <table className="table table-hover align-middle">

            {/* HEADER */}
            <thead className="table-dark sticky-top">
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No Data Found
                  </td>
                </tr>
              ) : (

                filteredLeaves.map((l) => (
                  <tr key={l.id}>

                    <td>#{l.id}</td>

                    <td>
                      <b>{l.name}</b>
                      <div className="text-muted small">ID: {l.userId}</div>
                    </td>

                    <td>
                      <span className={`badge ${l.type === "free" ? "bg-success" : "bg-warning text-dark"}`}>
                        {l.type}
                      </span>
                    </td>

                    <td>{l.start}</td>

                    <td>{l.end}</td>

                    <td>
                      <span className="badge bg-info text-dark">
                        {l.days}
                      </span>
                    </td>

                    <td style={{ minWidth: "200px" }}>
                      {l.reason || "No Reason"}
                    </td>

                    <td>
                      <span className={`badge ${l.status === "approved"
                          ? "bg-success"
                          : l.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}>
                        {l.status}
                      </span>
                    </td>

                    <td>
                      {l.status === "pending" ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleAction(l.id, "approved")}
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleAction(l.id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">Done</span>
                      )}
                    </td>

                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default HrDashboard