import React, { useEffect, useState } from "react"
import axios from "axios"

const Payroll = () => {

  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])
  const [payroll, setPayroll] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const emp = await axios.get("http://localhost:3000/employe")
    const att = await axios.get("http://localhost:3000/attendance")
    const lev = await axios.get("http://localhost:3000/leaves")

    setEmployees(emp.data)
    setAttendance(att.data)
    setLeaves(lev.data)

    calculatePayroll(emp.data, att.data, lev.data)
  }

  // 🔥 TIME CONVERT
  const convertTime = (timeStr) => {
    if (!timeStr) return null
    return new Date(`1970-01-01 ${timeStr}`)
  }

  // 🔥 CALCULATE HOURS
  const getHours = (inTime, outTime) => {
    const start = convertTime(inTime)
    const end = convertTime(outTime)
    if (!start || !end) return 0

    const diff = (end - start) / (1000 * 60 * 60)
    return diff > 0 ? diff : 0
  }

  // 🔥 MAIN LOGIC
  const calculatePayroll = (emps, atts, levs) => {

    const result = emps
      .filter(e => e.role === "employee")
      .map(emp => {

        const userAtt = atts.filter(a => a.userId === emp.id)
        const userLeave = levs.filter(l => l.userId === emp.id)

        const perDay = emp.salary / 30
        const perHour = perDay / 8

        let totalWorkedDays = 0
        let totalHours = 0

        userAtt.forEach(a => {
          const hrs = getHours(a.checkIn, a.checkOut)
          totalHours += hrs

          if (hrs >= 8) totalWorkedDays += 1
          else totalWorkedDays += hrs / 8
        })

        // 🔥 Leave logic
        let extraLeave = userLeave.length > 1 ? userLeave.length - 1 : 0

        // 🔥 Salary calculation
        const earned = totalHours * perHour
        const leaveCut = extraLeave * perDay

        // 🎉 Bonus logic
        let bonus = 0
        if (totalWorkedDays >= 26) bonus = 1000   // attendance bonus

        const finalSalary = earned - leaveCut + bonus

        return {
          id: emp.id,
          name: emp.firstName,
          department: emp.department,
          baseSalary: emp.salary,
          workedDays: totalWorkedDays.toFixed(1),
          totalHours: totalHours.toFixed(1),
          leave: userLeave.length,
          bonus,
          finalSalary: finalSalary.toFixed(0)
        }
      })

    setPayroll(result)
  }

  return (
    <div className="container mt-4"  style={{ height: "100vh", overflowY: "auto" }}>
      <h2>Payroll System</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Base Salary</th>
            <th>Worked Days</th>
            <th>Total Hours</th>
            <th>Leaves</th>
            <th>Bonus</th>
            <th>Final Salary</th>
          </tr>
        </thead>

        <tbody>
          {payroll.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.department}</td>
              <td>₹ {p.baseSalary}</td>
              <td>{p.workedDays}</td>
              <td>{p.totalHours}</td>
              <td>{p.leave}</td>
              <td>₹ {p.bonus}</td>
              <td><b>₹ {p.finalSalary}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Payroll