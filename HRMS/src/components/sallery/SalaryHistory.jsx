import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"

const SalaryHistory = () => {

  const [user, setUser] = useState(null)

  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])

  const [selectedMonth, setSelectedMonth] = useState("2026-04")

  // 🔥 GET USER
  useEffect(() => {

    const data = JSON.parse(
      localStorage.getItem("user")
    )

    setUser(data)

    if (data) {
      fetchData(data)
    }

  }, [])

  // 🔥 FETCH DATA
  const fetchData = async (data) => {

    try {

      const attendanceRes =
        await axios.get(
          "http://localhost:3000/attendance"
        )

      const leaveRes =
        await axios.get(
          "http://localhost:3000/leaves"
        )

      const myAttendance =
        attendanceRes.data.filter(
          (a) =>
            a.userId === data.id
        )

      const myLeaves =
        leaveRes.data.filter(
          (l) =>
            l.userId === data.id
        )

      setAttendance(myAttendance)
      setLeaves(myLeaves)

    } catch (error) {

      console.log(error)
    }
  }

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (
      !time ||
      time === "Auto Checkout" ||
      time === "Leave"
    ) {
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

    if (checkOut === "Auto Checkout") {
      return 4
    }

    if (!checkOut) return 0

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

    return Number(diff.toFixed(1))
  }

  // 🔥 MONTH FILTER
  const monthlyAttendance = useMemo(() => {

    return attendance.filter((a) => {

      const [month, day, year] =
        a.date.split("/")

      const formatted =
        `${year}-${month.padStart(2, "0")}`

      return formatted === selectedMonth
    })

  }, [attendance, selectedMonth])

  // 🔥 MONTH LEAVES
  const monthlyLeaves = useMemo(() => {

    return leaves.filter((l) => {

      return l.start.includes(
        selectedMonth
      )
    })

  }, [leaves, selectedMonth])

  // 🔥 SALARY REPORT
  // 🔥 SALARY REPORT
