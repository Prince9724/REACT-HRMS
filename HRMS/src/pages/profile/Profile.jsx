import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {

  const [user, setUser] = useState(null)

  // Attendance states
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")

  // Leave states
  const [leaveReason, setLeaveReason] = useState("")
  const [leaveStatus, setLeaveStatus] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [type, setType] = useState("")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"))
    setUser(data)

    // 🔥 Attendance fetch (API se)
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

    // 🔥 Leave status
    const fetchLeave = async () => {
      const res = await axios.get("http://localhost:3000/leaves")
      const myLeave = res.data.find(l => l.userId === data?.id)
      if (myLeave) setLeaveStatus(myLeave.status)
    }

    fetchAttendance()
    fetchLeave()

  }, [])

  if (!user) return <h3>No user logged in</h3>


  // 🔥 ✅ CHECK IN (API BASED)
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


  // 🔥 ✅ CHECK OUT (API BASED)
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


  // ✅ APPLY LEAVE
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
      </div>

      {/* 🔥 Attendance */}
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
      </div>

      {/* Leave Apply */}
      <div className="card p-4 mb-3">
        <h5>Apply Leave</h5>

        <input
          type="text"
          placeholder="Reason"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
          className="form-control mb-2"
        />

        <input
          type="text"
          placeholder="Type (Sick / Casual)"
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

        <p>
          Days: {
            start && end
              ? (new Date(end) - new Date(start)) /
                (1000 * 60 * 60 * 24) + 1
              : 0
          }
        </p>

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