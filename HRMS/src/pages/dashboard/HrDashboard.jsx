import React, { useEffect, useState } from 'react'

const HrDashboard = () => {

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
        <button className="btn btn-primary">Leave Settings</button>
        <button className="btn btn-primary">Leave Recall</button>
        <button className="btn btn-warning">Leave History</button>
        <button className="btn btn-primary">Relief Officers</button>
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
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.date}</td>
                <td>{l.reason}</td>

                {/* STATUS COLOR */}
                <td>
                  <span className={
                    l.status === "approved"
                      ? "text-success"
                      : l.status === "rejected"
                      ? "text-danger"
                      : "text-warning"
                  }>
                    {l.status}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  <button
                    onClick={() => handleAction(l.id, "approved")}
                    className="btn btn-sm btn-success me-2"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(l.id, "rejected")}
                    className="btn btn-sm btn-danger"
                  >
                    Reject
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default HrDashboard