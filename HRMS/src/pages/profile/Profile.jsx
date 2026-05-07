import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {

  const [user, setUser] = useState(null)

  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")

  const [leaveReason, setLeaveReason] = useState("")
  const [leaveStatus, setLeaveStatus] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [type, setType] = useState("")

  // 🔥 Salary Info
  const [salaryInfo, setSalaryInfo] = useState({
    perHour: 0,
    workedHours: 0,
    todayEarning: 0,
    pfCut: 0,
    finalSalary: 0,
    halfDayCut: false,
    cutReason: ""
  })

  // 🔥 TIME CONVERT
  const convertTime = (timeStr) => {

    if (!timeStr || timeStr === "Auto Checkout") return null

    return new Date(`1970-01-01 ${timeStr}`)
  }

  // 🔥 HOURS CALCULATION
  const calculateHours = (checkIn, checkOut) => {

    const start = convertTime(checkIn)
    const end = convertTime(checkOut)

    if (!start || !end) return 0

    const diff = (end - start) / (1000 * 60 * 60)

    return diff > 0 ? diff : 0
  }

  useEffect(() => {

    const data = JSON.parse(localStorage.getItem("user"))

    setUser(data)

    const fetchAttendance = async () => {

      const today = new Date().toLocaleDateString()

      const res = await axios.get("http://localhost:3000/attendance")

      const todayData = res.data.find(
        (a) => a.userId === data?.id && a.date === today
      )

      // 🔥 AUTO CHECKOUT SYSTEM
      if (
        todayData &&
        todayData.checkIn &&
        !todayData.checkOut
      ) {

        const now = new Date()
        const currentHour = now.getHours()

        // 🔥 AFTER 12 AM AUTO CHECKOUT
        if (currentHour >= 0) {

          await axios.patch(
            `http://localhost:3000/attendance/${todayData.id}`,
            {
              checkOut: "Auto Checkout",
              halfDayCut: true,
              cutReason: "Forgot to checkout"
            }
          )

          todayData.checkOut = "Auto Checkout"
          todayData.halfDayCut = true
          todayData.cutReason = "Forgot to checkout"
        }
      }

      if (todayData) {

        setCheckInTime(todayData.checkIn)
        setCheckOutTime(todayData.checkOut)

        // 🔥 HALF DAY CUT
        if (todayData.halfDayCut) {

          const perDay = data.salary / 30
          const halfCut = perDay / 2

          setSalaryInfo((prev) => ({
            ...prev,
            halfDayCut: true,
            cutReason: todayData.cutReason,
            todayEarning: 0,
            finalSalary: (perDay - halfCut).toFixed(2)
          }))
        }
      }
    }

    const fetchLeave = async () => {

      const res = await axios.get("http://localhost:3000/leaves")

      const myLeave = res.data.find(
        l => l.userId === data?.id
      )

      if (myLeave) {
        setLeaveStatus(myLeave.status)
      }
    }

    fetchAttendance()
    fetchLeave()

  }, [])

  // 🔥 SALARY CALCULATION
  useEffect(() => {

    if (!user || !checkInTime || !checkOutTime) return

    // 🔥 AUTO CHECKOUT CASE
    if (checkOutTime === "Auto Checkout") {

      const perDay = user.salary / 30
      const halfCut = perDay / 2

      setSalaryInfo((prev) => ({
        ...prev,
        perHour: (perDay / 8).toFixed(2),
        workedHours: "0.00",
        todayEarning: "0.00",
        pfCut: ((user.salary * 12) / 100 / 30).toFixed(2),
        finalSalary: (perDay - halfCut).toFixed(2),
        halfDayCut: true,
        cutReason: "Forgot to checkout"
      }))

      return
    }

    const perDay = user.salary / 30

    const perHour = perDay / 8

    const hours = calculateHours(
      checkInTime,
      checkOutTime
    )

    const earning = hours * perHour

    // 🔥 PF CUT 12%
    const pfCut = (user.salary * 12) / 100 / 30

    const finalSalary = earning - pfCut

    setSalaryInfo({
      perHour: perHour.toFixed(2),
      workedHours: hours.toFixed(2),
      todayEarning: earning.toFixed(2),
      pfCut: pfCut.toFixed(2),
      finalSalary: finalSalary.toFixed(2),
      halfDayCut: false,
      cutReason: ""
    })

  }, [checkOutTime, user])

  if (!user) return <h3>No user logged in</h3>

  // 🔥 CHECK IN
  const handleCheckIn = async () => {

    const time = new Date().toLocaleTimeString()

    const today = new Date().toLocaleDateString()

    const res = await axios.get(
      "http://localhost:3000/attendance"
    )

    const already = res.data.find(
      a => a.userId === user.id && a.date === today
    )

    if (already) {
      alert("Already checked in")
      return
    }

    await axios.post(
      "http://localhost:3000/attendance",
      {
        userId: user.id,
        name: user.firstName,
        contact: user.contact,
        department: user.department,
        salary: user.salary,
        date: today,
        checkIn: time,
        checkOut: ""
      }
    )

    setCheckInTime(time)
  }

  // 🔥 CHECK OUT
  const handleCheckOut = async () => {

    const time = new Date().toLocaleTimeString()

    const today = new Date().toLocaleDateString()

    const res = await axios.get(
      "http://localhost:3000/attendance"
    )

    const record = res.data.find(
      a => a.userId === user.id && a.date === today
    )

    if (!record) {
      alert("Please check in first")
      return
    }

    // 🔥 ALREADY CHECKOUT CONDITION
    if (record.checkOut) {
      alert("Already checked out")
      return
    }

    await axios.patch(
      `http://localhost:3000/attendance/${record.id}`,
      {
        checkOut: time
      }
    )

    setCheckOutTime(time)
  }

  // 🔥 APPLY LEAVE
  const handleLeaveApply = async () => {

    if (!start || !end || !type) {
      alert("Please fill all fields")
      return
    }

    const days =
      (new Date(end) - new Date(start)) /
      (1000 * 60 * 60 * 24) + 1

    await axios.post(
      "http://localhost:3000/leaves",
      {
        userId: user.id,
        name: user.firstName,
        contact: user.contact,
        reason: leaveReason,
        type: type,
        start: start,
        end: end,
        days: days,
        status: "pending"
      }
    )

    setLeaveStatus("pending")

    setLeaveReason("")
    setStart("")
    setEnd("")
    setType("")
  }

  return (

    <div
      className="container mt-4"
      style={{
        height: "100vh",
        overflowY: "auto"
      }}
    >

      {/* 🔥 PROFILE */}
      <div className="card p-4 shadow-sm mb-4">

        <h3 className="text-primary">
          {user.role}
        </h3>

        <p>
          <strong>Name:</strong>
          {" "}
          {user.firstName} {user.lastName}
        </p>

        <p>
          <strong>Email:</strong>
          {" "}
          {user.email}
        </p>

        <p>
          <strong>Contact:</strong>
          {" "}
          {user.contact}
        </p>

        <p>
          <strong>Department:</strong>
          {" "}
          {user.department}
        </p>

        <p>
          <strong>Salary:</strong>
          {" "}
          ₹ {user.salary}
        </p>

        <p>
          <strong>Age:</strong>
          {" "}
          {user.age}
        </p>

        <p>
          <strong>Birthdate:</strong>
          {" "}
          {user.birthdate}
        </p>

        <p>
          <strong>Joining Date:</strong>
          {" "}
          {user.joiningDate}
        </p>

      </div>

      {/* 🔥 ATTENDANCE */}
      <div className="card p-4 mb-3">

        <h5>Attendance</h5>

        <p>
          Check In:
          {" "}
          {checkInTime || "--"}
        </p>

        <p>
          Check Out:
          {" "}
          {checkOutTime || "--"}
        </p>

        <button
          onClick={handleCheckIn}
          className="btn btn-success me-2"
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          className="btn btn-danger"
        >
          Check Out
        </button>

        {/* 🔥 SALARY */}
        <div className="mt-4">

          <h5>Salary Details</h5>

          <p>
            Per Hour Salary:
            {" "}
            ₹ {salaryInfo.perHour}
          </p>

          <p>
            Worked Hours:
            {" "}
            {salaryInfo.workedHours}
          </p>

          <p>
            Today Earning:
            {" "}
            ₹ {salaryInfo.todayEarning}
          </p>

          <p className="text-danger">
            PF Cut (12%):
            {" "}
            ₹ {salaryInfo.pfCut}
          </p>

          <p className="fw-bold text-success">
            Final Salary:
            {" "}
            ₹ {salaryInfo.finalSalary}
          </p>

          {/* 🔥 HALF DAY WARNING */}
          {
            salaryInfo.halfDayCut && (
              <div className="alert alert-danger mt-3">

                <h6>
                  ⚠ Half Day Salary Cut
                </h6>

                <p>
                  Reason:
                  {" "}
                  {salaryInfo.cutReason}
                </p>

              </div>
            )
          }

        </div>

      </div>

      {/* 🔥 LEAVE */}
      <div className="card p-4 mb-5">

        <h5>Apply Leave</h5>

        <input
          type="text"
          placeholder="Type / Reason"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="form-control mb-2"
        />

        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="form-control mb-2"
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="form-control mb-2"
        />

        <button
          onClick={handleLeaveApply}
          className="btn btn-primary"
        >
          Apply Leave
        </button>

        <p className="mt-2">
          Status:
          {" "}
          {leaveStatus || "No request"}
        </p>

      </div>

    </div>
  )
}

export default Profile