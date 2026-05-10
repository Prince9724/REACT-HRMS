import React, { useEffect, useState } from "react"
import axios from "axios"

const Payroll = () => {

  const [allPayroll, setAllPayroll] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("all")

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  )

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {

      const empRes = await axios.get("http://localhost:3000/employe")
      const attRes = await axios.get("http://localhost:3000/attendance")
      const leaveRes = await axios.get("http://localhost:3000/leaves")

      const employees = empRes.data
      const attendance = attRes.data
      const leaves = leaveRes.data

      const payrollData = generatePayroll(
        employees,
        attendance,
        leaves
      )

      setAllPayroll(payrollData)

    } catch (error) {
      console.log(error)
    }
  }

  // 🔥 MONTH NAME
  const monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

  // 🔥 TIME TO MINUTES
  const convertToMinutes = (time) => {

    if (
      !time ||
      time === "" ||
      time === "Leave" ||
      time === "Auto Checkout"
    ) {
      return 0
    }

    try {

      const [timePart, modifier] = time.split(" ")

      let [hours, minutes] = timePart.split(":")

      hours = parseInt(hours)
      minutes = parseInt(minutes)

      if (modifier === "PM" && hours !== 12) {
        hours += 12
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0
      }

      return hours * 60 + minutes

    } catch (error) {
      return 0
    }
  }

  // 🔥 HOURS
  const calculateHours = (checkIn, checkOut) => {

    if (
      !checkIn ||
      !checkOut ||
      checkIn === "" ||
      checkOut === ""
    ) {
      return 0
    }

    // 🔥 AUTO CHECKOUT = HALF DAY
    if (checkOut === "Auto Checkout") {
      return 4
    }

    // 🔥 LEAVE
    if (
      checkIn === "Leave" ||
      checkOut === "Leave"
    ) {
      return 0
    }

    const inMinutes = convertToMinutes(checkIn)
    const outMinutes = convertToMinutes(checkOut)

    let diff = (outMinutes - inMinutes) / 60

    if (diff < 0 || isNaN(diff)) {
      return 0
    }

    // MAX 8 HOURS
    if (diff > 8) {
      diff = 8
    }

    return diff
  }

  // 🔥 SUNDAY CHECK
  const isSunday = (dateString) => {

    const date = new Date(dateString)

    return date.getDay() === 0
  }

  // 🔥 PAYROLL GENERATE
  const generatePayroll = (
    employees,
    attendance,
    leaves
  ) => {

    const monthsSet = new Set()

    attendance.forEach((a) => {

      const date = new Date(a.date)

      const month = date.getMonth() + 1
      const year = date.getFullYear()

      monthsSet.add(`${month}-${year}`)
    })

    const payrollData = []

    monthsSet.forEach((item) => {

      const [month, year] = item.split("-").map(Number)

      employees
        .filter((emp) => emp.role === "employee")
        .forEach((emp) => {

          // 🔥 ONLY CURRENT MONTH DATA
          const userAttendance = attendance.filter((a) => {

            const date = new Date(a.date)

            return (
              a.userId === emp.id &&
              date.getMonth() + 1 === month &&
              date.getFullYear() === year
            )
          })

          // 🔥 APPROVED LEAVES
          const userLeaves = leaves.filter((l) => {

            const date = new Date(l.start)

            return (
              l.userId === emp.id &&
              l.status === "approved" &&
              date.getMonth() + 1 === month &&
              date.getFullYear() === year
            )
          })

          let present = 0
          let absent = 0
          let halfDay = 0
          let sundayPaid = 0

          let totalHours = 0

          let attendanceCut = 0
          let leaveCut = 0

          const perDaySalary = emp.salary / 30

          // 🔥 ATTENDANCE HISTORY
          const attendanceHistory = []

          userAttendance.forEach((a) => {

            const hours = calculateHours(
              a.checkIn,
              a.checkOut
            )

            totalHours += hours

            let status = ""

            // 🔥 SUNDAY PAID
            // 🔥 SUNDAY OFF
            if (isSunday(a.date)) {

              status = "Sunday Off"

            }

            else if (
              a.checkIn === "Leave" ||
              a.checkOut === "Leave"
            ) {

              status = "Leave"
            }

            else if (
              a.checkIn === "" &&
              a.checkOut === ""
            ) {

              absent++

              attendanceCut += perDaySalary

              status = "Absent"
            }

            else if (hours >= 8) {

              present++

              status = "Present"
            }

            else if (hours >= 4) {

              halfDay++

              attendanceCut += perDaySalary / 2

              status = "Half Day"
            }

            else {

              absent++

              attendanceCut += perDaySalary

              status = "Absent"
            }

            attendanceHistory.push({
              date: a.date,
              checkIn: a.checkIn,
              checkOut: a.checkOut,
              hours: hours.toFixed(1),
              status
            })

          })

          // 🔥 LEAVE
          let totalLeaves = 0

          userLeaves.forEach((l) => {

            totalLeaves += Number(l.days)
          })

          // 🔥 1 LEAVE FREE
          if (totalLeaves > 1) {

            leaveCut =
              (totalLeaves - 1) * perDaySalary
          }

          // 🔥 PF
          const pf = emp.salary * 0.12

          // 🔥 TAX
          const professionalTax = 200

          // 🔥 TOTAL CUT
          const totalCut =
            attendanceCut +
            leaveCut +
            pf +
            professionalTax

          // 🔥 NET SALARY
          let netSalary =
            emp.salary - totalCut

          if (netSalary < 0) {
            netSalary = 0
          }

          // 🔥 PERFORMANCE
          let performance = "Poor"

          if (present >= 26) {
            performance = "Excellent"
          }

          else if (present >= 20) {
            performance = "Good"
          }

          else if (present >= 15) {
            performance = "Average"
          }

          payrollData.push({

            id: emp.id,

            name: emp.firstName,

            department: emp.department,

            baseSalary: emp.salary,

            month,
            year,

            present,
            absent,
            halfDay,

            sundayPaid,

            totalLeaves,

            totalHours: totalHours.toFixed(1),

            attendanceCut: Math.round(attendanceCut),

            leaveCut: Math.round(leaveCut),

            pf: Math.round(pf),

            professionalTax,

            totalCut: Math.round(totalCut),

            netSalary: Math.round(netSalary),

            performance,

            attendanceHistory
          })

        })

    })

    return payrollData
  }

  // 🔥 FILTER
  const filteredPayroll = allPayroll.filter((p) => {

    const matchMonth =
      p.month === selectedMonth

    const matchYear =
      p.year === selectedYear

    const matchSearch =
      p.name
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchDepartment =
      department === "all" ||
      p.department === department

    return (
      matchMonth &&
      matchYear &&
      matchSearch &&
      matchDepartment
    )
  })

  // 🔥 YEARS
  const years = [
    ...new Set(
      allPayroll.map((p) => p.year)
    )
  ]

  return (

    <div
      className="container-fluid p-4"
      style={{
        background: "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      {/* 🔥 HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">
          Payroll Dashboard
        </h2>

        <p className="text-muted">
          Employee Salary Management
        </p>
      </div>

      {/* 🔥 FILTER */}
      <div className="card shadow border-0 p-3 mb-4">

        <div className="row">

          <div className="col-md-3 mb-2">

            <label className="fw-bold">
              Month
            </label>

            <select
              className="form-control"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  Number(e.target.value)
                )
              }
            >

              {Object.entries(monthNames).map(
                ([num, name]) => (
                  <option
                    key={num}
                    value={num}
                  >
                    {name}
                  </option>
                )
              )}

            </select>

          </div>

          <div className="col-md-3 mb-2">

            <label className="fw-bold">
              Year
            </label>

            <select
              className="form-control"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  Number(e.target.value)
                )
              }
            >

              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}

            </select>

          </div>

          <div className="col-md-3 mb-2">

            <label className="fw-bold">
              Search
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <label className="fw-bold">
              Department
            </label>

            <select
              className="form-control"
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >

              <option value="all">
                All
              </option>

              <option value="AI/ML">
                AI/ML
              </option>

              <option value="Web Development">
                Web Development
              </option>

              <option value="Flutter">
                Flutter
              </option>

              <option value="Graphic Designer">
                Graphic Designer
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* 🔥 SUMMARY */}
      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card bg-primary text-white p-3">

            <h5>Total Employees</h5>

            <h3>
              {filteredPayroll.length}
            </h3>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card bg-success text-white p-3">

            <h5>Total Salary</h5>

            <h3>
              ₹
              {filteredPayroll
                .reduce(
                  (sum, p) =>
                    sum + p.netSalary,
                  0
                )
                .toLocaleString()}
            </h3>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card bg-warning p-3">

            <h5>
              Selected Month
            </h5>

            <h3>
              {
                monthNames[selectedMonth]
              }{" "}
              {selectedYear}
            </h3>

          </div>

        </div>

      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow border-0 p-4">

        <div className="table-responsive">

          <table className="table table-hover">

            <thead className="table-dark">

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Department</th>

                <th>Present</th>

                <th>Absent</th>

                <th>Half Day</th>

               <th>Sunday Off</th>

                <th>Leaves</th>

                <th>Net Salary</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredPayroll.map((p) => (

                <tr
                  key={`${p.id}-${p.month}`}
                >

                  <td>{p.id}</td>

                  <td>
                    <strong>
                      {p.name}
                    </strong>
                  </td>

                  <td>
                    {p.department}
                  </td>

                  <td>
                    <span className="badge bg-success">
                      {p.present}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-danger">
                      {p.absent}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-warning text-dark">
                      {p.halfDay}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-info">
                      {p.sundayPaid}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-secondary">
                      {p.totalLeaves}
                    </span>
                  </td>

                  <td className="fw-bold text-success">

                    ₹
                    {p.netSalary.toLocaleString()}

                  </td>

                  <td>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() =>
                        setSelectedEmployee(p)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* 🔥 MODAL */}
      {selectedEmployee && (

        <div
          className="modal d-block"
          style={{
            background:
              "rgba(0,0,0,0.5)"
          }}
        >

          <div className="modal-dialog modal-xl">

            <div className="modal-content">

              <div className="modal-header">

                <h4>
                  Salary Slip -{" "}
                  {
                    selectedEmployee.name
                  }
                </h4>

                <button
                  className="btn-close"
                  onClick={() =>
                    setSelectedEmployee(null)
                  }
                />

              </div>

              <div className="modal-body">

                <div className="row mb-4">

                  <div className="col-md-6">

                    <p>
                      <strong>Name:</strong>{" "}
                      {
                        selectedEmployee.name
                      }
                    </p>

                    <p>
                      <strong>
                        Department:
                      </strong>{" "}
                      {
                        selectedEmployee.department
                      }
                    </p>

                    <p>
                      <strong>
                        Base Salary:
                      </strong>{" "}
                      ₹
                      {selectedEmployee.baseSalary.toLocaleString()}
                    </p>

                  </div>

                  <div className="col-md-6">

                    <p>
                      <strong>
                        Present:
                      </strong>{" "}
                      {
                        selectedEmployee.present
                      }
                    </p>

                    <p>
                      <strong>
                        Absent:
                      </strong>{" "}
                      {
                        selectedEmployee.absent
                      }
                    </p>

                    <p>
                      <strong>
                        Half Day:
                      </strong>{" "}
                      {
                        selectedEmployee.halfDay
                      }
                    </p>

                    <p>
                      <strong>
                        Sunday off:
                      </strong>{" "}
                      {
                        selectedEmployee.sundayPaid
                      }
                    </p>

                  </div>

                </div>

                {/* 🔥 SALARY TABLE */}
                <table className="table table-bordered mb-4">

                  <tbody>

                    <tr>
                      <td>
                        Basic Salary
                      </td>

                      <td>
                        ₹
                        {selectedEmployee.baseSalary.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Attendance Cut
                      </td>

                      <td className="text-danger">
                        - ₹
                        {selectedEmployee.attendanceCut.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Leave Cut
                      </td>

                      <td className="text-danger">
                        - ₹
                        {selectedEmployee.leaveCut.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        PF
                      </td>

                      <td className="text-danger">
                        - ₹
                        {selectedEmployee.pf.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Professional Tax
                      </td>

                      <td className="text-danger">
                        - ₹
                        {
                          selectedEmployee.professionalTax
                        }
                      </td>
                    </tr>

                    <tr className="table-secondary">

                      <td className="fw-bold">
                        Total Deduction
                      </td>

                      <td className="fw-bold text-danger">
                        - ₹
                        {selectedEmployee.totalCut.toLocaleString()}
                      </td>

                    </tr>

                    <tr className="table-success">

                      <td className="fw-bold">
                        Net Salary
                      </td>

                      <td className="fw-bold text-success">
                        ₹
                        {selectedEmployee.netSalary.toLocaleString()}
                      </td>

                    </tr>

                  </tbody>

                </table>

                {/* 🔥 ATTENDANCE HISTORY */}
                <h5 className="mb-3">
                  Attendance History
                </h5>

                <div className="table-responsive">

                  <table className="table table-bordered">

                    <thead className="table-dark">

                      <tr>

                        <th>Date</th>

                        <th>Check In</th>

                        <th>Check Out</th>

                        <th>Hours</th>

                        <th>Status</th>

                      </tr>

                    </thead>

                    <tbody>

                      {selectedEmployee.attendanceHistory.map(
                        (a, index) => (

                          <tr key={index}>

                            <td>{a.date}</td>

                            <td>{a.checkIn}</td>

                            <td>{a.checkOut}</td>

                            <td>
                              {a.hours}
                            </td>

                            <td>
                              {a.status ===
                                "Sunday Off" && (
                                  <span className="badge bg-info">
                                    Sunday Off
                                  </span>
                                )}

                              {a.status ===
                                "Absent" && (
                                  <span className="badge bg-danger">
                                    Absent
                                  </span>
                                )}

                              {a.status ===
                                "Half Day" && (
                                  <span className="badge bg-warning text-dark">
                                    Half Day
                                  </span>
                                )}

                              {a.status ===
                                "Leave" && (
                                  <span className="badge bg-secondary">
                                    Leave
                                  </span>
                                )}

                              {a.status ===
                                "Sunday Paid" && (
                                  <span className="badge bg-info">
                                    Sunday Paid
                                  </span>
                                )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Payroll