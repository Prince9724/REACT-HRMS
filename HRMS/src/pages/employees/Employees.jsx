import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUser, deleteUser, updateUser } from "../../feature/userslice/userSlice"
import { useNavigate } from "react-router-dom"
import "../employees/Employe.css"

const Employees = () => {
  const { user, status, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [editUser, setEditUser] = useState(null)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
  }

  const handleEdit = (u) => {
    setEditUser(u)
  }

  const handleChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value
    })
  }

  // 🔥 UPDATED SAVE (salary number me)
  const handleUpdate = () => {
    dispatch(updateUser({
      ...editUser,
      salary: Number(editUser.salary)
    }))
    setEditUser(null)
  }

  const handleView = (id) => {
    navigate(`/view/${id}`)
  }

  return (
    <div className="container mt-4">
      <h2>Employees</h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}

      <div className="row scroll-box">
        {user
          ?.filter(u => u && u.role === "employee")
          .map((u) => (
            <div className="col-md-4 mb-3" key={u.id}>
              <div className="card p-3">

                {editUser?.id === u.id ? (
                  <>
                    <input name="firstName" value={editUser.firstName} onChange={handleChange} />
                    <input name="lastName" value={editUser.lastName} onChange={handleChange} />
                    <input name="email" value={editUser.email} onChange={handleChange} />
                    <input name="contact" value={editUser.contact} onChange={handleChange} />

                    {/* 🔥 NEW FIELDS */}
                    <input 
                      name="department" 
                      value={editUser.department || ""} 
                      onChange={handleChange} 
                      placeholder="Department"
                    />

                    <input 
                      name="salary" 
                      type="number"
                      value={editUser.salary || ""} 
                      onChange={handleChange} 
                      placeholder="Salary"
                    />

                    <button className="btn btn-success mt-2" onClick={handleUpdate}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h5>{u.firstName} {u.lastName}</h5>
                    <p>Email: {u.email}</p>
                    <p>Contact: {u.contact}</p>

                    {/* 🔥 NEW DISPLAY */}
                    <p>Department: {u.department || "N/A"}</p>
                    <p>Salary: ₹ {u.salary ? u.salary.toLocaleString() : 0}</p>

                    <button className="btn btn-info me-2" onClick={() => handleView(u.id)}>
                      View
                    </button>

                    <button className="btn btn-warning me-2" onClick={() => handleEdit(u)}>
                      Edit
                    </button>

                    <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Employees