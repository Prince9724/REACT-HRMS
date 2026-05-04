import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hrlogin = () => {

    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        contact: "",
        password: "",
        role: ""
    })

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:3000/employe")
            const users = await res.json()

            const foundUser = users.find(
                (u) =>
                    u.contact.toString() === loginData.contact &&
                    u.password === loginData.password &&
                    u.role.toLowerCase() === loginData.role.toLowerCase()
            )

            if (!foundUser) {
                alert("Invalid credentials ❌")
                return
            }

            // ✅ YAHI MISSING THA
            localStorage.setItem("user", JSON.stringify(foundUser))

            if (foundUser.role === "employee") {
                navigate("/profile")
            } else if (foundUser.role === "hr") {
                navigate("/hr")
            } else if (foundUser.role === "manager") {
                navigate("/manager")
            }

        } catch (error) {
            console.log(error)
            alert("Server error ❌")
        }
    }

    return (
        <div className='container d-flex justify-content-center align-items-center'>
            <div className='col-5 pt-5'>
                <form onSubmit={handleSubmit}>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            name="contact"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Role */}
                    <div className="mb-3">
                        <label className="form-label">Select Role</label>
                        <select
                            name="role"
                            className="form-control"
                            onChange={handleChange}
                        >
                            <option value="">-- Select Role --</option>
                            <option value="hr">HR</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Hrlogin