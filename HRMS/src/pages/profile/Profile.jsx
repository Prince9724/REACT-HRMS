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
    todayEarning: 0
  })

  // 🔥 TIME FIX FUNCTION (VERY IMPORTANT)
  const convertTime = (timeStr) => {
    if (!timeStr) return null
    return new Date(`1970-01-01 ${timeStr}`)
  }

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

      if (todayData) {
        setCheckInTime(todayData.checkIn)
        setCheckOutTime(todayData.checkOut)
      }
    }

    const fetchLeave = async () => {
      const res = await axios.get("http://localhost:3000/leaves")
      const myLeave = res.data.find(l => l.userId === data?.id)
      if (myLeave) setLeaveStatus(myLeave.status)
    }

    fetchAttendance()
    fetchLeave()

  }, [])

  // 🔥 SALARY CALCULATION
  useEffect(() => {
    if (!user || !checkInTime || !checkOutTime) return

    const perDay = user.salary / 30
    const perHour = perDay / 8

    const hours = calculateHours(checkInTime, checkOutTime)

    const earning = hours * perHour

    setSalaryInfo({
      perHour: perHour.toFixed(2),
      workedHours: hours.toFixed(2),
      todayEarning: earning.toFixed(2)
    })

  }, [checkOutTime, user])

  if (!user) return <h3>No user logged in</h3>

  // 🔥 CHECK IN
  const handleCheckIn = async () => {
    const time = new Date().toLocaleTimeString()
    const today = new Date().toLocaleDateString()

    const res = await axios.get("http://localhost:3000/attendance")

    const already = res.data.find(
      a => a.userId === user.id && a.date === today
    )

    if (already) {
      alert("Already checked in")
      return
    }

    await axios.post("http://localhost:3000/attendance", {
      userId: user.id,
      name: user.firstName,
      contact: user.contact,
      date: today,
      checkIn: time,
      checkOut: ""
    })

    setCheckInTime(time)
  }

  // 🔥 CHECK OUT
  const handleCheckOut = async () => {
    const time = new Date().toLocaleTimeString()
    const today = new Date().toLocaleDateString()

    const res = await axios.get("http://localhost:3000/attendance")

    const record = res.data.find(
      a => a.userId === user.id && a.date === today
    )

    if (!record) {
      alert("Please check in first")
      return
    }

    await axios.patch(`http://localhost:3000/attendance/${record.id}`, {
      checkOut: time
    })

    setCheckOutTime(time)
  }

  // 🔥 APPLY LEAVE
  const handleLeaveApply = async () => {

    if (!start || !end || !type || !leaveReason) {
      alert("Please fill all fields")
      return
    }

    const days =
      (new Date(end) - new Date(start)) /
        (1000 * 60 * 60 * 24) + 1

    await axios.post("http://localhost:3000/leaves", {
      userId: user.id,
      name: user.firstName,
      contact: user.contact,
      reason: leaveReason,
      type: type,
      start: start,
      end: end,
      days: days,
      status: "pending"
    })

    setLeaveStatus("pending")
    setLeaveReason("")
    setStart("")
    setEnd("")
    setType("")
  }

  return (
    <div className="container mt-4" style={{ height: "100vh", overflowY: "auto" }}>

      {/* Profile */}
      <div className="card p-4 shadow-sm mb-4">
        <h3>{user.role}</h3>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
        <p>{user.contact}</p>
        <p>Salary: ₹ {user.salary}</p>
      </div>

      {/* Attendance */}
      <div className="card p-4 mb-3">
        <h5>Attendance</h5>

        <p>Check In: {checkInTime || "--"}</p>
        <p>Check Out: {checkOutTime || "--"}</p>

        <button onClick={handleCheckIn} className="btn btn-success me-2">
          Check In
        </button>

        <button onClick={handleCheckOut} className="btn btn-danger">
          Check Out
        </button>

        {/* 🔥 SALARY DISPLAY */}
        <div className="mt-3">
          <p>Per Hour Salary: ₹ {salaryInfo.perHour}</p>
          <p>Worked Hours: {salaryInfo.workedHours}</p>
          <p>Today Earning: ₹ {salaryInfo.todayEarning}</p>
        </div>
      </div>

      {/* Leave */}
      <div className="card p-4 mb-3">
        <h5>Apply Leave</h5>

        {/* <input
          type="text"
          placeholder="Reason"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
          className="form-control mb-2"
        /> */}

        <input
          type="text"
          placeholder="Type/reason"
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

        <button onClick={handleLeaveApply} className="btn btn-primary">
          Apply Leave
        </button>

        <p className="mt-2">
          Status: {leaveStatus || "No request"}
        </p>
      </div>

    </div>
  )
}

export default Profile