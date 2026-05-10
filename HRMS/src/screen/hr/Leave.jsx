import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"

const HrDashboard = () => {

  const navigate = useNavigate()

  const [leaves, setLeaves] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("all")

  const currentMonth =
    new Date()
      .toISOString()
      .slice(0, 7)

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth)

  // 🔥 FETCH DATA
  useEffect(() => {

    fetchLeaves()

  }, [])

  const fetchLeaves = async () => {

    try {

      setLoading(true)

      const res = await fetch(
        "http://localhost:3000/leaves"
      )

      const data = await res.json()

      // 🔥 LATEST FIRST
      const sortedData =
        data.reverse()

      setLeaves(sortedData)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  // 🔥 APPROVE / REJECT
  const handleAction =
    async (id, status) => {

      try {

        await fetch(
          `http://localhost:3000/leaves/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              status
            })
          }
        )

        // 🔥 UI UPDATE
        setLeaves((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status
                }
              : l
          )
        )

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 FILTERED DATA
  const filteredLeaves =
    useMemo(() => {

      return leaves.filter((l) => {

        // 🔥 SEARCH
        const matchesSearch =

          l.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          String(l.userId)
            .includes(search)

        // 🔥 STATUS
        const matchesStatus =

          statusFilter === "all"
            ? true
            : l.status ===
              statusFilter

        // 🔥 MONTH
        const leaveMonth =
          l.start?.slice(0, 7)

        const matchesMonth =
          leaveMonth ===
          selectedMonth

        return (

          matchesSearch &&
          matchesStatus &&
          matchesMonth
        )
      })

    }, [
      leaves,
      search,
      statusFilter,
      selectedMonth
    ])

  // 🔥 SUMMARY
  const approvedCount =
    filteredLeaves.filter(
      (l) =>
        l.status === "approved"
    ).length

  const pendingCount =
    filteredLeaves.filter(
      (l) =>
        l.status === "pending"
    ).length

  const rejectedCount =
    filteredLeaves.filter(
      (l) =>
        l.status === "rejected"
    ).length

  const totalLeaves =
    filteredLeaves.length

  // 🔥 EXPORT
  const handleExport = () => {

    const dataStr =
      JSON.stringify(
        filteredLeaves,
        null,
        2
      )

    const blob =
      new Blob([dataStr], {
        type:
          "application/json"
      })

    const url =
      URL.createObjectURL(blob)

    const a =
      document.createElement("a")

    a.href = url

    a.download =
      "leave-history.json"

    a.click()
  }

  return (

    <div
      className="container-fluid py-4"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right,#eef2ff,#f8fafc)"
      }}
    >

      {/* 🔥 TOP BAR */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            HR Leave Dashboard
          </h2>

          <p className="text-muted mb-0">
            Manage Employee Leave Requests
          </p>

        </div>

        <div className="d-flex gap-2 flex-wrap">

          <button
            className="btn btn-success"
            onClick={handleExport}
          >
            Export Data
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/hr")
            }
          >
            Back To Home
          </button>

        </div>

      </div>

      {/* 🔥 SUMMARY CARDS */}
      <div className="row mb-4">

        <div className="col-lg-3 col-md-6 mb-3">

          <div className="card border-0 shadow rounded-4 bg-primary text-white p-4">

            <h6>
              Total Leaves
            </h6>

            <h1 className="fw-bold">
              {totalLeaves}
            </h1>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-3">

          <div className="card border-0 shadow rounded-4 bg-success text-white p-4">

            <h6>
              Approved
            </h6>

            <h1 className="fw-bold">
              {approvedCount}
            </h1>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-3">

          <div className="card border-0 shadow rounded-4 bg-warning text-dark p-4">

            <h6>
              Pending
            </h6>

            <h1 className="fw-bold">
              {pendingCount}
            </h1>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-3">

          <div className="card border-0 shadow rounded-4 bg-danger text-white p-4">

            <h6>
              Rejected
            </h6>

            <h1 className="fw-bold">
              {rejectedCount}
            </h1>

          </div>

        </div>

      </div>

      {/* 🔥 MAIN CARD */}
      <div className="card border-0 shadow-lg rounded-4 p-4">

        {/* 🔥 HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

          <div>

            <h3 className="fw-bold mb-1">
              Leave History
            </h3>

            <p className="text-muted mb-0">
              Monthly Employee Leave Records
            </p>

          </div>

          <div>

            <span className="badge bg-dark fs-6 p-2">
              {filteredLeaves.length}
              {" "}
              Records
            </span>

          </div>

        </div>

        {/* 🔥 FILTER BAR */}
        <div className="row g-3 mb-4">

          {/* 🔥 SEARCH */}
          <div className="col-lg-4">

            <input
              type="text"
              placeholder="Search by Name or Employee ID"
              className="form-control shadow-sm"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* 🔥 STATUS */}
          <div className="col-lg-4">

            <select
              className="form-select shadow-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Status
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

          </div>

          {/* 🔥 MONTH */}
          <div className="col-lg-4">

            <input
              type="month"
              className="form-control shadow-sm"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* 🔥 TABLE */}
        <div
          className="table-responsive"
          style={{
            maxHeight: "600px",
            overflowY: "auto"
          }}
        >

          <table className="table table-hover align-middle">

            <thead
              className="table-dark"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10
              }}
            >

              <tr>

                <th>ID</th>

                <th>
                  Employee
                </th>

                <th>
                  Leave Type
                </th>

                <th>
                  Start Date
                </th>

                <th>
                  End Date
                </th>

                <th>
                  Days
                </th>

                <th>
                  Reason
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {
                loading ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >

                      <div className="spinner-border text-primary mb-3" />

                      <p>
                        Loading Leave Data...
                      </p>

                    </td>

                  </tr>

                ) :

                filteredLeaves.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center text-muted py-5"
                    >

                      <h5>
                        No Leave Records Found
                      </h5>

                    </td>

                  </tr>

                ) :

                (

                  filteredLeaves.map(
                    (l) => (

                      <tr key={l.id}>

                        {/* 🔥 ID */}
                        <td>

                          <span className="fw-bold">
                            #{l.id}
                          </span>

                        </td>

                        {/* 🔥 EMPLOYEE */}
                        <td>

                          <div>

                            <h6 className="mb-0 fw-bold">
                              {l.name}
                            </h6>

                            <small className="text-muted">
                              Employee ID:
                              {" "}
                              {l.userId}
                            </small>

                          </div>

                        </td>

                        {/* 🔥 TYPE */}
                        <td>

                          {
                            l.type === "free" ? (

                              <span className="badge bg-success p-2">
                                🎁 Free Leave
                              </span>

                            ) :

                            l.type === "paid" ? (

                              <span className="badge bg-warning text-dark p-2">
                                💰 Paid Leave
                              </span>

                            ) :

                            (

                              <span className="badge bg-secondary p-2">
                                Other
                              </span>
                            )
                          }

                        </td>

                        {/* 🔥 DATES */}
                        <td>
                          {l.start || "N/A"}
                        </td>

                        <td>
                          {l.end || "N/A"}
                        </td>

                        {/* 🔥 DAYS */}
                        <td>

                          <span className="badge bg-info p-2">
                            {l.days || 1}
                          </span>

                        </td>

                        {/* 🔥 REASON */}
                        <td
                          style={{
                            minWidth:
                              "220px"
                          }}
                        >
                          {
                            l.reason ||
                            "No Reason"
                          }
                        </td>

                        {/* 🔥 STATUS */}
                        <td>

                          {
                            l.status ===
                              "approved" && (

                              <span className="badge bg-success p-2">
                                ✅ Approved
                              </span>
                            )
                          }

                          {
                            l.status ===
                              "pending" && (

                              <span className="badge bg-warning text-dark p-2">
                                ⏳ Pending
                              </span>
                            )
                          }

                          {
                            l.status ===
                              "rejected" && (

                              <span className="badge bg-danger p-2">
                                ❌ Rejected
                              </span>
                            )
                          }

                        </td>

                        {/* 🔥 ACTION */}
                        <td>

                          {
                            l.status ===
                              "pending" ? (

                              <div className="d-flex gap-2">

                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    handleAction(
                                      l.id,
                                      "approved"
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleAction(
                                      l.id,
                                      "rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>

                              </div>

                            ) :

                            (

                              <span className="text-muted">
                                Completed
                              </span>
                            )
                          }

                        </td>

                      </tr>
                    )
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default HrDashboard