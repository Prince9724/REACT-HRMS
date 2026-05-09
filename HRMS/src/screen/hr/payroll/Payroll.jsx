import React, { useEffect, useState } from "react"
import axios from "axios"

const Payroll = () => {

  const [payroll, setPayroll] = useState([])
  const [allPayrollHistory, setAllPayrollHistory] = useState([])

  // 🔥 SEARCH
  const [search, setSearch] = useState("")

  // 🔥 FILTER
  const [department, setDepartment] = useState("all")

  // 🔥 MONTH & YEAR FILTER
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // 🔥 VIEW EMPLOYEE
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // 🔥 Available months for history
  const [availableMonths, setAvailableMonths] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  // 🔥 FETCH DATA
  const fetchData = async () => {

    try {
      const empRes = await axios.get("http://localhost:3000/employe")
      const attRes = await axios.get("http://localhost:3000/attendance")
      const leaveRes = await axios.get("http://localhost:3000/leaves")

      // Calculate payroll for ALL months
      const allMonthsPayroll = calculateAllMonthsPayroll(
        empRes.data,
        attRes.data,
        leaveRes.data
      )

      setAllPayrollHistory(allMonthsPayroll)
      
      // Set available months for filter
      const months = [...new Set(allMonthsPayroll.map(p => `${p.month}/${p.year}`))]
      setAvailableMonths(months)

    } catch (error) {
      console.log(error)
    }
  }

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {
    if (!time || time === "Auto Checkout" || time === "Leave") return 0

    try {
      const [timePart, modifier] = time.split(" ")
      let [hours, minutes] = timePart.split(":")
      hours = parseInt(hours)
      minutes = parseInt(minutes)

      if (modifier === "PM" && hours !== 12) hours += 12
      if (modifier === "AM" && hours === 12) hours = 0

      return hours * 60 + minutes
    } catch (error) {
      return 0
    }
  }

  // 🔥 HOURS
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    if (checkOut === "Auto Checkout") return 4

    const inMinutes = convertToMinutes(checkIn)
    const outMinutes = convertToMinutes(checkOut)
    let diff = (outMinutes - inMinutes) / 60

    if (diff < 0 || isNaN(diff)) return 0
    if (diff > 8) diff = 8
    return diff
  }

  // 🔥 CALCULATE PAYROLL FOR SPECIFIC MONTH
  const calculatePayrollForMonth = (employees, attendance, leaves, month, year) => {

    return employees
      .filter((emp) => emp.role === "employee")
      .map((emp) => {

        // Filter attendance for selected month/year
        const userAttendance = attendance.filter((a) => {
          if (a.userId !== emp.id) return false
          const attDate = new Date(a.date)
          return attDate.getMonth() + 1 === month && attDate.getFullYear() === year
        })

        // Filter approved leaves for selected month/year
        const approvedLeaves = leaves.filter((l) => {
          if (l.userId !== emp.id || l.status !== "approved") return false
          const leaveStartDate = new Date(l.start)
          return leaveStartDate.getMonth() + 1 === month && leaveStartDate.getFullYear() === year
        })

        const perDaySalary = emp.salary / 30
        let present = 0
        let absent = 0
        let halfDay = 0
        let totalHours = 0
        let attendanceCut = 0
        let hasAnyAttendance = false

        // 🔥 ATTENDANCE CALCULATION
        userAttendance.forEach((a) => {
          if (a.checkIn && a.checkIn !== "") {
            hasAnyAttendance = true
          }

          const hours = calculateHours(a.checkIn, a.checkOut)
          totalHours += hours

          if (hours >= 8) {
            present++
          } else if (hours >= 4) {
            halfDay++
            attendanceCut += perDaySalary / 2
          } else if (hours > 0) {
            absent++
            attendanceCut += perDaySalary
          } else if (a.checkIn === "" && a.checkOut === "") {
            absent++
            attendanceCut += perDaySalary
          }
        })

        // 🔥 LEAVES CALCULATION
        let totalLeaves = 0
        let paidLeaveDays = 0
        let freeLeaveDays = 0

        approvedLeaves.forEach((l) => {
          totalLeaves += Number(l.days)
          if (l.type === "free") {
            freeLeaveDays += Number(l.days)
          } else {
            paidLeaveDays += Number(l.days)
          }
        })

        // 🔥 LEAVE CUT
        let leaveCut = 0
        const hasFreeLeave = approvedLeaves.some(l => l.type === "free")

        if (hasFreeLeave) {
          if (paidLeaveDays > 0) {
            leaveCut = paidLeaveDays * perDaySalary
          }
        } else {
          if (totalLeaves > 1) {
            const extraLeaves = totalLeaves - 1
            leaveCut = extraLeaves * perDaySalary
          }
        }

        // 🔥 PF (12%)
        const pf = emp.salary * 0.12

        // 🔥 TAX
        const professionalTax = 200

        // 🔥 TOTAL CUT
        const totalCut = attendanceCut + leaveCut + pf + professionalTax

        // 🔥 NET SALARY
        let netSalary = emp.salary - totalCut
        if (netSalary < 0) netSalary = 0

        // 🔥 If no attendance, salary = 0
        if (!hasAnyAttendance && present === 0 && userAttendance.length === 0) {
          netSalary = 0
        }

        // 🔥 PERFORMANCE
        let performance = "Poor"
        if (present >= 26) performance = "Excellent"
        else if (present >= 22) performance = "Good"
        else if (present >= 18) performance = "Average"

        return {
          id: emp.id,
          name: emp.firstName,
          department: emp.department,
          baseSalary: emp.salary,
          month,
          year,
          present,
          absent,
          halfDay,
          totalLeaves,
          totalHours: totalHours.toFixed(1),
          attendanceCut: Math.round(attendanceCut),
          leaveCut: Math.round(leaveCut),
          pf: Math.round(pf),
          professionalTax,
          performance,
          totalCut: Math.round(totalCut),
          netSalary: Math.round(netSalary),
          hasAnyAttendance
        }
      })
  }

  // 🔥 CALCULATE FOR ALL MONTHS
  const calculateAllMonthsPayroll = (employees, attendance, leaves) => {
    
    // Get all unique months from attendance data
    const monthsSet = new Set()
    
    attendance.forEach(a => {
      const date = new Date(a.date)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      monthsSet.add(`${month}/${year}`)
    })

    // Also include current month if not present
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    monthsSet.add(`${currentMonth}/${currentYear}`)

    const allPayroll = []

    monthsSet.forEach(monthYear => {
      const [month, year] = monthYear.split('/').map(Number)
      
      const monthlyPayroll = calculatePayrollForMonth(
        employees, 
        attendance, 
        leaves, 
        month, 
        year
      )
      
      allPayroll.push(...monthlyPayroll)
    })

    return allPayroll
  }

  // 🔥 Get current filtered payroll
  const getCurrentFilteredPayroll = () => {
    return allPayrollHistory.filter(p => 
      p.month === selectedMonth && p.year === selectedYear
    )
  }

  // 🔥 FILTER BY SEARCH & DEPARTMENT
  const filteredPayroll = getCurrentFilteredPayroll().filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchDepartment = department === "all" || p.department === department
    return matchSearch && matchDepartment
  })

  // 🔥 Get available years
  const getAvailableYears = () => {
    const years = [...new Set(allPayrollHistory.map(p => p.year))]
    return years.sort((a, b) => b - a)
  }

  // 🔥 Month Names
  const monthNames = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
  }

  return (
    <div className="container-fluid p-4" style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      
      {/* 🔥 HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Payroll Dashboard</h2>
        <p className="text-muted">Month-wise employee payroll management system</p>
      </div>

      {/* 🔥 FILTERS CARD */}
      <div className="card shadow border-0 p-3 mb-4">
        <div className="row">
          
          {/* 🔥 MONTH FILTER */}
          <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Select Month</label>
            <select
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Object.entries(monthNames).map(([num, name]) => (
                <option key={num} value={num}>{name}</option>
              ))}
            </select>
          </div>

          {/* 🔥 YEAR FILTER */}
          <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Select Year</label>
            <select
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* 🔥 SEARCH */}
          <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Search Employee</label>
            <input
              type="text"
              placeholder="Search by name..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 🔥 DEPARTMENT FILTER */}
          <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Department</label>
            <select
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Web Development">Web Development</option>
              <option value="Flutter">Flutter</option>
              <option value="Graphic Designer">Graphic Designer</option>
            </select>
          </div>

        </div>
      </div>

      {/* 🔥 SUMMARY CARD */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3">
            <h5>📊 Total Employees</h5>
            <h3>{filteredPayroll.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h5>💰 Total Salary Payout</h5>
            <h3>₹ {filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark p-3">
            <h5>📅 Month-Year</h5>
            <h3>{monthNames[selectedMonth]} {selectedYear}</h3>
          </div>
        </div>
      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow border-0 p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Half Day</th>
                <th>Leaves</th>
                <th>Performance</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.length > 0 ? (
                filteredPayroll.map((p) => (
                  <tr key={`${p.id}-${p.month}-${p.year}`}>
                    <td>{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.department || "N/A"}</td>
                    <td><span className="badge bg-success">{p.present}</span></td>
                    <td><span className="badge bg-danger">{p.absent}</span></td>
                    <td><span className="badge bg-warning text-dark">{p.halfDay}</span></td>
                    <td><span className="badge bg-info">{p.totalLeaves}</span></td>
                    <td>
                      {p.performance === "Excellent" && <span className="badge bg-success">Excellent</span>}
                      {p.performance === "Good" && <span className="badge bg-primary">Good</span>}
                      {p.performance === "Average" && <span className="badge bg-warning text-dark">Average</span>}
                      {p.performance === "Poor" && <span className="badge bg-danger">Poor</span>}
                    </td>
                    <td className="fw-bold text-success">
                      {p.netSalary === 0 ? <span className="text-danger">₹ 0</span> : `₹ ${p.netSalary.toLocaleString()}`}
                    </td>
                    <td>
                      <button className="btn btn-dark btn-sm" onClick={() => setSelectedEmployee(p)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    No payroll data found for {monthNames[selectedMonth]} {selectedYear}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 VIEW MODAL */}
      {selectedEmployee && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Salary Slip - {monthNames[selectedEmployee.month]} {selectedEmployee.year}</h4>
                <button className="btn-close" onClick={() => setSelectedEmployee(null)} />
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {selectedEmployee.name}</p>
                    <p><strong>Department:</strong> {selectedEmployee.department || "N/A"}</p>
                    <p><strong>Base Salary:</strong> ₹ {selectedEmployee.baseSalary.toLocaleString()}</p>
                    <p><strong>Performance:</strong> {selectedEmployee.performance}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Present:</strong> <span className="text-success">{selectedEmployee.present} days</span></p>
                    <p><strong>Absent:</strong> <span className="text-danger">{selectedEmployee.absent} days</span></p>
                    <p><strong>Half Day:</strong> <span className="text-warning">{selectedEmployee.halfDay} days</span></p>
                    <p><strong>Leaves Taken:</strong> {selectedEmployee.totalLeaves} days</p>
                    <p><strong>Total Hours Worked:</strong> {selectedEmployee.totalHours} hrs</p>
                  </div>
                </div>

                <table className="table table-bordered">
                  <tbody>
                    <tr><td>Basic Salary</td><td className="fw-bold">₹ {selectedEmployee.baseSalary.toLocaleString()}</td></tr>
                    <tr><td>Attendance Cut</td><td className="text-danger">- ₹ {selectedEmployee.attendanceCut.toLocaleString()}</td></tr>
                    <tr><td>Leave Cut</td><td className="text-danger">- ₹ {selectedEmployee.leaveCut.toLocaleString()}</td></tr>
                    <tr><td>PF (12%)</td><td className="text-danger">- ₹ {selectedEmployee.pf.toLocaleString()}</td></tr>
                    <tr><td>Professional Tax</td><td className="text-danger">- ₹ {selectedEmployee.professionalTax}</td></tr>
                    <tr className="table-secondary">
                      <td className="fw-bold">Total Deduction</td>
                      <td className="fw-bold text-danger">- ₹ {selectedEmployee.totalCut.toLocaleString()}</td>
                    </tr>
                    <tr className="table-success">
                      <td className="fw-bold">Net Salary</td>
                      <td className="fw-bold text-success">₹ {selectedEmployee.netSalary.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {selectedEmployee.netSalary === 0 && selectedEmployee.present === 0 && (
                  <div className="alert alert-danger mt-3">
                    ⚠️ This employee has <strong>no attendance records</strong> for this month. Salary is ₹ 0.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payroll