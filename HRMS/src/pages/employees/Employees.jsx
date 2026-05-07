import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUser, deleteUser, updateUser } from "../../feature/userslice/userSlice"
import { useNavigate } from "react-router-dom"
import { calculateAge } from "../../../utils/Age.js"
import "../employees/Employe.css"

const Employees = () => {
  const { user, status, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [editUser, setEditUser] = useState(null)

  // 🔥 Search + Filter
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

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

  // 🔥 FILTER LOGIC
  const filteredUsers = user
    ?.filter(u => u && (roleFilter === "all" || u.role === roleFilter))
    ?.filter(u =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div className="container mt-4">

      {/* 🔥 TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>

        <button className="btn btn-secondary" onClick={() => navigate("/hr")}>
          ⬅ Home
        </button>
      </div>

      {/* 🔥 SEARCH + FILTER */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}

      <div className="row scroll-box">

        {filteredUsers?.map((u) => (
          <div className="col-md-4 mb-3" key={u.id}>
            <div className="card p-3 shadow-sm">

              {editUser?.id === u.id ? (
                <>
                  <input name="firstName" value={editUser.firstName} onChange={handleChange} className="form-control mb-1" />
                  <input name="lastName" value={editUser.lastName} onChange={handleChange} className="form-control mb-1" />
                  <input name="contact" value={editUser.contact} onChange={handleChange} className="form-control mb-1" />

                  <input 
                    name="department" 
                    value={editUser.department || ""} 
                    onChange={handleChange} 
                    placeholder="Department"
                    className="form-control mb-1"
                  />

                  <input 
                    name="salary" 
                    type="number"
                    value={editUser.salary || ""} 
                    onChange={handleChange} 
                    placeholder="Salary"
                    className="form-control mb-1"
                  />

                  {/* 🔥 Birthdate edit */}
                  <input 
                    type="date"
                    name="birthdate"
                    value={editUser.birthdate || ""}
                    onChange={handleChange}
                    className="form-control mb-1"
                  />

                  <button className="btn btn-success mt-2" onClick={handleUpdate}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h5>{u.firstName} {u.lastName}</h5>

                  <p>📱 {u.contact}</p>
                  <p>🏢 {u.department || "N/A"}</p>
                  <p>💰 ₹ {u.salary ? u.salary.toLocaleString() : 0}</p>

                  {/* 🔥 AGE */}
                  <p>
                    🎂 Age:{" "}
                    <span className="fw-bold text-primary">
                      {u.birthdate ? calculateAge(u.birthdate) : "N/A"}
                    </span>
                  </p>

                  {/* 🔥 ACTION BUTTONS */}
                  <div className="mt-2">
                    <button className="btn btn-info me-2" onClick={() => handleView(u.id)}>
                      View
                    </button>

                    <button className="btn btn-warning me-2" onClick={() => handleEdit(u)}>
                      Edit
                    </button>

                    <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </div>
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