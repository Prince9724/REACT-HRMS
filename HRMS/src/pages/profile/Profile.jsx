import React, { useEffect, useState } from 'react'

const Profile = () => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"))
    setUser(data)
  }, [])

  if (!user) {
    return <h3>No user logged in</h3>
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">

        <h3 className="text-primary mb-3">
          {user.role || "No Role"}
        </h3>

        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {user.contact}</p>

      </div>
    </div>
  )
}

export default Profile