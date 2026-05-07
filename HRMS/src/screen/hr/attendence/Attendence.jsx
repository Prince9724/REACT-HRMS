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

  // 🔥 ALL EMPLOYEES
  const [employees, setEmployees] = useState([])

  // 🔥 STATES
  const [searchText, setSearchText] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {

    dispatch(fetchAttendance())

    // 🔥 FETCH EMPLOYEES
    fetch("http://localhost:3000/employe")
      .then((res) => res.json())
      .then((data) => {

        // 🔥 ONLY EMPLOYEES
        const onlyEmployees =
          data.filter(
            (emp) => emp.role === "employee"
          )

        setEmployees(onlyEmployees)
      })

  }, [dispatch])

  // 🔥 TODAY
  const today =
    new Date().toLocaleDateString()

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (!time) return 0

    // 🔥 AUTO CHECKOUT FIX
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

      // 🔥 PM FIX
      if (
        modifier === "PM" &&
        hours !== 12
      ) {
        hours += 12
      }

      // 🔥 12 AM FIX
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

  // 🔥 CALCULATE HOURS
  const calculateHours = (
    checkIn,
    checkOut
  ) => {

    // 🔥 STILL WORKING
    if (!checkOut) {

      const currentTime =
        new Date().toLocaleTimeString()

      checkOut = currentTime
    }

    // 🔥 AUTO CHECKOUT
    if (checkOut === "Auto Checkout") {
      return 4
    }

    const inMinutes =
      convertToMinutes(checkIn)

    const outMinutes =
      convertToMinutes(checkOut)

    let diff =
      (outMinutes - inMinutes) / 60

    // 🔥 INVALID FIX
    if (diff < 0 || isNaN(diff)) {
      return 0
    }

    // 🔥 MAX 8 HOURS
    if (diff > 8) {
      diff = 8
    }

    return diff.toFixed(1)
  }

  // 🔥 STATUS
  const getStatus = (a) => {

    // 🔥 WORKING
    if (!a.checkOut) {
      return "Working"
    }

    // 🔥 AUTO CHECKOUT
    if (a.checkOut === "Auto Checkout") {
      return "Half Day"
    }

    const hours = Number(
      calculateHours(
        a.checkIn,
        a.checkOut
      )
    )

    // 🔥 FULL DAY
    if (hours >= 8) {
      return "Present"
    }

    // 🔥 HALF DAY
    if (hours >= 4) {
      return "Half Day"
    }

    return "Absent"
  }

  // 🔥 SALARY CUT
  const calculateCut = (a) => {

    // 🔥 NO SALARY
    if (!a.salary) return 0

    // 🔥 STILL WORKING
    if (!a.checkOut) {
      return 0
    }

    const hours = Number(
      calculateHours(
        a.checkIn,
        a.checkOut
      )
    )

    // 🔥 FULL DAY
    if (hours >= 8) {
      return 0
    }

    const perHour =
      a.salary / 30 / 8

    const missingHours =
      8 - hours

    return Math.round(
      perHour * missingHours
    )
  }

  // 🔥 TODAY ATTENDANCE
  const todayAttendance =
    attendance.filter(
      (a) => a.date === today
    )

  // 🔥 PRESENT IDS
  const presentIds =
    todayAttendance.map(
      (a) => a.userId
    )

  // 🔥 TOTAL EMPLOYEE
  const totalEmployees =
    employees.length

  // 🔥 PRESENT
  const presentCount =
    presentIds.length

  // 🔥 ABSENT
  const absentCount =
    totalEmployees - presentCount

  // 🔥 HALF DAY
  const halfDayCount =
    todayAttendance.filter(
      (a) =>
        getStatus(a) === "Half Day"
    ).length

  // 🔥 FILTER
  const filteredAttendance =
    attendance.filter((a) => {

      // 🔥 SEARCH AUTO
      const matchSearch =
        a.name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          )

      // 🔥 DATE
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

      // 🔥 DEPARTMENT
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

    <div className="container-fluid page-container">

      {/* 🔥 HEADER */}
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
            onClick={() => navigate("/hr")}
          >
            Go To HR
          </button>

        </div>

      </div>

      {/* 🔥 SEARCH + FILTER */}
      <div className="card p-3 shadow-sm mb-4">

        <div className="row">

          {/* 🔥 SEARCH */}
          <div className="col-md-4 mb-2">

            <input
              type="text"
              className="form-control"
              placeholder="Search employee..."
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />

          </div>

          {/* 🔥 DATE */}
          {showHistory && (

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
          )}

          {/* 🔥 DEPARTMENT */}
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

            </select>

          </div>

        </div>

      </div>

      {/* 🔥 STATS */}
      <div className="row mb-4">

        {/* 🔥 TOTAL */}
        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Total Employees</h6>

            <h3>
              {totalEmployees}
            </h3>

          </div>

        </div>

        {/* 🔥 PRESENT */}
        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Present</h6>

            <h3>
              {presentCount}
            </h3>

          </div>

        </div>

        {/* 🔥 ABSENT */}
        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Absent</h6>

            <h3>
              {absentCount}
            </h3>

          </div>

        </div>

        {/* 🔥 HALF DAY */}
        <div className="col-md-3 mb-2">

          <div className="card p-3 shadow-sm">

            <h6>Half Day</h6>

            <h3>
              {halfDayCount}
            </h3>

          </div>

        </div>

      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow-sm p-3">

        {status === "loading" && (
          <p>Loading...</p>
        )}

        {status === "failed" && (
          <p>{error}</p>
        )}

        <div className="table-responsive scroll-container">

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
                              a.department ||
                              "N/A"
                            }
                          </td>

                          <td>
                            {a.checkIn}
                          </td>

                          <td>
                            {
                              a.checkOut ||
                              "--"
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
                                  : status === "Working"
                                    ? (
                                      <span className="badge bg-primary">
                                        Working
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