import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"


const Profile = () => {

  const navigate = useNavigate()
  const [myLeaves, setMyLeaves] = useState([])
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

  // TIME TO MINUTES
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
  const fetchMyLeaves = async (data) => {

    try {

      const res = await axios.get(
        "http://localhost:3000/leaves"
      )

      const userLeaves = res.data.filter(
        (l) => l.userId === data.id
      )

      setMyLeaves(userLeaves.reverse())

      if (userLeaves.length > 0) {

        setLeaveStatus(
          userLeaves[userLeaves.length - 1].status
        )
      }

    } catch (error) {

      console.log(error)
    }
  }
  // HOURS CALCULATE
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

    diff = diff - 1

    if (diff > 8) {
      diff = 8
    }

    return Number(diff.toFixed(1))
  }

  // SUNDAY CHECK
  const isSunday = (date) => {

    const day =
      new Date(date).getDay()

    return day === 0
  }

  // LOAD USER
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
      fetchMyLeaves(data)
  }, [])

  // FREE LEAVE CHECK
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

  // FETCH ATTENDANCE
  const fetchAttendance =
    async (data) => {

      try {

        const today =
          new Date().toLocaleDateString()

        const res =
          await axios.get(
            "http://localhost:3000/attendance"
          )

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

        setAttendanceHistory(
          myAttendance.reverse()
        )

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

  // SALARY LOGIC
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

  // AUTO CHECKOUT
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

  // CHECK IN
  const handleCheckIn =
    async () => {

      try {

        const currentHour =
          new Date().getHours()

        const day =
          new Date().getDay()

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

  // CHECK OUT
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

  // APPLY LEAVE
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
          // ✅ FREE LEAVE ONLY 1 DAY
if (
  type === "free" &&
  days > 1
) {

  alert(
    "Free Leave Only Allowed For 1 Day"
  )

  return
} 
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

  // PDF DOWNLOAD - Professional Salary Slip
  const downloadSalarySlip = () => {
    const doc = new jsPDF()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentDate = new Date()
    const month = monthNames[currentDate.getMonth()]
    const year = currentDate.getFullYear()

    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 210, 42, "F")

    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text("XCELTECH HRMS", 105, 18, { align: "center" })

    doc.setFontSize(11)
    doc.setTextColor(220, 220, 220)
    doc.text("Official Salary Slip", 105, 28, { align: "center" })

    doc.setFontSize(9)
    doc.text(`${month} ${year}`, 105, 36, { align: "center" })

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    doc.text(`Employee Name: ${user.firstName} ${user.lastName || ""}`, 15, 55)
    doc.text(`Employee ID: ${user.id}`, 15, 63)
    doc.text(`Department: ${user.department || "N/A"}`, 15, 71)
    doc.text(`Role: ${user.role}`, 15, 79)

    doc.text(`Salary: ₹ ${user.salary.toLocaleString()}`, 135, 55)
    doc.text(`Performance: ${salaryData.performance}`, 135, 63)
    doc.text(`Generated: ${currentDate.toLocaleDateString()}`, 135, 71)

    const earnings = [
      ["Basic Salary", `₹ ${user.salary.toLocaleString()}`],
      ["Sunday Paid", `₹ ${(salaryData.sundayPaid * (user.salary / 30)).toFixed(0)}`],
    ]

    const deductions = [
      ["Attendance Cut", `₹ ${salaryData.attendanceCut}`],
      ["Leave Cut", `₹ ${salaryData.leaveCut}`],
      ["PF (12%)", `₹ ${salaryData.pf}`],
      ["Professional Tax", `₹ ${salaryData.professionalTax}`],
    ]

    doc.autoTable({
      startY: 95,
      head: [["Earnings", "Amount", "Deductions", "Amount"]],
      body: earnings.map((e, i) => [
        e[0],
        e[1],
        deductions[i] ? deductions[i][0] : "",
        deductions[i] ? deductions[i][1] : ""
      ]),
      foot: [
        ["Total Salary", `₹ ${user.salary.toLocaleString()}`, "Total Deduction", `₹ ${salaryData.totalCut}`],
        ["", "", "Net Salary", `₹ ${salaryData.netSalary}`]
      ],
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
        fontStyle: "bold"
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: 0,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    })

    const finalY = doc.lastAutoTable.finalY + 12

    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text("This is a system generated salary slip.", 105, finalY, { align: "center" })

    doc.save(`Salary_Slip_${user.firstName}_${month}_${year}.pdf`)
  }

  if (!user) {

    return (
      <div className="container py-5">
        <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
          <i className="bi bi-person-x display-3 text-secondary"></i>
          <h3 className="mt-3 fw-bold">
            No User Logged In
          </h3>
        </div>
      </div>
    )
  }

  return (

    <div
      className="container-fluid py-4 px-lg-4"
      style={{
        minHeight: "100vh",
        background: "#f1f5f9"
      }}
    >

      {/* PROFILE HEADER */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">

        <div
          className="p-4 p-lg-5"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)"
          }}
        >

          <div className="row align-items-center g-4">

            <div className="col-lg-8">

              <div className="d-flex align-items-center flex-column flex-md-row text-center text-md-start">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-md-4 mb-3 mb-md-0 shadow"
                  style={{
                    width: "95px",
                    height: "95px",
                    background: "rgba(223, 23, 23, 0.15)",
                    backdropFilter: "blur(10px)"
                  }}

                >
                  <img style={{ height: "200px" }} src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" alt="" />
                  <i className="bi bi-person-fill text-white display-5"></i>
                </div>

                <div className="text-white">

                  <h1 className="fw-bold mb-2">
                    {user.firstName} {user.lastName || ""}
                  </h1>

                  <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">

                    <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                      <i className="bi bi-briefcase-fill me-1"></i>
                      {user.role}
                    </span>

                    <span className="badge bg-primary-subtle text-dark px-3 py-2 rounded-pill">
                      <i className="bi bi-building me-1"></i>
                      {user.department || "N/A"}
                    </span>

                  </div>

                  <div className="mt-4">

                    <div style={{width:"450px"}} className="row g-3 ">

                      <div className="col-sm-6">
                        <div className="bg-white bg-opacity-10 rounded-3 p-3 border border-light border-opacity-25">
                          <small className="text-light d-block mb-1">
                            Email
                          </small>
                          <div className="fw-semibold w-100 text-white">
                            <i className="bi bi-envelope-fill me-2"></i>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="bg-white bg-opacity-10 rounded-3 p-3 border border-light border-opacity-25">
                          <small className="text-light d-block mb-1">
                            Contact
                          </small>
                          <div className="fw-semibold text-white">
                            <i className="bi bi-telephone-fill me-2"></i>
                            {user.contact}
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-lg-4">

              <div className="card border-0 shadow-lg rounded-4">

                <div className="card-body text-center p-4">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "#dcfce7"
                    }}
                  >
                    <i className="bi bi-wallet2 text-success fs-2"></i>
                  </div>

                  <p className="text-muted mb-1">
                    Monthly Net Salary
                  </p>

                  <h1 className="fw-bold text-success mb-2">
                    ₹{salaryData.netSalary}
                  </h1>

                  <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                    {salaryData.performance} Performance
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ATTENDANCE OVERVIEW */}
      <div className="row g-4 mb-4">

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Present Days
                  </p>
                  <h2 className="fw-bold text-success mb-0">
                    {salaryData.present}
                  </h2>
                </div>
                <div className="bg-success bg-opacity-10 rounded-3 p-3">
                  <i className="bi bi-check-circle-fill text-success fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Absent Days
                  </p>
                  <h2 className="fw-bold text-danger mb-0">
                    {salaryData.absent}
                  </h2>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                  <i className="bi bi-x-circle-fill text-danger fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Half Days
                  </p>
                  <h2 className="fw-bold text-warning mb-0">
                    {salaryData.halfDay}
                  </h2>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                  <i className="bi bi-clock-fill text-warning fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">
                    Sunday Paid
                  </p>
                  <h2 className="fw-bold text-primary mb-0">
                    {salaryData.sundayPaid}
                  </h2>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                  <i className="bi bi-sun-fill text-primary fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-4 mb-4">

        {/* TODAY ATTENDANCE */}
        <div className="col-lg-6">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-header bg-white border-0 p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                <div>
                  <h4 className="fw-bold mb-1">
                    <i className="bi bi-calendar-check-fill text-primary me-2"></i>
                    Today's Attendance
                  </h4>
                  <p className="text-muted mb-0">
                    Daily attendance tracking
                  </p>
                </div>

                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                  Live Status
                </span>

              </div>

            </div>

            <div className="card-body p-4">

              <div className="row g-3 mb-4">

                <div className="col-md-6">

                  <div className="border rounded-4 p-4 h-100 bg-success bg-opacity-10">

                    <div className="d-flex align-items-center mb-3">

                      <div className="bg-success rounded-circle p-3 me-3">
                        <i className="bi bi-box-arrow-in-right text-white"></i>
                      </div>

                      <div>
                        <p className="text-muted mb-1">
                          Check In
                        </p>
                        <h5 className="fw-bold text-success mb-0">
                          {checkInTime || "--"}
                        </h5>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-4 h-100 bg-danger bg-opacity-10">

                    <div className="d-flex align-items-center mb-3">

                      <div className="bg-danger rounded-circle p-3 me-3">
                        <i className="bi bi-box-arrow-right text-white"></i>
                      </div>

                      <div>
                        <p className="text-muted mb-1">
                          Check Out
                        </p>
                        <h5 className="fw-bold text-danger mb-0">
                          {checkOutTime || "--"}
                        </h5>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div className="d-flex flex-wrap gap-3">

                <button
                  className="btn btn-success px-4 py-3 rounded-3 fw-semibold"
                  onClick={handleCheckIn}
                  disabled={checkInTime}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Check In
                </button>

                <button
                  className="btn btn-danger px-4 py-3 rounded-3 fw-semibold"
                  onClick={handleCheckOut}
                  disabled={!checkInTime || checkOutTime}
                >
                  <i className="bi bi-x-circle-fill me-2"></i>
                  Check Out
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* LEAVE MANAGEMENT */}
        <div className="col-lg-6">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-header bg-white border-0 p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <div>
                  <h4 className="fw-bold mb-1">
                    <i className="bi bi-calendar-plus-fill text-warning me-2"></i>
                    Leave Management
                  </h4>
                  <p className="text-muted mb-0">
                    Apply and manage leaves
                  </p>
                </div>

                <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill">
                  HR Portal
                </span>

              </div>

            </div>

            <div className="card-body p-4">

              {hasUsedFreeLeave && (
                <div className="alert alert-warning border-0 rounded-4 d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Free Leave Already Used. Only Paid Leave Available.
                </div>
              )}

              <div className="row g-3">

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Leave Type
                  </label>

                  <select
                    className="form-select rounded-3 py-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">
                      Select Leave Type
                    </option>

                    {!hasUsedFreeLeave && (
                      <option value="free">
                        Free Leave (No Salary Cut)
                      </option>
                    )}

                    <option value="paid">
                      Paid Leave (Salary Cut)
                    </option>

                  </select>

                </div>

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Leave Reason
                  </label>

                  <textarea
                    className="form-control rounded-3"
                    rows="1"
                    placeholder="Enter reason..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />

                </div>

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Start Date
                  </label>

                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />

                </div>

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    End Date
                  </label>

                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />

                </div>

              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">

                <button
                  className="btn btn-primary px-4 py-3 rounded-3 fw-semibold"
                  onClick={handleLeaveApply}
                >
                  <i className="bi bi-send-fill me-2"></i>
                  Apply Leave
                </button>

                <div className="bg-light rounded-3 px-4 py-3">

                  <small className="text-muted d-block">
                    Current Status
                  </small>

                  <span className="fw-bold text-primary text-capitalize">
                    {leaveStatus || "No Request"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SALARY SECTION */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div>

              <h3 className="fw-bold mb-1">
                <i className="bi bi-receipt-cutoff text-primary me-2"></i>
                Salary Overview
              </h3>

              <p className="text-muted mb-0">
                Monthly payroll summary and deductions
              </p>

            </div>

            <div className="d-flex flex-wrap gap-2">



              <button
                className="btn btn-outline-primary px-4 py-2 rounded-3"
                onClick={() => navigate("/salary-history")}
              >
                <i className="bi bi-clock-history me-2"></i>
                Salary History
              </button>

            </div>

          </div>

        </div>

        <div className="card-body p-4">

          <div className="row g-4 mb-4">

            <div className="col-lg-3 col-md-6">
              <div className="border rounded-4 p-4 bg-light h-100">
                <small className="text-muted">
                  Basic Salary
                </small>
                <h4 className="fw-bold mt-2 mb-0">
                  ₹{user.salary.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="border rounded-4 p-4 bg-danger bg-opacity-10 h-100">
                <small className="text-muted">
                  Total Deduction
                </small>
                <h4 className="fw-bold text-danger mt-2 mb-0">
                  ₹{salaryData.totalCut}
                </h4>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="border rounded-4 p-4 bg-success bg-opacity-10 h-100">
                <small className="text-muted">
                  Net Salary
                </small>
                <h4 className="fw-bold text-success mt-2 mb-0">
                  ₹{salaryData.netSalary}
                </h4>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="border rounded-4 p-4 bg-primary bg-opacity-10 h-100">
                <small className="text-muted">
                  Performance
                </small>
                <h4 className="fw-bold text-primary mt-2 mb-0">
                  {salaryData.performance}
                </h4>
              </div>
            </div>

          </div>

          <div className="table-responsive">

            <table className="table align-middle">

              <thead
                style={{
                  background: "#0f172a"
                }}
              >
                <tr>
                  <th className="text-white py-3">Type</th>
                  <th className="text-white py-3">Description</th>
                  <th className="text-white py-3">Amount (₹)</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td className="fw-semibold">
                    <i className="bi bi-cash-stack me-2 text-success"></i>
                    Basic Salary
                  </td>
                  <td>Monthly Salary</td>
                  <td className="fw-bold">
                    {user.salary.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">
                    <i className="bi bi-person-x-fill me-2 text-danger"></i>
                    Attendance Cut
                  </td>
                  <td>Absent / Half Day</td>
                  <td className="fw-bold text-danger">
                    {salaryData.attendanceCut}
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">
                    <i className="bi bi-calendar-x-fill me-2 text-danger"></i>
                    Leave Cut
                  </td>
                  <td>Paid Leave Deduction</td>
                  <td className="fw-bold text-danger">
                    {salaryData.leaveCut}
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">
                    <i className="bi bi-bank2 me-2 text-primary"></i>
                    PF Deduction
                  </td>
                  <td>12% PF Deduction</td>
                  <td className="fw-bold text-danger">
                    {salaryData.pf}
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">
                    <i className="bi bi-building-fill me-2 text-secondary"></i>
                    Professional Tax
                  </td>
                  <td>Government Tax</td>
                  <td className="fw-bold text-danger">
                    {salaryData.professionalTax}
                  </td>
                </tr>

                <tr className="table-light">
                  <td className="fw-bold">
                    Total Deduction
                  </td>
                  <td>
                    All Salary Cuts
                  </td>
                  <td className="fw-bold text-danger">
                    ₹{salaryData.totalCut}
                  </td>
                </tr>

                <tr className="table-success">
                  <td className="fw-bold">
                    Net Salary
                  </td>
                  <td>
                    Final Credited Salary
                  </td>
                  <td className="fw-bold text-success">
                    ₹{salaryData.netSalary}
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>
      {/* MY LEAVES */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-header bg-white border-0 p-4">

          <h4 className="fw-bold mb-0">
            <i className="bi bi-calendar-event-fill text-primary me-2"></i>
            My Leave Requests
          </h4>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table align-middle mb-0">

              <thead style={{ background: "#0f172a" }}>

                <tr>

                  <th className="text-white py-3 px-4">
                    Type
                  </th>

                  <th className="text-white py-3">
                    Start
                  </th>

                  <th className="text-white py-3">
                    End
                  </th>

                  <th className="text-white py-3">
                    Days
                  </th>

                  <th className="text-white py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {myLeaves.map((leave, index) => {

                  let badge = "bg-warning"

                  if (leave.status === "approved") {
                    badge = "bg-success"
                  }

                  if (leave.status === "rejected") {
                    badge = "bg-danger"
                  }

                  return (

                    <tr key={index}>

                      <td className="px-4 text-capitalize fw-semibold">
                        {leave.type}
                      </td>

                      <td>
                        {leave.start}
                      </td>

                      <td>
                        {leave.end}
                      </td>

                      <td>
                        {leave.days}
                      </td>

                      <td>

                        <span
                          className={`badge ${badge} px-3 py-2 rounded-pill text-capitalize`}
                        >
                          {leave.status}
                        </span>

                      </td>

                    </tr>

                  )
                })}

                {myLeaves.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-4 text-muted"
                    >
                      No Leave Requests
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
      {/* ATTENDANCE HISTORY */}
      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

            <div>

              <h3 className="fw-bold mb-1">
                <i className="bi bi-clock-history text-info me-2"></i>
                Attendance History
              </h3>

              <p className="text-muted mb-0">
                Monthly attendance records
              </p>

            </div>

            <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
              {attendanceHistory.length} Records
            </span>

          </div>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead
                style={{
                  background: "#0f172a"
                }}
              >

                <tr>
                  <th className="text-dark py-3 px-4">
                    Date
                  </th>

                  <th className="text-dark py-3">
                    Check In
                  </th>

                  <th className="text-dark py-3">
                    Check Out
                  </th>

                  <th className="text-dark py-3">
                    Hours
                  </th>

                  <th className="text-dark py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendanceHistory.map((a, index) => {

                  const hours = calculateHours(a.checkIn, a.checkOut)

                  let status = "Absent"
                  let statusClass = "bg-danger"
                  let statusIcon = "bi-x-circle-fill"

                  if (isSunday(a.date)) {

                    status = "Sunday Paid"
                    statusClass = "bg-info"
                    statusIcon = "bi-sun-fill"
                  }

                  else if (hours >= 8) {

                    status = "Present"
                    statusClass = "bg-success"
                    statusIcon = "bi-check-circle-fill"
                  }

                  else if (hours >= 4) {

                    status = "Half Day"
                    statusClass = "bg-warning text-dark"
                    statusIcon = "bi-clock-fill"
                  }

                  return (

                    <tr key={index}>

                      <td className="fw-semibold px-4">
                        {a.date}
                      </td>

                      <td>
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                          {a.checkIn || "--"}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">
                          {a.checkOut || "--"}
                        </span>
                      </td>

                      <td className="fw-bold">
                        {hours} hrs
                      </td>

                      <td>

                        <span className={`badge ${statusClass} px-3 py-2 rounded-pill`}>

                          <i className={`${statusIcon} me-1`}></i>

                          {status}

                        </span>

                      </td>

                    </tr>

                  )
                })}

                {attendanceHistory.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted"
                    >

                      <i className="bi bi-inbox-fill display-6 d-block mb-3"></i>

                      No attendance records found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile