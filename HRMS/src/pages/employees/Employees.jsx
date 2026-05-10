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

  // 🔥 Search + Role Filter + Department Filter
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // 🔥 Toggle password visibility
  const [showPassword, setShowPassword] = useState({})

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteUser(id))
    }
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

  // 🔥 Toggle password visibility for a specific user
  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  // 🔥 FILTER LOGIC (Role + Department + Search)
  const filteredUsers = user
    ?.filter(u => u && (roleFilter === "all" || u.role === roleFilter))
    ?.filter(u => departmentFilter === "all" || u.department === departmentFilter)
    ?.filter(u =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div className="container-fluid page-container">

      {/* 🔥 TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>

        <button className="btn btn-secondary" onClick={() => navigate("/hr")}>
          ⬅ Home
        </button>
      </div>

      {/* 🔥 SEARCH + ROLE FILTER + DEPARTMENT FILTER */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Flutter">Flutter</option>
          </select>
        </div>
      </div>

      {status === "loading" && <p className="text-center">Loading...</p>}
      {status === "failed" && <p className="text-center text-danger">{error}</p>}

      <div className="row scroll-box">

        {filteredUsers?.map((u) => (
          <div className="col-md-4 mb-3" key={u.id}>
            <div className="card p-3 shadow-sm h-100">

              {editUser?.id === u.id ? (
                // 🔥 EDIT MODE
                <>
                  <input 
                    name="firstName" 
                    value={editUser.firstName || ""} 
                    onChange={handleChange} 
                    className="form-control mb-1" 
                    placeholder="First Name"
                  />
                  <input 
                    name="lastName" 
                    value={editUser.lastName || ""} 
                    onChange={handleChange} 
                    className="form-control mb-1" 
                    placeholder="Last Name"
                  />
                  <input 
                    name="email" 
                    value={editUser.email || ""} 
                    onChange={handleChange} 
                    className="form-control mb-1" 
                    placeholder="Email"
                  />
                  <input 
                    name="contact" 
                    value={editUser.contact || ""} 
                    onChange={handleChange} 
                    className="form-control mb-1" 
                    placeholder="Contact"
                  />
                  
                  {/* 🔥 PASSWORD EDIT FIELD */}
                  <input 
                    name="password" 
                    value={editUser.password || ""} 
                    onChange={handleChange} 
                    className="form-control mb-1" 
                    placeholder="Password"
                    type="text"
                  />

                  <select 
                    name="department" 
                    value={editUser.department || ""} 
                    onChange={handleChange}
                    className="form-control mb-1"
                  >
                    <option value="">Select Department</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Flutter">Flutter</option>
                  </select>

                  <select 
                    name="role" 
                    value={editUser.role || "employee"} 
                    onChange={handleChange}
                    className="form-control mb-1"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>

                  <input 
                    name="salary" 
                    type="number"
                    value={editUser.salary || ""} 
                    onChange={handleChange} 
                    placeholder="Salary"
                    className="form-control mb-1"
                  />

                  <input 
                    type="date"
                    name="birthdate"
                    value={editUser.birthdate || ""}
                    onChange={handleChange}
                    className="form-control mb-1"
                  />

                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // 🔥 VIEW MODE
                <>
                  <h5 className="mb-2">
                    {u.firstName} {u.lastName}
                    <span className={`badge ms-2 ${u.role === 'manager' ? 'bg-danger' : 'bg-info'}`}>
                      {u.role}
                    </span>
                  </h5>

                  <p className="mb-1">
                    📧 <strong>Email:</strong> {u.email}
                  </p>

                  <p className="mb-1">
                    📱 <strong>Contact:</strong> {u.contact}
                  </p>

                  <p className="mb-1">
                    🏢 <strong>Department:</strong> {u.department || "N/A"}
                  </p>

                  <p className="mb-1">
                    💰 <strong>Salary:</strong> ₹ {u.salary ? u.salary.toLocaleString() : 0}
                  </p>

                  {/* 🔥 PASSWORD FIELD WITH TOGGLE */}
                  <p className="mb-1">
                    🔐 <strong>Password:</strong>{" "}
                    <span className="font-monospace">
                      {showPassword[u.id] ? u.password : "••••••"}
                    </span>
                    <button
                      className="btn btn-sm btn-link p-0 ms-2"
                      onClick={() => togglePasswordVisibility(u.id)}
                      style={{ textDecoration: "none" }}
                    >
                      {showPassword[u.id] ? "🙈 Hide" : "👁️ Show"}
                    </button>
                  </p>

                  {/* 🔥 AGE */}
                  <p className="mb-2">
                    🎂 <strong>Age:</strong>{" "}
                    <span className="fw-bold text-primary">
                      {u.birthdate ? calculateAge(u.birthdate) : "N/A"}
                    </span>
                  </p>

                  {/* 🔥 JOINING DATE */}
                  <p className="mb-2 small text-muted">
                    📅 Joined: {u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : "N/A"}
                  </p>

                  {/* 🔥 ACTION BUTTONS */}
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    <button className="btn btn-info btn-sm" onClick={() => handleView(u.id)}>
                      👁️ View
                    </button>

                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(u)}>
                      ✏️ Edit
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* 🔥 NO DATA FOUND */}
      {filteredUsers?.length === 0 && status !== "loading" && (
        <div className="text-center text-muted mt-5">
          <h5>No employees found</h5>
          <p>Try changing your search or filter criteria</p>
        </div>
      )}

    </div>
  )
}

export default Employees