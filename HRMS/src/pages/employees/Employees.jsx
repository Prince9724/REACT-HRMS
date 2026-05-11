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

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const [showPassword, setShowPassword] = useState({})

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteUser(id))
    }
  }

  const handleEdit = (u) => setEditUser(u)

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

  const handleView = (id) => navigate(`/view/${id}`)

  const togglePasswordVisibility = (userId) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const filteredUsers = user
    ?.filter(u => roleFilter === "all" || u.role === roleFilter)
    ?.filter(u => departmentFilter === "all" || u.department === departmentFilter)
    ?.filter(u =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-primary mb-0">
            <i className="fa-solid fa-users me-2"></i>
            Employees
          </h3>
          <small className="text-muted">Manage all employee records</small>
        </div>

        <button className="btn btn-dark" onClick={() => navigate("/hr")}>
          <i className="fa-solid fa-arrow-left me-2"></i>
          Back
        </button>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-3">

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select className="form-select" value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="col-md-4">
            <select className="form-select" value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="all">All Departments</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="Flutter">Flutter</option>
            </select>
          </div>

        </div>
      </div>

      {/* STATUS */}
      {status === "loading" && <p className="text-center">Loading...</p>}
      {status === "failed" && <p className="text-center text-danger">{error}</p>}

      {/* CARDS */}
      <div className="row g-4">

        {filteredUsers?.map((u) => (
          <div className="col-lg-4 col-md-6 col-12" key={u.id}>

            <div className="card border-0 shadow-sm h-100 employee-card">

              {editUser?.id === u.id ? (

                /* EDIT MODE */
                <div className="p-3">

                  <input className="form-control mb-2" name="firstName" value={editUser.firstName} onChange={handleChange} />
                  <input className="form-control mb-2" name="lastName" value={editUser.lastName} onChange={handleChange} />
                  <input className="form-control mb-2" name="email" value={editUser.email} onChange={handleChange} />
                  <input className="form-control mb-2" name="contact" value={editUser.contact} onChange={handleChange} />
                  <input className="form-control mb-2" name="salary" value={editUser.salary} onChange={handleChange} />

                  <div className="d-flex gap-2">
                    <button className="btn btn-success w-50" onClick={handleUpdate}>
                      <i className="fa-solid fa-check me-1"></i> Save
                    </button>
                    <button className="btn btn-secondary w-50" onClick={() => setEditUser(null)}>
                      Cancel
                    </button>
                  </div>

                </div>

              ) : (

                /* VIEW MODE */
                <div className="p-3">

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-bold">
                      <i className="fa-solid fa-user me-2 text-primary"></i>
                      {u.firstName} {u.lastName}
                    </h5>

                    <span className={`badge ${u.role === "manager" ? "bg-danger" : "bg-primary"}`}>
                      {u.role}
                    </span>
                  </div>

                  <p className="mb-1 text-muted">
                    <i className="fa-solid fa-building me-2"></i>
                    {u.department || "N/A"}
                  </p>

                  <p className="mb-1">
                    <i className="fa-solid fa-phone me-2 text-success"> </i>
                   contact : {u.contact}
                  </p>

                  <p className="mb-2 fw-bold">
                    <i className="fa-solid fa-indian-rupee-sign me-2 text-warning"></i>
                    Salary: {u.salary}
                  </p>

                  {/* BUTTONS */}
                  {/* ACTION BUTTONS */}
                  <div className="d-flex gap-2 mt-3">

                    {/* VIEW */}
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleView(u.id)}
                    >
                      <i className="fa-solid fa-eye me-1"></i>
                      View
                    </button>

                    {/* EDIT */}
                    <button
                      className="btn btn-outline-warning btn-sm w-100"
                      onClick={() => handleEdit(u)}
                    >
                      <i className="fa-solid fa-pen me-1"></i>
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => handleDelete(u.id)}
                    >
                      <i className="fa-solid fa-trash me-1"></i>
                      Delete
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredUsers?.length === 0 && (
        <div className="text-center text-muted mt-5">
          <h5>No employees found</h5>
        </div>
      )}

    </div>
  )
}

export default Employees