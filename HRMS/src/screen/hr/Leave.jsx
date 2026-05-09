import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const HrDashboard = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([])

  // ✅ FETCH DATA
  useEffect(() => {
    fetch("http://localhost:3000/leaves")
      .then(res => res.json())
      .then(data => setLeaves(data))
  }, [])

  // ✅ APPROVE / REJECT
  const handleAction = async (id, status) => {

    await fetch(`http://localhost:3000/leaves/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    })

    // UI update
    setLeaves(prev =>
      prev.map(l => l.id === id ? { ...l, status } : l)
    )
  }

  // ✅ EXPORT DATA
  const handleExport = () => {
    const dataStr = JSON.stringify(leaves, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "leave-data.json"
    a.click()
  }

  return (
    <div className="container mt-4">

      {/* TOP BUTTONS */}
      <div className="d-flex gap-3 mb-3">
        <button className="btn btn-warning">Leave History</button>
        <button className="btn btn-primary" onClick={() => navigate("/hr")}>Back to Home Page</button>
      </div>

      {/* CARD */}
      <div className="card p-4 shadow-sm">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Leave History</h3>
          <button onClick={handleExport} className="btn btn-success">
            Export
          </button>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>No. of Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>
                      <strong>{l.name}</strong>
                      <br />
                      <small className="text-muted">ID: {l.userId}</small>
                    </td>
                    
                    {/* 🔥 LEAVE TYPE WITH BADGE */}
                    <td>
                      {l.type === "free" ? (
                        <span className="badge bg-success">🎁 Free Leave</span>
                      ) : l.type === "paid" ? (
                        <span className="badge bg-warning text-dark">💰 Paid Leave</span>
                      ) : (
                        <span className="badge bg-secondary">Other</span>
                      )}
                    </td>
                    
                    <td>{l.start || "N/A"}</td>
                    <td>{l.end || "N/A"}</td>
                    <td className="text-center">
                      <span className="badge bg-info">{l.days || 1}</span>
                    </td>
                    
                    <td>{l.reason || "No reason provided"}</td>

                    {/* 🔥 STATUS COLOR */}
                    <td>
                      {l.status === "approved" ? (
                        <span className="badge bg-success">✅ Approved</span>
                      ) : l.status === "rejected" ? (
                        <span className="badge bg-danger">❌ Rejected</span>
                      ) : (
                        <span className="badge bg-warning text-dark">⏳ Pending</span>
                      )}
                    </td>

                    {/* 🔥 ACTION BUTTONS */}
                    <td>
                      {l.status === "pending" ? (
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleAction(l.id, "approved")}
                            className="btn btn-sm btn-success"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleAction(l.id, "rejected")}
                            className="btn btn-sm btn-danger"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📊 SUMMARY CARD */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card bg-success text-white p-3">
              <h5>✅ Approved</h5>
              <h3>{leaves.filter(l => l.status === "approved").length}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark p-3">
              <h5>⏳ Pending</h5>
              <h3>{leaves.filter(l => l.status === "pending").length}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-danger text-white p-3">
              <h5>❌ Rejected</h5>
              <h3>{leaves.filter(l => l.status === "rejected").length}</h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HrDashboard