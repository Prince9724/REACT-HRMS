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

  const [salaryData, setSalaryData] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    totalCut: 0,
    netSalary: 0,
    totalLeaves: 0,
    pf: 0,
    professionalTax: 200,
    leaveCut: 0,
    attendanceCut: 0,
    performance: "Average"
  })

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

    return diff
  }

  // 🔥 LOAD USER
  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem("user")
      )

    setUser(data)

    if (!data) return

    fetchAttendance(data)
    fetchLeave(data)
    fetchSalarySlip(data)

  }, [])

  // 🔥 FETCH ATTENDANCE
  const fetchAttendance =
    async (data) => {

      try {

        const today =
          new Date().toLocaleDateString()

        const res = await axios.get(
          "http://localhost:3000/attendance"
        )

        const todayData =
          res.data.find(
            (a) =>
              a.userId === data.id &&
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

  // 🔥 FETCH LEAVE
  const fetchLeave =
    async (data) => {

      try {

        const res = await axios.get(
          "http://localhost:3000/leaves"
        )

        const myLeave =
          res.data.find(
            (l) =>
              l.userId === data.id
          )

        if (myLeave) {

          setLeaveStatus(
            myLeave.status
          )
        }

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 FETCH SALARY
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

        const myAttendance =
          attendanceRes.data.filter(
            (a) =>
              a.userId === data.id
          )

        const myLeaves =
          leaveRes.data.filter(
            (l) =>
              l.userId === data.id &&
              l.status === "approved"
          )

        let present = 0
        let absent = 0
        let halfDay = 0

        let attendanceCut = 0
        let leaveCut = 0

        myAttendance.forEach((a) => {

          if (
            a.checkIn === "Leave"
          ) {

            absent++

            attendanceCut +=
              data.salary / 30

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

          else if (hours >= 4) {

            halfDay++

            attendanceCut +=
              data.salary / 30 / 2
          }

          else {

            absent++

            attendanceCut +=
              data.salary / 30
          }
        })

        let totalLeaves = 0

        myLeaves.forEach((l) => {

          totalLeaves += l.days
        })

        // 🔥 FIRST LEAVE FREE
        if (totalLeaves > 1) {

          const extraLeaves =
            totalLeaves - 1

          leaveCut =
            extraLeaves *
            (data.salary / 30)
        }

        const pf =
          data.salary * 0.12

        const professionalTax = 200

        const totalCut =
          attendanceCut +
          leaveCut +
          pf +
          professionalTax

        const netSalary =
          data.salary - totalCut

        let performance = "Poor"

        if (present >= 26) {

          performance = "Excellent"
        }

        else if (present >= 22) {

          performance = "Good"
        }

        else if (present >= 18) {

          performance = "Average"
        }

        setSalaryData({
          present,
          absent,
          halfDay,
          totalCut:
            totalCut.toFixed(0),
          netSalary:
            netSalary.toFixed(0),
          totalLeaves,
          pf: pf.toFixed(0),
          professionalTax,
          leaveCut:
            leaveCut.toFixed(0),
          attendanceCut:
            attendanceCut.toFixed(0),
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

        const today =
          new Date().toLocaleDateString()

        const currentHour =
          new Date().getHours()

        if (currentHour >= 23) {

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

              fetchSalarySlip(user)
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
            "Already checked in"
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

        fetchSalarySlip(user)

        alert("Checked In Successfully")

      } catch (error) {

        console.log(error)
      }
    }

  // 🔥 CHECK OUT
  const handleCheckOut =
    async () => {

      try {

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
            "Please check in first"
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

        fetchSalarySlip(user)

        alert("Checked Out Successfully")

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
            "Please fill all fields"
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

        setLeaveStatus("pending")

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

  // 🔥 DOWNLOAD
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
      className="container-fluid p-4"
      style={{
        background: "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      {/* 🔥 PROFILE */}
      <div className="card shadow border-0 p-4 mb-4">

        <div className="row align-items-center">

          <div className="col-md-8">

            <h2 className="fw-bold mb-3">
              Welcome,
              {" "}
              {user.firstName}
            </h2>

            <p>📧 {user.email}</p>

            <p>📱 {user.contact}</p>

            <p>🏢 {user.department}</p>

            <p>💼 {user.role}</p>

          </div>

          <div className="col-md-4">

            <div
              className="p-4 rounded text-center text-white"
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#1e40af)"
              }}
            >

              <h1>
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

      {/* 🔥 ATTENDANCE */}
      <div className="card shadow border-0 p-4 mb-4">

        <h4 className="fw-bold mb-4">
          Attendance
        </h4>

        <div className="row align-items-center">

          <div className="col-md-6">

            <p>
              ✅ Check In:
              {" "}
              <b>
                {
                  checkInTime || "--"
                }
              </b>
            </p>

            <p>
              ❌ Check Out:
              {" "}
              <b>
                {
                  checkOutTime || "--"
                }
              </b>
            </p>

          </div>

          <div className="col-md-6 d-flex gap-2 flex-wrap">

            <button
              onClick={handleCheckIn}
              className="btn btn-success"
              disabled={checkInTime}
            >
              Check In
            </button>

            <button
              onClick={handleCheckOut}
              className="btn btn-danger"
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
      <div className="card shadow border-0 p-4 mb-4">

        <h4 className="fw-bold mb-4">
          Apply Leave
        </h4>

        <div className="row">

          <div className="col-md-6">

            <input
              type="text"
              placeholder="Leave Type"
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              className="form-control mb-3"
            />

          </div>

          <div className="col-md-6">

            <textarea
              placeholder="Reason"
              value={leaveReason}
              onChange={(e) =>
                setLeaveReason(
                  e.target.value
                )
              }
              className="form-control mb-3"
            />

          </div>

          <div className="col-md-6">

            <input
              type="date"
              value={start}
              onChange={(e) =>
                setStart(
                  e.target.value
                )
              }
              className="form-control mb-3"
            />

          </div>

          <div className="col-md-6">

            <input
              type="date"
              value={end}
              onChange={(e) =>
                setEnd(
                  e.target.value
                )
              }
              className="form-control mb-3"
            />

          </div>

        </div>

        <button
          onClick={handleLeaveApply}
          className="btn btn-primary"
        >
          Apply Leave
        </button>

        <p className="mt-3 fw-bold">
          Status:
          {" "}
          <span className="text-primary">
            {
              leaveStatus ||
              "No Request"
            }
          </span>
        </p>

      </div>

      {/* 🔥 SALARY */}
      <div className="card shadow border-0 p-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

          <div>

            <h3 className="fw-bold">
              Salary Slip
            </h3>

            <p className="text-muted">
              Monthly Payslip Details
            </p>

          </div>

          <div className="d-flex gap-2 flex-wrap">

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

            <div className="card border-0 shadow-sm p-3 text-center">

              <h6>
                Present
              </h6>

              <h3 className="text-success">
                {
                  salaryData.present
                }
              </h3>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm p-3 text-center">

              <h6>
                Absent
              </h6>

              <h3 className="text-danger">
                {
                  salaryData.absent
                }
              </h3>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm p-3 text-center">

              <h6>
                Half Day
              </h6>

              <h3 className="text-warning">
                {
                  salaryData.halfDay
                }
              </h3>

            </div>

          </div>

          <div className="col-md-3 mb-3">

            <div className="card border-0 shadow-sm p-3 text-center">

              <h6>
                Performance
              </h6>

              <h5 className="text-primary">
                {
                  salaryData.performance
                }
              </h5>

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

                <td className="fw-bold">
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

                <td className="text-danger fw-bold">
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
                  Extra Leave Deduction
                </td>

                <td className="text-danger fw-bold">
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
                  12% PF Deduction
                </td>

                <td className="text-danger fw-bold">
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

                <td className="text-danger fw-bold">
                  ₹ {
                    salaryData.professionalTax
                  }
                </td>

              </tr>

              <tr>

                <td>
                  Total Leaves
                </td>

                <td>
                  Approved Leaves
                </td>

                <td className="fw-bold">
                  {
                    salaryData.totalLeaves
                  }
                </td>

              </tr>

              <tr className="table-success">

                <td className="fw-bold">
                  Net Salary
                </td>

                <td className="fw-bold">
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

    </div>
  )
}

export default Profile