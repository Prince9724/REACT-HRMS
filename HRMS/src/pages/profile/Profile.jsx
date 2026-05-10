import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"

const Profile = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")

  const [leaveReason, setLeaveReason] = useState("")
  const [leaveStatus, setLeaveStatus] = useState("")

  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [type, setType] = useState("")

  const [attendanceHistory, setAttendanceHistory] = useState([])

  const [hasUsedFreeLeave, setHasUsedFreeLeave] = useState(false)

  const [salaryData, setSalaryData] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    sundayPaid: 0,
    totalLeaves: 0,
    attendanceCut: 0,
    leaveCut: 0,
    pf: 0,
    professionalTax: 200,
    totalCut: 0,
    netSalary: 0,
    performance: "Average"
  })

  // 🔥 TIME TO MINUTES
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

  // 🔥 HOURS CALCULATE
  const calculateHours = (
    checkIn,
    checkOut
  ) => {

    if (
      !checkIn ||
      !checkOut
    ) {
      return 0
    }

    if (
      checkOut === "Auto Checkout"
    ) {
      return 4
    }

    const inMinutes =
      convertToMinutes(checkIn)

    const outMinutes =
      convertToMinutes(checkOut)

    let diff =
      (outMinutes - inMinutes) / 60

    if (
      diff < 0 ||
      isNaN(diff)
    ) {
      return 0
    }

    // 🔥 1 HOUR BREAK
    diff = diff - 1

    if (diff > 8) {
      diff = 8
    }

    return diff
  }

  // 🔥 SUNDAY CHECK
  const isSunday = (date) => {

    const day =
      new Date(date).getDay()

    return day === 0
  }

  // 🔥 LOAD USER
  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("user")
      )

    if (!data) return

    setUser(data)

    fetchAttendance(data)
    fetchSalarySlip(data)
    checkFreeLeave(data.id)

  }, [])

  // 🔥 FREE LEAVE CHECK
  const checkFreeLeave =
    async (id) => {

      try {

        const res =
          await axios.get(
            "http://localhost:3000/leaves"
          )

        const used =
          res.data.find(
            (l) =>
              l.userId === id &&
              l.type === "free" &&
              l.status === "approved"
          )

        setHasUsedFreeLeave(
          !!used
        )

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 FETCH ATTENDANCE
  // 🔥 FETCH ATTENDANCE
  const fetchAttendance =
    async (data) => {

      try {

        const today =
          new Date().toLocaleDateString()

        const res =
          await axios.get(
            "http://localhost:3000/attendance"
          )

        // 🔥 ONLY CURRENT MONTH HISTORY
        const currentMonth =
          new Date().getMonth()

        const currentYear =
          new Date().getFullYear()

        const myAttendance =
          res.data.filter((a) => {

            if (
              a.userId !== data.id
            ) {
              return false
            }

            const attendanceDate =
              new Date(a.date)

            return (
              attendanceDate.getMonth() === currentMonth &&
              attendanceDate.getFullYear() === currentYear
            )
          })

        // 🔥 LATEST FIRST
        setAttendanceHistory(
          myAttendance.reverse()
        )

        // 🔥 TODAY ATTENDANCE
        const todayData =
          myAttendance.find(
            (a) =>
              a.date === today
          )

        if (todayData) {

          setCheckInTime(
            todayData.checkIn
          )

          setCheckOutTime(
            todayData.checkOut
          )
        }

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 SALARY LOGIC
  const fetchSalarySlip =
    async (data) => {

      try {

        const attendanceRes =
          await axios.get(
            "http://localhost:3000/attendance"
          )

        const leaveRes =
          await axios.get(
            "http://localhost:3000/leaves"
          )

        const currentMonth =
          new Date().getMonth()

        const currentYear =
          new Date().getFullYear()

        const myAttendance =
          attendanceRes.data.filter(
            (a) => {

              if (
                a.userId !== data.id
              ) {
                return false
              }

              const d =
                new Date(a.date)

              return (
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear
              )
            }
          )

        const myLeaves =
          leaveRes.data.filter(
            (l) => {

              if (
                l.userId !== data.id ||
                l.status !== "approved"
              ) {
                return false
              }

              const d =
                new Date(l.start)

              return (
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear
              )
            }
          )

        let present = 0
        let absent = 0
        let halfDay = 0
        let sundayPaid = 0

        let attendanceCut = 0
        let leaveCut = 0

        const perDaySalary =
          data.salary / 30

        myAttendance.forEach((a) => {

          // 🔥 SUNDAY
          if (
            isSunday(a.date)
          ) {

            sundayPaid++
            present++

            return
          }

          const hours =
            calculateHours(
              a.checkIn,
              a.checkOut
            )

          if (hours >= 8) {

            present++
          }

          else if (
            hours >= 4
          ) {

            halfDay++

            attendanceCut +=
              perDaySalary / 2
          }

          else {

            absent++

            attendanceCut +=
              perDaySalary
          }
        })

        let totalLeaves = 0
        let paidLeaves = 0

        myLeaves.forEach((l) => {

          totalLeaves +=
            Number(l.days)

          if (
            l.type === "paid"
          ) {

            paidLeaves +=
              Number(l.days)
          }
        })

        if (paidLeaves > 0) {

          leaveCut =
            paidLeaves *
            perDaySalary
        }

        const pf =
          data.salary * 0.12

        const professionalTax =
          200

        const totalCut =
          attendanceCut +
          leaveCut +
          pf +
          professionalTax

        let netSalary =
          data.salary -
          totalCut

        if (netSalary < 0) {
          netSalary = 0
        }

        let performance =
          "Poor"

        if (present >= 26) {

          performance =
            "Excellent"
        }

        else if (
          present >= 20
        ) {

          performance =
            "Good"
        }

        else if (
          present >= 15
        ) {

          performance =
            "Average"
        }

        setSalaryData({

          present,
          absent,
          halfDay,
          sundayPaid,

          totalLeaves,

          attendanceCut:
            attendanceCut.toFixed(0),

          leaveCut:
            leaveCut.toFixed(0),

          pf:
            pf.toFixed(0),

          professionalTax,

          totalCut:
            totalCut.toFixed(0),

          netSalary:
            netSalary.toFixed(0),

          performance
        })

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 AUTO CHECKOUT
  useEffect(() => {

    if (!user) return

    const autoCheckout =
      async () => {

        const currentHour =
          new Date().getHours()

        const today =
          new Date().toLocaleDateString()

        if (currentHour >= 18) {

          try {

            const res =
              await axios.get(
                "http://localhost:3000/attendance"
              )

            const record =
              res.data.find(
                (a) =>
                  a.userId === user.id &&
                  a.date === today
              )

            if (
              record &&
              record.checkIn &&
              !record.checkOut
            ) {

              await axios.patch(
                `http://localhost:3000/attendance/${record.id}`,
                {
                  checkOut:
                    "Auto Checkout"
                }
              )

              setCheckOutTime(
                "Auto Checkout"
              )

            }

          } catch (error) {

            console.log(error)
          }
        }
      }

    autoCheckout()

  }, [user])

  // 🔥 CHECK IN
  const handleCheckIn =
    async () => {

      try {

        const currentHour =
          new Date().getHours()

        const day =
          new Date().getDay()

        // 🔥 SUNDAY CLOSED
        if (day === 0) {

          alert(
            "Office Closed On Sunday"
          )

          return
        }

        if (currentHour < 9) {

          alert(
            "Office opens at 9 AM"
          )

          return
        }

        const time =
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })

        const today =
          new Date().toLocaleDateString()

        const res =
          await axios.get(
            "http://localhost:3000/attendance"
          )

        const already =
          res.data.find(
            (a) =>
              a.userId === user.id &&
              a.date === today
          )

        if (already) {

          alert(
            "Already Checked In"
          )

          return
        }

        await axios.post(
          "http://localhost:3000/attendance",
          {
            userId: user.id,
            name: user.firstName,
            contact: user.contact,
            department:
              user.department,
            salary: user.salary,
            date: today,
            checkIn: time,
            checkOut: ""
          }
        )

        setCheckInTime(time)

        fetchAttendance(user)
        fetchSalarySlip(user)

        alert(
          "Checked In Successfully"
        )

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 CHECK OUT
  const handleCheckOut =
    async () => {

      try {

        const currentHour =
          new Date().getHours()

        if (currentHour < 18) {

          alert(
            "Checkout allowed after 6 PM"
          )

          return
        }

        const time =
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })

        const today =
          new Date().toLocaleDateString()

        const res =
          await axios.get(
            "http://localhost:3000/attendance"
          )

        const record =
          res.data.find(
            (a) =>
              a.userId === user.id &&
              a.date === today
          )

        if (!record) {

          alert(
            "Please Check In First"
          )

          return
        }

        await axios.patch(
          `http://localhost:3000/attendance/${record.id}`,
          {
            checkOut: time
          }
        )

        setCheckOutTime(time)

        fetchAttendance(user)
        fetchSalarySlip(user)

        alert(
          "Checked Out Successfully"
        )

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 APPLY LEAVE
  const handleLeaveApply =
    async () => {

      try {

        if (
          !start ||
          !end ||
          !type
        ) {

          alert(
            "Fill all fields"
          )

          return
        }

        if (
          type === "free" &&
          hasUsedFreeLeave
        ) {

          alert(
            "Free Leave Already Used"
          )

          return
        }

        const days =
          (
            new Date(end) -
            new Date(start)
          ) /
          (
            1000 *
            60 *
            60 *
            24
          ) + 1

        await axios.post(
          "http://localhost:3000/leaves",
          {
            userId: user.id,
            name: user.firstName,
            contact: user.contact,
            reason: leaveReason,
            type,
            start,
            end,
            days,
            status: "pending"
          }
        )

        setLeaveStatus(
          "pending"
        )

        setLeaveReason("")
        setStart("")
        setEnd("")
        setType("")

        alert(
          "Leave Applied Successfully"
        )

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 PRINT
  const downloadSalarySlip =
    () => {

      window.print()
    }

  if (!user) {

    return (
      <h3 className="text-center mt-5">
        No User Logged In
      </h3>
    )
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

      {/* 🔥 HEADER */}
      <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">

        <div
          className="p-5 text-white"
          style={{
            background:
              "linear-gradient(135deg,#0f172a,#1e293b)"
          }}
        >

          <div className="row align-items-center">

            <div className="col-md-8">

              <h1 className="fw-bold">
                Welcome,
                {" "}
                {user.firstName}
              </h1>

              <p className="mb-1">
                📧 {user.email}
              </p>

              <p className="mb-1">
                📱 {user.contact}
              </p>

              <p className="mb-1">
                🏢 {user.department}
              </p>

              <p className="mb-0">
                💼 {user.role}
              </p>

            </div>

            <div className="col-md-4">

              <div className="bg-white text-dark rounded-4 p-4 text-center shadow">

                <h1 className="fw-bold text-success">
                  ₹
                  {
                    salaryData.netSalary
                  }
                </h1>

                <h5>
                  Net Salary
                </h5>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 🔥 ATTENDANCE */}
      <div className="card border-0 shadow rounded-4 p-4 mb-4">

        <h3 className="fw-bold mb-4">
          Attendance
        </h3>

        <div className="row align-items-center">

          <div className="col-md-6">

            <h5 className="mb-3">
              ✅ Check In:
              {" "}
              <span className="text-success">
                {
                  checkInTime || "--"
                }
              </span>
            </h5>

            <h5>
              ❌ Check Out:
              {" "}
              <span className="text-danger">
                {
                  checkOutTime || "--"
                }
              </span>
            </h5>

          </div>

          <div className="col-md-6 d-flex gap-3 flex-wrap">

            <button
              className="btn btn-success px-4 py-2"
              onClick={handleCheckIn}
              disabled={checkInTime}
            >
              Check In
            </button>

            <button
              className="btn btn-danger px-4 py-2"
              onClick={handleCheckOut}
              disabled={
                !checkInTime ||
                checkOutTime
              }
            >
              Check Out
            </button>

          </div>

        </div>

      </div>

      {/* 🔥 LEAVE */}
      <div className="card border-0 shadow rounded-4 p-4 mb-4">

        <h3 className="fw-bold mb-4">
          Apply Leave
        </h3>

        {hasUsedFreeLeave && (

          <div className="alert alert-warning">

            Free Leave Already Used.
            Only Paid Leave Available.

          </div>
        )}

        <div className="row">

          <div className="col-md-6 mb-3">

            <select
              className="form-select"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Leave Type
              </option>

              {
                !hasUsedFreeLeave && (

                  <option value="free">
                    Free Leave
                  </option>
                )
              }

              <option value="paid">
                Paid Leave
              </option>

            </select>

          </div>

          <div className="col-md-6 mb-3">

            <textarea
              className="form-control"
              placeholder="Reason"
              value={leaveReason}
              onChange={(e) =>
                setLeaveReason(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-6 mb-3">

            <input
              type="date"
              className="form-control"
              value={start}
              onChange={(e) =>
                setStart(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-6 mb-3">

            <input
              type="date"
              className="form-control"
              value={end}
              onChange={(e) =>
                setEnd(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <button
          className="btn btn-primary px-4"
          onClick={handleLeaveApply}
        >
          Apply Leave
        </button>

        <h6 className="mt-3">

          Status:
          {" "}
          <span className="text-primary">
            {
              leaveStatus ||
              "No Request"
            }
          </span>

        </h6>

      </div>

      {/* 🔥 SALARY */}
      <div className="card border-0 shadow rounded-4 p-4 mb-4">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

          <div>

            <h2 className="fw-bold">
              Salary Slip
            </h2>

            <p className="text-muted">
              Monthly Salary Details
            </p>

          </div>

          <div className="d-flex gap-2">

            <button
              className="btn btn-dark"
              onClick={
                downloadSalarySlip
              }
            >
              Download Slip
            </button>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/salary-history"
                )
              }
            >
              Salary History
            </button>

          </div>

        </div>

        {/* 🔥 SUMMARY */}
        <div className="row mb-4">

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">

              <h6>
                Present
              </h6>

              <h2 className="text-success">
                {
                  salaryData.present
                }
              </h2>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">

              <h6>
                Absent
              </h6>

              <h2 className="text-danger">
                {
                  salaryData.absent
                }
              </h2>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">

              <h6>
                Half Day
              </h6>

              <h2 className="text-warning">
                {
                  salaryData.halfDay
                }
              </h2>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">

              <h6>
                Sunday Paid
              </h6>

              <h2 className="text-info">
                {
                  salaryData.sundayPaid
                }
              </h2>

            </div>

          </div>

        </div>

        {/* 🔥 TABLE */}
        <div className="table-responsive">

          <table className="table table-bordered align-middle">

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
                  ₹ {user.salary}
                </td>
              </tr>

              <tr>
                <td>
                  Attendance Cut
                </td>

                <td>
                  Absent / Half Day
                </td>

                <td className="text-danger">
                  ₹ {
                    salaryData.attendanceCut
                  }
                </td>
              </tr>

              <tr>
                <td>
                  Leave Cut
                </td>

                <td>
                  Paid Leave
                </td>

                <td className="text-danger">
                  ₹ {
                    salaryData.leaveCut
                  }
                </td>
              </tr>

              <tr>
                <td>
                  PF
                </td>

                <td>
                  12% PF
                </td>

                <td className="text-danger">
                  ₹ {
                    salaryData.pf
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
                  ₹ {
                    salaryData.professionalTax
                  }
                </td>
              </tr>

              <tr className="table-secondary">

                <td className="fw-bold">
                  Total Deduction
                </td>

                <td>
                  Total Cuts
                </td>

                <td className="fw-bold text-danger">
                  ₹ {
                    salaryData.totalCut
                  }
                </td>

              </tr>

              <tr className="table-success">

                <td className="fw-bold">
                  Net Salary
                </td>

                <td>
                  Final Salary
                </td>

                <td className="fw-bold text-success">
                  ₹ {
                    salaryData.netSalary
                  }
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* 🔥 ATTENDANCE HISTORY */}
      <div className="card border-0 shadow rounded-4 p-4">

        <h3 className="fw-bold mb-4">
          Attendance History
        </h3>

        <div className="table-responsive">

          <table className="table table-hover align-middle">

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

              </tr>

            </thead>

            <tbody>

              {
                attendanceHistory.map(
                  (a, index) => {

                    const hours =
                      calculateHours(
                        a.checkIn,
                        a.checkOut
                      )

                    let status =
                      "Absent"

                    if (
                      isSunday(a.date)
                    ) {

                      status =
                        "Sunday Paid"
                    }

                    else if (
                      hours >= 8
                    ) {

                      status =
                        "Present"
                    }

                    else if (
                      hours >= 4
                    ) {

                      status =
                        "Half Day"
                    }

                    return (

                      <tr key={index}>

                        <td>
                          {a.date}
                        </td>

                        <td>
                          {a.checkIn}
                        </td>

                        <td>
                          {a.checkOut || "--"}
                        </td>

                        <td>
                          {hours}
                        </td>

                        <td>

                          {
                            status ===
                            "Present" && (

                              <span className="badge bg-success">
                                Present
                              </span>
                            )
                          }

                          {
                            status ===
                            "Half Day" && (

                              <span className="badge bg-warning text-dark">
                                Half Day
                              </span>
                            )
                          }

                          {
                            status ===
                            "Absent" && (

                              <span className="badge bg-danger">
                                Absent
                              </span>
                            )
                          }

                          {
                            status ===
                            "Sunday Paid" && (

                              <span className="badge bg-info">
                                Sunday Paid
                              </span>
                            )
                          }

                        </td>

                      </tr>
                    )
                  }
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Profile