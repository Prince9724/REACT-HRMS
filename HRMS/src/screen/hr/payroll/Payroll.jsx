import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
const Payroll = () => {
    const navigate = useNavigate();
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

  // ===== (ALL YOUR LOGIC REMAINS SAME) =====
  const monthNames = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
  }

  const convertToMinutes = (time) => {
    if (!time || time === "" || time === "Leave" || time === "Auto Checkout") return 0
    try {
      const [timePart, modifier] = time.split(" ")
      let [hours, minutes] = timePart.split(":")
      hours = parseInt(hours)
      minutes = parseInt(minutes)

      if (modifier === "PM" && hours !== 12) hours += 12
      if (modifier === "AM" && hours === 12) hours = 0

      return hours * 60 + minutes
    } catch {
      return 0
    }
  }

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkIn === "" || checkOut === "") return 0
    if (checkOut === "Auto Checkout") return 4
    if (checkIn === "Leave" || checkOut === "Leave") return 0

    const inMinutes = convertToMinutes(checkIn)
    const outMinutes = convertToMinutes(checkOut)

    let diff = (outMinutes - inMinutes) / 60
    if (diff < 0 || isNaN(diff)) return 0
    if (diff > 8) diff = 8

    return diff
  }

  const isSunday = (dateString) => new Date(dateString).getDay() === 0

  const generatePayroll = (employees, attendance, leaves) => {
    const monthsSet = new Set()

    attendance.forEach((a) => {
      const date = new Date(a.date)
      monthsSet.add(`${date.getMonth() + 1}-${date.getFullYear()}`)
    })

    const payrollData = []

    monthsSet.forEach((item) => {
      const [month, year] = item.split("-").map(Number)

      employees
        .filter((emp) => emp.role === "employee")
        .forEach((emp) => {

          const userAttendance = attendance.filter((a) => {
            const date = new Date(a.date)
            return (
              a.userId === emp.id &&
              date.getMonth() + 1 === month &&
              date.getFullYear() === year
            )
          })

          const userLeaves = leaves.filter((l) => {
            const date = new Date(l.start)
            return (
              l.userId === emp.id &&
              l.status === "approved" &&
              date.getMonth() + 1 === month &&
              date.getFullYear() === year
            )
          })

          let present = 0, absent = 0, halfDay = 0, sundayPaid = 0
          let totalHours = 0, attendanceCut = 0, leaveCut = 0
          const perDaySalary = emp.salary / 30

          const attendanceHistory = []

          userAttendance.forEach((a) => {
            const hours = calculateHours(a.checkIn, a.checkOut)
            totalHours += hours

            let status = ""

            if (isSunday(a.date)) status = "Sunday Off"
            else if (a.checkIn === "Leave" || a.checkOut === "Leave") status = "Leave"
            else if (a.checkIn === "" && a.checkOut === "") {
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

          let totalLeaves = 0
          userLeaves.forEach((l) => totalLeaves += Number(l.days))

          if (totalLeaves > 1) leaveCut = (totalLeaves - 1) * perDaySalary

          const pf = emp.salary * 0.12
          const professionalTax = 200

          const totalCut = attendanceCut + leaveCut + pf + professionalTax
          let netSalary = emp.salary - totalCut
          if (netSalary < 0) netSalary = 0

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
            attendanceHistory
          })
        })
    })

    return payrollData
  }

  const filteredPayroll = allPayroll.filter((p) => {
    return (
      p.month === selectedMonth &&
      p.year === selectedYear &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (department === "all" || p.department === department)
    )
  })

  const years = [...new Set(allPayroll.map((p) => p.year))]

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* ===== HEADER (UI IMPROVED) ===== */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-0">
            <i className="bi bi-cash-stack me-2 text-primary"></i>
            Payroll Dashboard
          </h3>
          <small className="text-muted">Employee Salary Management System</small>
        </div>
        <button className="btn btn-outline-dark" onClick={()=>navigate("/hr")}>back</button>
      </div>

      {/* ===== FILTER (UI IMPROVED) ===== */}
      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* Month */}
            <div className="col-md-3">
              <label className="form-label text-secondary small">
                Month
              </label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Object.entries(monthNames).map(([num, name]) => (
                  <option key={num} value={num}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="col-md-3">
              <label className="form-label text-secondary small">
                Year
              </label>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="col-md-3">
              <label className="form-label text-secondary small">
                Search
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Employee name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Department */}
            <div className="col-md-3">
              <label className="form-label text-secondary small">
                Department
              </label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="all">All</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web Development">Web Development</option>
                <option value="Flutter">Flutter</option>
                <option value="Graphic Designer">Graphic Designer</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* ===== SUMMARY KPI CARDS ===== */}
      <div className="row mb-4 g-3">

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <i className="bi bi-people fs-3 text-primary"></i>
            <h6 className="mt-2 text-primary">Total Employees</h6>
            <h4>{filteredPayroll.length}</h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <i className="bi bi-currency-rupee fs-3 text-success"></i>
            <h6 className="mt-2 text-warning">Total Salary</h6>
            <h4>
              ₹{filteredPayroll.reduce((s, p) => s + p.netSalary, 0).toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <i className="bi bi-calendar-event fs-3 text-warning"></i>
            <h6 className="mt-2 text-success">Selected Month</h6>
            <h4>{monthNames[selectedMonth]} {selectedYear}</h4>
          </div>
        </div>

      </div>

      {/* ===== TABLE UI IMPROVED ===== */}
      <div className="card shadow-sm border-0 p-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Half</th>
                <th>Leaves</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayroll.map((p) => (
                <tr key={`${p.id}-${p.month}`}>
                  <td>{p.id}</td>
                  <td className="fw-semibold">{p.name}</td>
                  <td>{p.department}</td>

                  <td><span className="badge bg-success">{p.present}</span></td>
                  <td><span className="badge bg-danger">{p.absent}</span></td>
                  <td><span className="badge bg-warning text-dark">{p.halfDay}</span></td>
                  <td><span className="badge bg-secondary">{p.totalLeaves}</span></td>

                  <td className="fw-bold text-success">
                    ₹{p.netSalary.toLocaleString()}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedEmployee(p)}
                    >View
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ===== MODAL (UNCHANGED - EXACT SAME AS YOU REQUIRED) ===== */}
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