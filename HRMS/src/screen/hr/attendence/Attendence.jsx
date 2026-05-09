import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { fetchAttendance } from "../../../feature/AttendenceSlice"

const Attendance = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    attendance = [],
    status,
    error
  } = useSelector(
    (state) => state.attendance || {}
  )

  // 🔥 EMPLOYEES
  const [employees, setEmployees] = useState([])

  // 🔥 FILTER STATES
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // 🔥 FETCH DATA
  useEffect(() => {

    dispatch(fetchAttendance())

    fetch("http://localhost:3000/employe")
      .then((res) => res.json())
      .then((data) => {

        const onlyEmployees =
          data.filter(
            (emp) => emp.role === "employee"
          )

        setEmployees(onlyEmployees)
      })

  }, [dispatch])

  // 🔥 TODAY DATE
  const today =
    new Date().toLocaleDateString()

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (!time) return 0

    if (time === "Auto Checkout") {
      return 0
    }

    try {

      const [timePart, modifier] =
        time.split(" ")

      let [hours, minutes] =
        timePart.split(":")

      hours = parseInt(hours)
      minutes = parseInt(minutes)

      if (
        modifier === "PM" &&
        hours !== 12
      ) {
        hours += 12
      }

      if (
        modifier === "AM" &&
        hours === 12
      ) {
        hours = 0
      }

      return hours * 60 + minutes

    } catch (error) {

      return 0
    }
  }

  // 🔥 HOURS
  const calculateHours = (
    checkIn,
    checkOut
  ) => {

    if (!checkIn) return 0

    if (!checkOut) {

      const currentTime =
        new Date().toLocaleTimeString()

      checkOut = currentTime
    }

    if (checkOut === "Auto Checkout") {
      return 4
    }

    const inMinutes =
      convertToMinutes(checkIn)

    const outMinutes =
      convertToMinutes(checkOut)

    let diff =
      (outMinutes - inMinutes) / 60

    if (diff < 0 || isNaN(diff)) {
      return 0
    }

    if (diff > 8) {
      diff = 8
    }

    return diff.toFixed(1)
  }

  // 🔥 STATUS
  const getStatus = (a) => {

    // ❌ No checkin
    if (!a.checkIn) {
      return "Absent"
    }

    // ✅ Checkin hote hi present
    if (a.checkIn && !a.checkOut) {
      return "Present"
    }

    // 🔥 Auto checkout
    if (a.checkOut === "Auto Checkout") {
      return "Half Day"
    }

    const hours =
      Number(
        calculateHours(
          a.checkIn,
          a.checkOut
        )
      )

    // ✅ Full day
    if (hours >= 8) {
      return "Present"
    }

    // ✅ Half day
    if (hours >= 4) {
      return "Half Day"
    }

    return "Absent"
  }

  // 🔥 SALARY CUT
  const calculateCut = (a) => {

    if (!a.salary) return 0

    if (!a.checkIn) {

      return Math.round(
        a.salary / 30
      )
    }

    const hours =
      Number(
        calculateHours(
          a.checkIn,
          a.checkOut
        )
      )

    if (hours >= 8) {
      return 0
    }

    if (a.checkOut === "Auto Checkout") {

      return Math.round(
        a.salary / 30 / 2
      )
    }

    const perHour =
      a.salary / 30 / 8

    const missingHours =
      8 - hours

    return Math.round(
      perHour * missingHours
    )
  }

  // 🔥 SELECTED DATE
  const selectedHistoryDate =
    selectedDate
      ? new Date(selectedDate).toLocaleDateString()
      : today

  // 🔥 STATS DATA
  const statsAttendance =
    attendance.filter((a) => {

      if (showHistory) {
        return a.date === selectedHistoryDate
      }

      return a.date === today
    })

  // 🔥 TOTAL EMPLOYEES
  const totalEmployees =
    employees.length

  // 🔥 PRESENT
  const presentCount =
    statsAttendance.filter(
      (a) =>
        getStatus(a) === "Present"
    ).length

  // 🔥 HALF DAY
  const halfDayCount =
    statsAttendance.filter(
      (a) =>
        getStatus(a) === "Half Day"
    ).length

  // 🔥 ABSENT
  const absentCount =
    totalEmployees -
    (
      presentCount +
      halfDayCount
    )

  // 🔥 FILTER DATA
  const filteredAttendance =
    attendance.filter((a) => {

      // SEARCH
      const matchSearch =
        a.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      // DATE
      let matchDate = true

      if (
        showHistory &&
        selectedDate
      ) {

        const pickedDate =
          new Date(
            selectedDate
          ).toLocaleDateString()

        matchDate =
          a.date === pickedDate

      } else {

        matchDate =
          a.date === today
      }

      // DEPARTMENT
      const matchDepartment =
        departmentFilter === "all" ||
        a.department === departmentFilter

      return (
        matchSearch &&
        matchDate &&
        matchDepartment
      )
    })

  return (

    <div className="container-fluid p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            Attendance Dashboard
          </h2>

          <p className="text-muted">
            Employee attendance monitoring system
          </p>

        </div>

        <div>

          <button
            className="btn btn-dark"
            onClick={() =>
              setShowHistory(
                !showHistory
              )
            }
          >
            {
              showHistory
                ? "Today Attendance"
                : "Attendance History"
            }
          </button>

          <button
            className="btn btn-primary ms-2"
            onClick={() =>
              navigate("/hr")
            }
          >
            Go To HR
          </button>

        </div>

      </div>

      {/* FILTER */}
      <div className="card p-3 shadow-sm mb-4">

        <div className="row">

          {/* SEARCH */}
          <div className="col-md-4 mb-2">

            <input
              type="text"
              className="form-control"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* DATE */}
          {
            showHistory && (

              <div className="col-md-4 mb-2">

                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                />

              </div>
            )
          }

          {/* DEPARTMENT */}
          <div className="col-md-4 mb-2">

            <select
              className="form-control"
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Departments
              </option>

              <option value="Human Resources">
                Human Resources
              </option>

              <option value="Web Development">
                Web Development
              </option>

              <option value="Graphic Designer">
                Graphic Designer
              </option>

              <option value="AI/ML">
                AI/ML
              </option>

              <option value="Flutter">
                Flutter
              </option>

              <option value="Backend">
                Backend
              </option>

              <option value="QA Testing">
                QA Testing
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="row mb-4">

        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Total Employees</h6>

            <h3>
              {totalEmployees}
            </h3>

          </div>

        </div>

        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Present</h6>

            <h3 className="text-success">
              {presentCount}
            </h3>

          </div>

        </div>

        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Absent</h6>

            <h3 className="text-danger">
              {absentCount}
            </h3>

          </div>

        </div>

        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Half Day</h6>

            <h3 className="text-warning">
              {halfDayCount}
            </h3>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="card shadow-sm p-3">

        {
          status === "loading" &&
          <p>Loading...</p>
        }

        {
          status === "failed" &&
          <p>{error}</p>
        }

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

              {
                filteredAttendance.length > 0
                  ? (
                    filteredAttendance.map((a) => {

                      const hours =
                        calculateHours(
                          a.checkIn,
                          a.checkOut
                        )

                      const status =
                        getStatus(a)

                      return (

                        <tr key={a.id}>

                          <td>
                            {a.userId}
                          </td>

                          <td>
                            {a.name}
                          </td>

                          <td>
                            {a.date}
                          </td>

                          <td>
                            {
                              a.department || "N/A"
                            }
                          </td>

                          <td>
                            {
                              a.checkIn || "--"
                            }
                          </td>

                          <td>
                            {
                              a.checkOut || "--"
                            }
                          </td>

                          <td>
                            {hours} hrs
                          </td>

                          <td>

                            {
                              status === "Present"
                                ? (
                                  <span className="badge bg-success">
                                    Present
                                  </span>
                                )

                                : status === "Half Day"
                                  ? (
                                    <span className="badge bg-warning text-dark">
                                      Half Day
                                    </span>
                                  )

                                  : (
                                    <span className="badge bg-danger">
                                      Absent
                                    </span>
                                  )
                            }

                          </td>

                          <td className="text-danger fw-bold">

                            ₹ {
                              calculateCut(a)
                            }

                          </td>

                        </tr>
                      )
                    })
                  )

                  : (

                    <tr>

                      <td
                        colSpan="9"
                        className="text-center"
                      >
                        No Attendance Found
                      </td>

                    </tr>
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Attendance