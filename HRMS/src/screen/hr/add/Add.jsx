import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import "../add/Add.css"
import axios from 'axios'

 
import { calculateAge } from "../../../../utils/Age.js"

const Add = () => {

    const navigate = useNavigate();
    const [member, setmember] = useState({});

    // 🔥 REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/

    const handlePost = async () => {

        // 🔥 BASIC VALIDATION
        if (!member.firstName || !member.email || !member.salary || !member.role || !member.contact || !member.birthdate) {
            alert("Please fill all required fields")
            return
        }

        // 🔥 EMAIL VALIDATION
        if (!emailRegex.test(member.email)) {
            alert("Invalid Email Format")
            return
        }

        // 🔥 PHONE VALIDATION
        if (!phoneRegex.test(member.contact)) {
            alert("Phone must be 10 digits only")
            return
        }

        // 🔥 AGE VALIDATION (UTILS)
        const age = calculateAge(member.birthdate)

        if (age < 15) {
            alert("Age must be at least 15 years")
            return
        }

        try {

            const res = await axios.post("http://localhost:3000/employe", {
                ...member,
                salary: Number(member.salary),

                // 🔥 AUTO JOINING DATE
                joiningDate: new Date().toLocaleString()
            })

            console.log(res.data)
            alert("Successful !!")
            navigate("/hr")

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">

            <div className="col-md-6">

                <h1 className="fw-bold text-primary mb-2">Welcome to XCELTECH</h1>
                <p className="text-muted mb-4">Register your account</p>

                <div className="row g-3">

                    {/* First Name */}
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text"
                            onChange={(e) => setmember({ ...member, firstName: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Role */}
                    <div className="col-md-6">
                        <label>Role</label>
                        <select
                            className="form-control"
                            value={member.role || ""}
                            onChange={(e) => setmember({ ...member, role: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div className="col-md-6">
                        <label>Department</label>
                        <select
                            className="form-control"
                            value={member.department || ""}
                            onChange={(e) => setmember({ ...member, department: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                            <option value="AI/ML">AI / ML</option>
                            <option value="Flutter">Flutter</option>
                        </select>
                    </div>

                    {/* Salary */}
                    <div className="col-md-6">
                        <label>Salary</label>
                        <input type="number"
                            onChange={(e) => setmember({ ...member, salary: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <label>Email</label>
                        <input type="email"
                            onChange={(e) => setmember({ ...member, email: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                        <label>Phone</label>
                        <input type="text"
                            onChange={(e) => setmember({ ...member, contact: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Birthdate */}
                    <div className="col-md-6">
                        <label>Birthdate</label>
                        <input type="date"
                            onChange={(e) => setmember({ ...member, birthdate: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                        <label>Password</label>
                        <input type="password"
                            onChange={(e) => setmember({ ...member, password: e.target.value })}
                            className="form-control" />
                    </div>

                    {/* Button */}
                    <div className="col-12 mt-3">
                        <button className="btn btn-primary" onClick={handlePost}>
                            Create Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Add