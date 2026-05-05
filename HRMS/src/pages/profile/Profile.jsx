import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {

  const [user, setUser] = useState(null)

  // Attendance (temporary localStorage)
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

    // 🔥 attendance (localStorage)
    const attendance = JSON.parse(localStorage.getItem("attendance")) || []
    const today = new Date().toLocaleDateString()

    const todayData = attendance.find(
      (a) => a.contact === data?.contact && a.date === today
    )

    if (todayData) {
      setCheckInTime(todayData.checkIn)
      setCheckOutTime(todayData.checkOut)
    }

    // 🔥 leave status (API)
    const fetchLeave = async () => {
      const res = await axios.get("http://localhost:3000/leaves")
      const myLeave = res.data.find(l => l.userId === data?.id)
      if (myLeave) setLeaveStatus(myLeave.status)
    }

    fetchLeave()

  }, [])

  if (!user) return <h3>No user logged in</h3>

  // ✅ CHECK IN
  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString()
    setCheckInTime(time)

    const attendance = JSON.parse(localStorage.getItem("attendance")) || []
    const today = new Date().toLocaleDateString()

    attendance.push({
      contact: user.contact,
      date: today,
      checkIn: time,
      checkOut: ""
    })

    localStorage.setItem("attendance", JSON.stringify(attendance))
  }

  // ✅ CHECK OUT
  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString()
    setCheckOutTime(time)

    let attendance = JSON.parse(localStorage.getItem("attendance")) || []
    const today = new Date().toLocaleDateString()

    attendance = attendance.map((a) => {
      if (a.contact === user.contact && a.date === today) {
        return { ...a, checkOut: time }
      }
      return a
    })

    localStorage.setItem("attendance", JSON.stringify(attendance))
  }

  // ✅ APPLY LEAVE (API BASED)
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