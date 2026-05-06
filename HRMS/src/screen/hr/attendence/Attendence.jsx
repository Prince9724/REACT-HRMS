import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAttendance } from "../../../feature/AttendenceSlice"

const Attendance = () => {
  const dispatch = useDispatch()

  const { attendance = [], status, error } = useSelector(
    (state) => state.attendance || {}
  )

  useEffect(() => {
    dispatch(fetchAttendance())
  }, [dispatch])

  return (
    <div className="container mt-4">
      <h2>Attendance List</h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length > 0 ? (
            attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.userId}</td>
                <td>{a.name}</td>
                <td>{a.date}</td>
                <td>{a.checkIn}</td>
                <td>{a.checkOut || "--"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Attendance Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Attendance