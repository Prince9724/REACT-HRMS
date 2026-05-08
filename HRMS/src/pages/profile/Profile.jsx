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

  // 🔥 SALARY SLIP
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
    performance: "Average"
  })

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (!time || time === "Auto Checkout") return 0

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

    if (!checkIn || !checkOut) return 0

    if (checkOut === "Auto Checkout") {
      return 4
    }

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

  // 🔥 FETCH USER
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
    }

  // 🔥 FETCH LEAVE
  const fetchLeave =
    async (data) => {

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
    }

  // 🔥 FETCH SALARY SLIP
  const fetchSalarySlip =
    async (data) => {

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
          (a) => a.userId === data.id
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

      if (totalLeaves > 1) {

        const extraLeaves =
          totalLeaves - 1

        leaveCut =
          extraLeaves *
          (data.salary / 30)
      }

      // PF
      const pf =
        data.salary * 0.12

      // TAX
      const professionalTax = 200

      // TOTAL CUT
      const totalCut =
        attendanceCut +
        leaveCut +
        pf +
        professionalTax

      // NET SALARY
      const netSalary =
        data.salary - totalCut

      // PERFORMANCE
      let performance = "Average"

      if (present >= 26) {
        performance = "Excellent"
      }

      else if (present >= 22) {
        performance = "Good"
      }

      else if (present >= 18) {
        performance = "Average"
      }

      else {
        performance = "Poor"
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
        performance
      })
    }

  // 🔥 AUTO CHECKOUT
  useEffect(() => {

    if (
      !checkInTime ||
      checkOutTime ||
      !user
    ) return

    const interval =
      setInterval(async () => {

        const currentTime =
          new Date()

        const currentHour =
          currentTime.getHours()

        const currentMinute =
          currentTime.getMinutes()

        // 🔥 11:59 PM
        if (
          currentHour === 23 &&
          currentMinute >= 59
        ) {

          const today =
            new Date().toLocaleDateString()

          const res =
            await axios.get(
              "http://localhost:3000/attendance"
            )

          const record =
            res.data.find(
              (a) =>
                a.userId ===
                user.id &&
                a.date === today
            )

          if (
            record &&
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

            alert(
              "Auto Checkout Applied"
            )
          }
        }

      }, 60000)

    return () =>
      clearInterval(interval)

  }, [
    checkInTime,
    checkOutTime,
    user
  ])

  if (!user) {

    return (
      <h3>
        No user logged in
      </h3>
    )
  }

  // 🔥 CHECK IN
  const handleCheckIn =
    async () => {

      const time =
        new Date().toLocaleTimeString()

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
    }

  // 🔥 CHECK OUT
  const handleCheckOut =
    async () => {

      const time =
        new Date().toLocaleTimeString()

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
    }

  // 🔥 APPLY LEAVE
  const handleLeaveApply =
    async () => {

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
        ) +
        1

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
    }

  return (

    <div
      className="container-fluid p-4"
      style={{
        background:
          "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      {/* 🔥 PROFILE */}
      <div className="card shadow border-0 p-4 mb-4">

        <div className="row">

          <div className="col-md-8">

            <h2 className="fw-bold">
              Welcome,
              {" "}
              {
                user.firstName
              }
            </h2>

            <p>
              📧
              {" "}
              {user.email}
            </p>

            <p>
              📱
              {" "}
              {user.contact}
            </p>

            <p>
              🏢
              {" "}
              {
                user.department
              }
            </p>

            <p>
              💼
              {" "}
              {
                user.role
              }
            </p>

          </div>

          <div className="col-md-4">

            <div
              className="p-4 rounded text-center"
              style={{
                background:
                  "#dcfce7"
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

        <h4 className="fw-bold mb-3">
          Attendance
        </h4>

        <div className="row">

          <div className="col-md-6">

            <p>
              ✅ Check In:
              {" "}
              {
                checkInTime ||
                "--"
              }
            </p>

            <p>
              ❌ Check Out:
              {" "}
              {
                checkOutTime ||
                "--"
              }
            </p>

          </div>

          <div className="col-md-6">

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

        <h4 className="fw-bold mb-3">
          Apply Leave
        </h4>

        <input
          type="text"
          placeholder="Leave Type"
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          className="form-control mb-2"
        />

        <textarea
          placeholder="Reason"
          value={leaveReason}
          onChange={(e) =>
            setLeaveReason(
              e.target.value
            )
          }
          className="form-control mb-2"
        />

        <input
          type="date"
          value={start}
          onChange={(e) =>
            setStart(
              e.target.value
            )
          }
          className="form-control mb-2"
        />

        <input
          type="date"
          value={end}
          onChange={(e) =>
            setEnd(
              e.target.value
            )
          }
          className="form-control mb-2"
        />

        <button
          onClick={handleLeaveApply}
          className="btn btn-primary"
        >
          Apply Leave
        </button>

        <p className="mt-3 fw-bold">
          Status:
          {" "}
          {
            leaveStatus ||
            "No Request"
          }
        </p>

      </div>
      <p>
        Performance:
        {" "}
        <b>
          {
            salaryData.performance
          }
        </b>
      </p>
      {/* 🔥 SALARY SLIP */}
      <div className="card shadow border-0 p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold">
              Salary Slip
            </h3>

            <p className="text-muted">
              Monthly Payslip
            </p>

          </div>

          <div
            className="p-3 rounded"
            style={{
              background:
                "#dcfce7"
            }}
          >

            <h2>
              ₹
              {
                salaryData.netSalary
              }
            </h2>

            <p>
              Employee Net Pay
            </p>

          </div>

        </div>

        <div className="row mb-4">

          <div className="col-md-6">

            <p>
              Employee:
              {" "}
              <b>
                {
                  user.firstName
                }
              </b>
            </p>

            <p>
              Department:
              {" "}
              <b>
                {
                  user.department
                }
              </b>
            </p>

            <p>
              Salary:
              {" "}
              <b>
                ₹
                {
                  user.salary
                }
              </b>
            </p>

          </div>

          <div className="col-md-6">

            <p>
              Present:
              {" "}
              <b>
                {
                  salaryData.present
                }
              </b>
            </p>

            <p>
              Absent:
              {" "}
              <b>
                {
                  salaryData.absent
                }
              </b>
            </p>

            <p>
              Half Day:
              {" "}
              <b>
                {
                  salaryData.halfDay
                }
              </b>
            </p>

            <p>
              Leaves:
              {" "}
              <b>
                {
                  salaryData.totalLeaves
                }
              </b>
            </p>

          </div>

        </div>

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>

              <th>
                Earnings
              </th>

              <th>
                Amount
              </th>

              <th>
                Deductions
              </th>

              <th>
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>
              <td>Basic Salary</td>
              <td>₹ {user.salary}</td>

              <td>Attendance Cut</td>

              <td>

                ₹ {

                  Number(
                    salaryData.totalCut
                  ) -

                  Number(
                    salaryData.pf
                  ) -

                  salaryData.professionalTax -

                  Number(
                    salaryData.leaveCut
                  )
                }

              </td>
            </tr>

            <tr>

              <td>
                PF Deduction (12%)
              </td>

              <td>
                ₹ {salaryData.pf}
              </td>

              <td>
                Professional Tax
              </td>

              <td>
                ₹ {
                  salaryData.professionalTax
                }
              </td>

            </tr>

            <tr>

              <td>
                Leave Deduction
              </td>

              <td>
                ₹ {
                  salaryData.leaveCut
                }
              </td>

              <td>
                Performance
              </td>

              <td>

                <b>
                  {
                    salaryData.performance
                  }
                </b>

              </td>

            </tr>

            <tr>

              <td
                colSpan="2"
                className="fw-bold"
              >
                Net Salary
              </td>

              <td
                colSpan="2"
                className="fw-bold text-success"
              >
                ₹ {
                  salaryData.netSalary
                }
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Profile