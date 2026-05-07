import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAttendance } from "../../../feature/AttendenceSlice"

const Attendance = () => {

  const dispatch = useDispatch()

  const { attendance = [], status, error } = useSelector(
    (state) => state.attendance || {}
  )

  // 🔥 STATES
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchAttendance())
  }, [dispatch])

  // 🔥 TODAY
  const today = new Date().toLocaleDateString()

  // 🔥 FILTER
  const filteredAttendance = attendance.filter((a) => {

    // SEARCH
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase())

    // DATE
    let matchDate = true

    if (showHistory && selectedDate) {

      const pickedDate = new Date(selectedDate).toLocaleDateString()

      matchDate = a.date === pickedDate

    } else {

      matchDate = a.date === today
    }

    // DEPARTMENT
    const matchDepartment =
      departmentFilter === "all" ||
      a.department === departmentFilter

    return matchSearch && matchDate && matchDepartment
  })

  // 🔥 WORKING HOURS
  const calculateHours = (checkIn, checkOut) => {

    if (!checkIn || !checkOut) return 0

    const inTime = new Date(`2026-01-01 ${checkIn}`)
    const outTime = new Date(`2026-01-01 ${checkOut}`)

    const diff =
      (outTime - inTime) / (1000 * 60 * 60)

    return diff.toFixed(1)
  }

  // 🔥 STATUS
  const getStatus = (a) => {

    if (!a.checkOut) {
      return "Working"
    }

    const hours = calculateHours(a.checkIn, a.checkOut)

    if (hours >= 8) {
      return "Present"
    }

    if (hours >= 4) {
      return "Half Day"
    }

    return "Absent"
  }

  // 🔥 SALARY CUT
  const calculateCut = (a) => {

    if (!a.salary) return 0

    const hours = calculateHours(a.checkIn, a.checkOut)

    const perHour = a.salary / 30 / 8

    if (hours >= 8) return 0

    const missingHours = 8 - hours

    return Math.round(perHour * missingHours)
  }

  return (
    <div
      className="container-fluid p-4"
      style={{
        height: "100vh",
        overflowY: "auto",
        background: "#f5f7fb"
      }}
    >

      {/* 🔥 HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">Attendance Dashboard</h2>
          <p className="text-muted">
            Employee attendance monitoring system
          </p>
        </div>

        <button
          className="btn btn-dark"
          onClick={() => setShowHistory(!showHistory)}
        >
          {
            showHistory
              ? "Today Attendance"
              : "Attendance History"
          }
        </button>

      </div>

      {/* 🔥 SEARCH + FILTER */}
      <div className="card p-3 shadow-sm mb-4">

        <div className="row">

          {/* SEARCH */}
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* DATE */}
          {showHistory && (
            <div className="col-md-4 mb-2">
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {/* DEPARTMENT */}
          <div className="col-md-4 mb-2">
            <select
              className="form-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Flutter">Flutter</option>
            </select>
          </div>

        </div>

      </div>

      {/* 🔥 STATS */}
      <div className="row mb-4">

        <div className="col-md-3 mb-2">
          <div className="card p-3 shadow-sm">
            <h6>Total</h6>
            <h3>{filteredAttendance.length}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card p-3 shadow-sm">
            <h6>Present</h6>
            <h3>
              {
                filteredAttendance.filter(
                  a => getStatus(a) === "Present"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card p-3 shadow-sm">
            <h6>Half Day</h6>
            <h3>
              {
                filteredAttendance.filter(
                  a => getStatus(a) === "Half Day"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card p-3 shadow-sm">
            <h6>Working</h6>
            <h3>
              {
                filteredAttendance.filter(
                  a => getStatus(a) === "Working"
                ).length
              }
            </h3>
          </div>
        </div>

      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow-sm p-3">

        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>{error}</p>}

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Salary Cut</th>
              </tr>

            </thead>

            <tbody>

              {filteredAttendance.length > 0 ? (

                filteredAttendance.map((a) => {

                  const hours = calculateHours(
                    a.checkIn,
                    a.checkOut
                  )

                  const status = getStatus(a)

                  return (

                    <tr key={a.id}>

                      <td>{a.userId}</td>

                      <td>{a.name}</td>

                      <td>{a.date}</td>

                      <td>{a.department || "N/A"}</td>

                      <td>{a.checkIn}</td>

                      <td>{a.checkOut || "--"}</td>

                      <td>{hours}</td>

                      <td>

                        {
                          status === "Present" ? (
                            <span className="badge bg-success">
                              Present
                            </span>
                          ) : status === "Half Day" ? (
                            <span className="badge bg-warning text-dark">
                              Half Day
                            </span>
                          ) : status === "Working" ? (
                            <span className="badge bg-primary">
                              Working
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Absent
                            </span>
                          )
                        }

                      </td>

                      <td className="text-danger fw-bold">
                        ₹ {calculateCut(a)}
                      </td>

                    </tr>
                  )
                })

              ) : (

                <tr>
                  <td colSpan="9" className="text-center">
                    No Attendance Found
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

export default Attendance