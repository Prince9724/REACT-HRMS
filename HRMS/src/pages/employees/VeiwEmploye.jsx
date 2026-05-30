import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { calculateAge } from "../../../utils/Age.js"

const ViewEmployee = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/employe/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err))
  }, [id])

  if (!user) return <p>Loading...</p>

  return (
    <div className="container mt-4">

      {/* 🔥 HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employee Details</h2>

        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>

      {/* 🔥 CARD */}
      <div className="card p-4 shadow-sm">

        <p><strong>ID:</strong> {user.id}</p>

        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>

        <p><strong>Contact:</strong> {user.contact}</p>

        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Pasword:</strong> {user.password}</p>

        {/* 🔥 NEW FIELDS */}
        <p><strong>Department:</strong> {user.department || "N/A"}</p>

        <p>
          <strong>Salary:</strong> ₹{" "}
          {user.salary ? user.salary.toLocaleString() : 0}
        </p>

        <p>
          <strong>Age:</strong>{" "}
          {user.birthdate ? calculateAge(user.birthdate) : "N/A"}
        </p>

        <p><strong>Birthdate:</strong> {user.birthdate || "N/A"}</p>

        <p><strong>Joining Date:</strong> {user.joiningDate || "N/A"}</p>

      </div>

    </div>
  )
}

export default ViewEmployee