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

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (!time) return 0

    try {

      const [timePart, modifier] = time.split(" ")

      let [hours, minutes] = timePart.split(":")

      hours = parseInt(hours)
      minutes = parseInt(minutes)

      // PM FIX
      if (modifier === "PM" && hours !== 12) {
        hours += 12
      }

      // 12 AM FIX
      if (modifier === "AM" && hours === 12) {
        hours = 0
      }

      return hours * 60 + minutes

    } catch (error) {

      return 0
    }
  }

  // 🔥 CALCULATE HOURS
  const calculateHours = (checkIn, checkOut) => {

    if (!checkIn || !checkOut) return 0

    const inMinutes =
      convertToMinutes(checkIn)

    const outMinutes =
      convertToMinutes(checkOut)

    let diff =
      (outMinutes - inMinutes) / 60

    // invalid fix
    if (diff < 0 || isNaN(diff)) {
      return 0
    }

    // MAX 8 HOURS
    if (diff > 8) {
      diff = 8
    }

    return diff
  }

  // 🔥 FETCH USER DATA
  useEffect(() => {

    const data =
      JSON.parse(localStorage.getItem("user"))

    setUser(data)

    const fetchAttendance = async () => {

      const today =
        new Date().toLocaleDateString()

      const res = await axios.get(
        "http://localhost:3000/attendance"
      )

      const todayData = res.data.find(
        (a) =>
          a.userId === data?.id &&
          a.date === today
      )

      if (todayData) {

        setCheckInTime(todayData.checkIn)

        setCheckOutTime(todayData.checkOut)
      }
    }

    const fetchLeave = async () => {

      const res = await axios.get(
        "http://localhost:3000/leaves"
      )

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

    const perDay =
      user.salary / 30

    const perHour =
      perDay / 8

    const hours =
      calculateHours(
        checkInTime,
        checkOutTime
      )

    const earning =
      hours * perHour

    setSalaryInfo({
      perHour: perHour.toFixed(2),
      workedHours: hours.toFixed(2),
      todayEarning: earning.toFixed(2)
    })

  }, [checkOutTime, user])

  // 🔥 AUTO CHECKOUT
  useEffect(() => {

    if (!checkInTime || checkOutTime || !user) return

    const interval = setInterval(async () => {

      const currentTime =
        new Date().toLocaleTimeString()

      const hours =
        calculateHours(
          checkInTime,
          currentTime
        )

      // 🔥 AUTO CHECKOUT AFTER 8 HOURS
      if (hours >= 8) {

        const today =
          new Date().toLocaleDateString()

        const res = await axios.get(
          "http://localhost:3000/attendance"
        )

        const record = res.data.find(
          a =>
            a.userId === user.id &&
            a.date === today
        )

        if (record && !record.checkOut) {

          await axios.patch(
            `http://localhost:3000/attendance/${record.id}`,
            {
              checkOut: currentTime
            }
          )

          setCheckOutTime(currentTime)

          alert("Auto checkout completed")
        }
      }

    }, 60000)

    return () => clearInterval(interval)

  }, [checkInTime, checkOutTime, user])

  if (!user) {
    return <h3>No user logged in</h3>
  }

  // 🔥 CHECK IN
  const handleCheckIn = async () => {

    const time =
      new Date().toLocaleTimeString()

    const today =
      new Date().toLocaleDateString()

    const res = await axios.get(
      "http://localhost:3000/attendance"
    )

    const already = res.data.find(
      a =>
        a.userId === user.id &&
        a.date === today
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

    const time =
      new Date().toLocaleTimeString()

    const today =
      new Date().toLocaleDateString()

    const res = await axios.get(
      "http://localhost:3000/attendance"
    )

    const record = res.data.find(
      a =>
        a.userId === user.id &&
        a.date === today
    )

    if (!record) {

      alert("Please check in first")

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

      {/* PROFILE */}
      <div className="card p-4 shadow-sm mb-4">

        <h3>{user.role}</h3>

        <p>
          {user.firstName} {user.lastName}
        </p>

        <p>{user.email}</p>

        <p>{user.contact}</p>

        <p>
          Salary: ₹ {user.salary}
        </p>

      </div>

      {/* ATTENDANCE */}
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
          disabled={checkInTime}
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          className="btn btn-danger"
          disabled={!checkInTime || checkOutTime}
        >
          Check Out
        </button>

        {/* SALARY */}
        <div className="mt-3">

          <p>
            Per Hour Salary:
            ₹ {salaryInfo.perHour}
          </p>

          <p>
            Worked Hours:
            {salaryInfo.workedHours}
          </p>

          <p>
            Today Earning:
            ₹ {salaryInfo.todayEarning}
          </p>

        </div>

      </div>

      {/* LEAVE */}
      <div className="card p-4 mb-3">

        <h5>Apply Leave</h5>

        <input
          type="text"
          placeholder="Type/reason"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="form-control mb-2"
        />

        <input
          type="date"
          value={start}
          onChange={(e) =>
            setStart(e.target.value)
          }
          className="form-control mb-2"
        />

        <input
          type="date"
          value={end}
          onChange={(e) =>
            setEnd(e.target.value)
          }
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