const salaryReport = useMemo(() => {

  if (!user) return null

  // 🔥 CURRENT MONTH TOTAL DAYS
  const [year, month] = selectedMonth.split("-")

  const totalDaysInMonth =
    new Date(year, month, 0).getDate()

  // 🔥 IF NO ATTENDANCE RECORD
  // FULL SALARY CUT
  if (monthlyAttendance.length === 0) {

    return {
      present: 0,
      absent: totalDaysInMonth,
      halfDay: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
      attendanceCut: user.salary,
      leaveCut: 0,
      pf: 0,
      professionalTax: 0,
      totalCut: user.salary,
      netSalary: 0
    }
  }

  let present = 0
  let absent = 0
  let halfDay = 0

  let attendanceCut = 0
  let leaveCut = 0

  let paidLeaves = 0
  let unpaidLeaves = 0

  const salaryPerDay =
    user.salary / totalDaysInMonth

  // 🔥 PRESENT ATTENDANCE DAYS
  const attendedDates = []

  monthlyAttendance.forEach((a) => {

    attendedDates.push(a.date)

    if (a.checkIn === "Leave") {

      absent++

      attendanceCut += salaryPerDay

      return
    }

    const hours =
      calculateHours(
        a.checkIn,
        a.checkOut
      )

    // ✅ PRESENT
    if (hours >= 8) {

      present++
    }

    // ⚠️ HALF DAY
    else if (hours >= 4) {

      halfDay++

      attendanceCut +=
        salaryPerDay / 2
    }

    // ❌ ABSENT
    else {

      absent++

      attendanceCut +=
        salaryPerDay
    }
  })

  // 🔥 MISSING DAYS = ABSENT
  const missingDays =
    totalDaysInMonth -
    monthlyAttendance.length

  if (missingDays > 0) {

    absent += missingDays

    attendanceCut +=
      missingDays * salaryPerDay
  }

  // 🔥 LEAVES
  monthlyLeaves.forEach((l, index) => {

    // ✅ FIRST LEAVE FREE
    if (index === 0) {

      paidLeaves += l.days
    }

    // ❌ EXTRA LEAVE CUT
    else {

      unpaidLeaves += l.days

      leaveCut +=
        l.days * salaryPerDay
    }
  })

  // 🔥 PF
  const pf =
    user.salary * 0.12

  // 🔥 TAX
  const professionalTax = 200

  // 🔥 TOTAL CUT
  let totalCut =
    attendanceCut +
    leaveCut +
    pf +
    professionalTax

  // 🔥 NET SALARY
  let netSalary =
    user.salary - totalCut

  // 🔥 NO NEGATIVE SALARY
  if (netSalary < 0) {
    netSalary = 0
  }

  if (totalCut > user.salary) {
    totalCut = user.salary
  }

  return {
    present,
    absent,
    halfDay,
    paidLeaves,
    unpaidLeaves,
    attendanceCut,
    leaveCut,
    pf,
    professionalTax,
    totalCut,
    netSalary
  }

}, [
  monthlyAttendance,
  monthlyLeaves,
  user,
  selectedMonth
])
  

  // 🔥 DOWNLOAD
  const handleDownload = () => {

    window.print()
  }

  if (!user) {

    return (
      <h2>
        No User Found
      </h2>
    )
  }

  return (

    <div
      className="container-fluid p-4"
      style={{
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >

      {/* 🔥 HEADER */}
      <div className="card shadow border-0 p-4 mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>

            <h2 className="fw-bold mb-1">
              Salary History
            </h2>

            <p className="text-muted">
              Complete monthly salary records
            </p>

          </div>

          <div className="d-flex gap-2">

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="form-control"
            />

            <button
              className="btn btn-dark"
              onClick={handleDownload}
            >
              Download Slip
            </button>

          </div>

        </div>

      </div>

      {/* 🔥 USER INFO */}
      <div className="card shadow border-0 p-4 mb-4">

        <div className="row">

          <div className="col-md-6">

            <h4>
              {user.firstName}
            </h4>

            <p>
              📧 {user.email}
            </p>

            <p>
              📱 {user.contact}
            </p>

          </div>

          <div className="col-md-6">

            <p>
              Department:
              <b>
                {" "}
                {user.department}
              </b>
            </p>

            <p>
              Salary:
              <b>
                {" "}
                ₹{user.salary}
              </b>
            </p>

            <p>
              Month:
              <b>
                {" "}
                {selectedMonth}
              </b>
            </p>

          </div>

        </div>

      </div>

      {/* 🔥 SUMMARY */}
      {
        salaryReport && (

          <div className="row mb-4">

            <div className="col-md-3 mb-3">

              <div className="card shadow border-0 p-3 text-center">

                <h6>
                  Net Salary
                </h6>

                <h3 className="text-success">
                  ₹{
                    salaryReport.netSalary.toFixed(0)
                  }
                </h3>

              </div>

            </div>

            <div className="col-md-3 mb-3">

              <div className="card shadow border-0 p-3 text-center">

                <h6>
                  Total Cut
                </h6>

                <h3 className="text-danger">
                  ₹{
                    salaryReport.totalCut.toFixed(0)
                  }
                </h3>

              </div>

            </div>

            <div className="col-md-3 mb-3">

              <div className="card shadow border-0 p-3 text-center">

                <h6>
                  Present Days
                </h6>

                <h3>
                  {
                    salaryReport.present
                  }
                </h3>

              </div>

            </div>

            <div className="col-md-3 mb-3">

              <div className="card shadow border-0 p-3 text-center">

                <h6>
                  Half Days
                </h6>

                <h3 className="text-warning">
                  {
                    salaryReport.halfDay
                  }
                </h3>

              </div>

            </div>

          </div>
        )
      }

      {/* 🔥 DEDUCTION TABLE */}
      {
        salaryReport && (

          <div className="card shadow border-0 p-4 mb-4">

            <h4 className="fw-bold mb-4">
              Salary Breakdown
            </h4>

            <table className="table table-bordered">

              <thead className="table-dark">

                <tr>

                  <th>
                    Type
                  </th>

                  <th>
                    Details
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>
                    Basic Salary
                  </td>

                  <td>
                    Monthly Salary
                  </td>

                  <td>
                    ₹{user.salary}
                  </td>

                </tr>

                <tr>

                  <td>
                    Attendance Cut
                  </td>

                  <td>
                    Absent + Half Day Deduction
                  </td>

                  <td className="text-danger">
                    ₹{
                      salaryReport.attendanceCut.toFixed(0)
                    }
                  </td>

                </tr>

                <tr>

                  <td>
                    Leave Deduction
                  </td>

                  <td>
                    Extra Unpaid Leaves
                  </td>

                  <td className="text-danger">
                    ₹{
                      salaryReport.leaveCut.toFixed(0)
                    }
                  </td>

                </tr>

                <tr>

                  <td>
                    PF
                  </td>

                  <td>
                    12% PF Deduction
                  </td>

                  <td className="text-danger">
                    ₹{
                      salaryReport.pf.toFixed(0)
                    }
                  </td>

                </tr>

                <tr>

                  <td>
                    Professional Tax
                  </td>

                  <td>
                    Government Tax
                  </td>

                  <td className="text-danger">
                    ₹{
                      salaryReport.professionalTax
                    }
                  </td>

                </tr>

                <tr>

                  <td>
                    Paid Leaves
                  </td>

                  <td>
                    Free Leaves
                  </td>

                  <td className="text-success">
                    {
                      salaryReport.paidLeaves
                    } Days
                  </td>

                </tr>

                <tr>

                  <td>
                    Unpaid Leaves
                  </td>

                  <td>
                    Salary Cut Leaves
                  </td>

                  <td className="text-danger">
                    {
                      salaryReport.unpaidLeaves
                    } Days
                  </td>

                </tr>

                <tr>

                  <td className="fw-bold">
                    Net Salary
                  </td>

                  <td className="fw-bold">
                    Final Salary
                  </td>

                  <td className="fw-bold text-success">
                    ₹{
                      salaryReport.netSalary.toFixed(0)
                    }
                  </td>

                </tr>

              </tbody>

            </table>

          </div>
        )
      }

      {/* 🔥 ATTENDANCE HISTORY */}
      <div className="card shadow border-0 p-4">

        <h4 className="fw-bold mb-4">
          Monthly Attendance History
        </h4>

        <div className="table-responsive">

          <table className="table table-hover table-bordered">

            <thead className="table-dark">
              <tr>
                <th>
                  Date
                </th>

                <th>
                  Check In
                </th>

                <th>
                  Check Out
                </th>

                <th>
                  Hours
                </th>

                <th>
                  Status
                </th>

                <th>
                  Salary Cut
                </th>

              </tr>

            </thead>

            <tbody>

              {
                monthlyAttendance.length > 0

                  ? (

                    monthlyAttendance.map((a) => {

                      const hours =
                        calculateHours(
                          a.checkIn,
                          a.checkOut
                        )

                      let status = "Absent"
                      let cut = user.salary / 30

                      if (hours >= 8) {

                        status = "Present"
                        cut = 0
                      }

                      else if (hours >= 4) {

                        status = "Half Day"
                        cut =
                          user.salary / 30 / 2
                      }

                      return (

                        <tr key={a.id}>

                          <td>
                            {a.date}
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
                            {hours.toFixed(1)} hrs
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
                            ₹{cut.toFixed(0)}
                          </td>

                        </tr>
                      )
                    })
                  )

                  : (

                    <tr>

                      <td
                        colSpan="6"
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

export default SalaryHistory
