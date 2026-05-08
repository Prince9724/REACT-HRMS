import React, { useEffect, useState } from "react"
import axios from "axios"

const Payroll = () => {

  const [payroll, setPayroll] = useState([])

  // 🔥 SEARCH
  const [search, setSearch] = useState("")

  // 🔥 FILTER
  const [department, setDepartment] =
    useState("all")

  // 🔥 VIEW EMPLOYEE
  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  // 🔥 FETCH DATA
  const fetchData = async () => {

    try {

      const empRes =
        await axios.get(
          "http://localhost:3000/employe"
        )

      const attRes =
        await axios.get(
          "http://localhost:3000/attendance"
        )

      const leaveRes =
        await axios.get(
          "http://localhost:3000/leaves"
        )

      calculatePayroll(
        empRes.data,
        attRes.data,
        leaveRes.data
      )

    } catch (error) {

      console.log(error)
    }
  }

  // 🔥 TIME CONVERT
  const convertToMinutes = (time) => {

    if (
      !time ||
      time === "Auto Checkout"
    ) return 0

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

    if (!checkIn || !checkOut) {
      return 0
    }

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

  // 🔥 PAYROLL LOGIC
  const calculatePayroll = (
    employees,
    attendance,
    leaves
  ) => {

    const payrollData =
      employees
        .filter(
          (emp) =>
            emp.role === "employee"
        )
        .map((emp) => {

          const userAttendance =
            attendance.filter(
              (a) =>
                a.userId === emp.id
            )

          const approvedLeaves =
            leaves.filter(
              (l) =>
                l.userId === emp.id &&
                l.status === "approved"
            )

          const perDaySalary =
            emp.salary / 30

          let present = 0
          let absent = 0
          let halfDay = 0
          let totalHours = 0
          let attendanceCut = 0

          // 🔥 ATTENDANCE
          userAttendance.forEach((a) => {

            const hours =
              calculateHours(
                a.checkIn,
                a.checkOut
              )

            totalHours += hours

            if (hours >= 8) {

              present++

            }

            else if (hours >= 4) {

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

          // 🔥 LEAVES
          let totalLeaves = 0

          approvedLeaves.forEach((l) => {

            totalLeaves +=
              Number(l.days)
          })

          // 🔥 1 LEAVE FREE
          let leaveCut = 0

          if (totalLeaves > 1) {

            const extraLeaves =
              totalLeaves - 1

            leaveCut =
              extraLeaves *
              perDaySalary
          }

          // 🔥 PF
          const pf =
            emp.salary * 0.12

          // 🔥 TAX
          const professionalTax =
            200

          // 🔥 PERFORMANCE
          let performance =
            "Average"

          let bonus = 0

          if (present >= 26) {

            performance =
              "Excellent"

            bonus = 5000
          }

          else if (present >= 22) {

            performance =
              "Good"

            bonus = 2500
          }

          else if (present >= 18) {

            performance =
              "Average"

            bonus = 1000
          }

          else {

            performance =
              "Poor"

            bonus = 0
          }

          // 🔥 TOTAL CUT
          const totalCut =
            attendanceCut +
            leaveCut +
            pf +
            professionalTax

          // 🔥 NET SALARY
          const netSalary =
            emp.salary -
            totalCut +
            bonus

          return {

            id: emp.id,

            name:
              emp.firstName,

            department:
              emp.department,

            baseSalary:
              emp.salary,

            present,

            absent,

            halfDay,

            totalLeaves,

            totalHours:
              totalHours.toFixed(1),

            attendanceCut:
              Math.round(
                attendanceCut
              ),

            leaveCut:
              Math.round(
                leaveCut
              ),

            pf:
              Math.round(pf),

            professionalTax,

            bonus,

            performance,

            totalCut:
              Math.round(
                totalCut
              ),

            netSalary:
              Math.round(
                netSalary
              )
          }
        })

    setPayroll(payrollData)
  }

  // 🔥 FILTER
  const filteredPayroll =
    payroll.filter((p) => {

      const matchSearch =
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchDepartment =
        department === "all" ||
        p.department === department

      return (
        matchSearch &&
        matchDepartment
      )
    })

  return (

    <div
      className="container-fluid p-4"
      style={{
        background: "#f1f5f9",
        minHeight: "100vh"
      }}
    >

      {/* 🔥 HEADER */}
      <div className="mb-4">

        <h2 className="fw-bold">
          Payroll Dashboard
        </h2>

        <p className="text-muted">
          Employee payroll management system
        </p>

      </div>

      {/* 🔥 SEARCH + FILTER */}
      <div className="card shadow border-0 p-3 mb-4">

        <div className="row">

          {/* 🔥 SEARCH */}
          <div className="col-md-6 mb-2">

            <input
              type="text"
              placeholder="Search Employee..."
              className="form-control"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* 🔥 FILTER */}
          <div className="col-md-6 mb-2">

            <select
              className="form-control"
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Departments
              </option>

              <option value="AI/ML">
                AI/ML
              </option>

              <option value="Web Development">
                Web Development
              </option>

              <option value="Flutter">
                Flutter
              </option>

              <option value="Graphic Designer">
                Graphic Designer
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow border-0 p-4">

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Performance</th>
                <th>Net Salary</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {
                filteredPayroll.length > 0
                  ? (
                    filteredPayroll.map((p) => (

                      <tr key={p.id}>

                        <td>
                          {p.id}
                        </td>

                        <td>
                          {p.name}
                        </td>

                        <td>
                          {p.department}
                        </td>

                        <td>

                          {
                            p.performance === "Excellent"
                              ? (
                                <span className="badge bg-success">
                                  Excellent
                                </span>
                              )
                              : p.performance === "Good"
                                ? (
                                  <span className="badge bg-primary">
                                    Good
                                  </span>
                                )
                                : p.performance === "Average"
                                  ? (
                                    <span className="badge bg-warning text-dark">
                                      Average
                                    </span>
                                  )
                                  : (
                                    <span className="badge bg-danger">
                                      Poor
                                    </span>
                                  )
                          }

                        </td>

                        <td className="fw-bold text-success">

                          ₹ {p.netSalary}

                        </td>

                        <td>

                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() =>
                              setSelectedEmployee(p)
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    ))
                  )
                  : (
                    <tr>

                      <td
                        colSpan="6"
                        className="text-center"
                      >
                        No Data Found
                      </td>

                    </tr>
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* 🔥 VIEW MODAL */}
      {
        selectedEmployee && (

          <div
            className="modal d-block"
            style={{
              background:
                "rgba(0,0,0,0.5)"
            }}
          >

            <div className="modal-dialog modal-lg">

              <div className="modal-content">

                {/* 🔥 HEADER */}
                <div className="modal-header">

                  <h4>
                    Employee Salary Slip
                  </h4>

                  <button
                    className="btn-close"
                    onClick={() =>
                      setSelectedEmployee(null)
                    }
                  />

                </div>

                {/* 🔥 BODY */}
                <div className="modal-body">

                  <div className="row mb-4">

                    <div className="col-md-6">

                      <p>
                        Name:
                        {" "}
                        <b>
                          {
                            selectedEmployee.name
                          }
                        </b>
                      </p>

                      <p>
                        Department:
                        {" "}
                        <b>
                          {
                            selectedEmployee.department
                          }
                        </b>
                      </p>

                      <p>
                        Salary:
                        {" "}
                        <b>
                          ₹
                          {
                            selectedEmployee.baseSalary
                          }
                        </b>
                      </p>

                      <p>
                        Performance:
                        {" "}
                        <b>
                          {
                            selectedEmployee.performance
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
                            selectedEmployee.present
                          }
                        </b>
                      </p>

                      <p>
                        Absent:
                        {" "}
                        <b>
                          {
                            selectedEmployee.absent
                          }
                        </b>
                      </p>

                      <p>
                        Half Day:
                        {" "}
                        <b>
                          {
                            selectedEmployee.halfDay
                          }
                        </b>
                      </p>

                      <p>
                        Leaves:
                        {" "}
                        <b>
                          {
                            selectedEmployee.totalLeaves
                          }
                        </b>
                      </p>

                    </div>

                  </div>

                  {/* 🔥 SALARY TABLE */}
                  <table className="table table-bordered">

                    <tbody>

                      <tr>

                        <td>
                          PF
                        </td>

                        <td>
                          ₹
                          {
                            selectedEmployee.pf
                          }
                        </td>

                      </tr>

                      <tr>

                        <td>
                          Professional Tax
                        </td>

                        <td>
                          ₹
                          {
                            selectedEmployee.professionalTax
                          }
                        </td>

                      </tr>

                      <tr>

                        <td>
                          Attendance Cut
                        </td>

                        <td>
                          ₹
                          {
                            selectedEmployee.attendanceCut
                          }
                        </td>

                      </tr>

                      <tr>

                        <td>
                          Leave Cut
                        </td>

                        <td>
                          ₹
                          {
                            selectedEmployee.leaveCut
                          }
                        </td>

                      </tr>

                      <tr>

                        <td>
                          Bonus
                        </td>

                        <td className="text-success">

                          ₹
                          {
                            selectedEmployee.bonus
                          }

                        </td>

                      </tr>

                      <tr>

                        <td className="fw-bold">
                          Net Salary
                        </td>

                        <td className="fw-bold text-success">

                          ₹
                          {
                            selectedEmployee.netSalary
                          }

                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default Payroll