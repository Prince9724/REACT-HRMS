import React, { useEffect, useState } from 'react'

const Profile = () => {

  const [user, setUser] = useState(null)
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [leaveReason, setLeaveReason] = useState("")
  const [leaveStatus, setLeaveStatus] = useState("")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"))
    setUser(data)

    // attendance load
    const attendance = JSON.parse(localStorage.getItem("attendance")) || []
    const today = new Date().toLocaleDateString()

    const todayData = attendance.find(
      (a) => a.contact === data?.contact && a.date === today
    )

    if (todayData) {
      setCheckInTime(todayData.checkIn)
      setCheckOutTime(todayData.checkOut)
    }

    // leave status load
    const leaves = JSON.parse(localStorage.getItem("leaves")) || []
    const myLeave = leaves.find((l) => l.contact === data?.contact)
    if (myLeave) setLeaveStatus(myLeave.status)

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

  // ✅ APPLY LEAVE
  const handleLeaveApply = () => {
    const leaves = JSON.parse(localStorage.getItem("leaves")) || []

    leaves.push({
      contact: user.contact,
      name: user.firstName,
      reason: leaveReason,
      status: "pending"
    })

    localStorage.setItem("leaves", JSON.stringify(leaves))
    setLeaveStatus("pending")
    setLeaveReason("")
  }

  return (
    <div className="container mt-4"
    style={{ height: "100vh", overflowY: "auto" }}
    >

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
          placeholder="Enter reason"
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
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