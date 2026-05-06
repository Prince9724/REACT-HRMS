import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

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
      <h2>Employee Details</h2>

      <div className="card p-4">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {user.contact}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  )
}

export default ViewEmployee