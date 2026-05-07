import React, { useState } from 'react'
import {
    useNavigate,
    useLocation
} from 'react-router-dom'

const Hrlogin = () => {

    const navigate = useNavigate()
    const location = useLocation()

    // ✅ FRONT PAGE SE ROLE AAYEGA
    const selectedRole =
        location.state?.role

    const [loginData, setLoginData] =
        useState({
            contact: "",
            password: ""
        })

    // ✅ INPUT CHANGE
    const handleChange = (e) => {

        let value = e.target.value

        // ✅ CONTACT ONLY 10 DIGITS
        if (e.target.name === "contact") {
            value = value.replace(/\D/g, "")

            if (value.length > 10) {
                return
            }
        }

        setLoginData({
            ...loginData,
            [e.target.name]: value
        })
    }

    // ✅ LOGIN
    const handleSubmit = async (e) => {

        e.preventDefault()

        // ✅ ROLE CHECK
        if (!selectedRole) {

            alert(
                "Please select role from front page ❌"
            )

            navigate("/")

            return
        }

        // ✅ PHONE VALIDATION
        if (
            loginData.contact.length !== 10
        ) {

            alert(
                "Phone number must be exactly 10 digits ❌"
            )

            return
        }

        try {

            const res =
                await fetch(
                    "http://localhost:3000/employe"
                )

            const users =
                await res.json()

            const foundUser =
                users.find(
                    (u) =>
                        u.contact.toString() ===
                        loginData.contact &&
                        u.password ===
                        loginData.password &&
                        u.role.toLowerCase() ===
                        selectedRole.toLowerCase()
                )

            // ✅ INVALID
            if (!foundUser) {

                alert(
                    "its  not you role ❌"
                )

                return
            }

            // ✅ SAVE USER
            localStorage.setItem(
                "user",
                JSON.stringify(foundUser)
            )

            // ✅ NAVIGATE ROLE WISE
            if (
                foundUser.role ===
                "employee"
            ) {

                navigate("/profile")

            } else if (
                foundUser.role === "hr"
            ) {

                navigate("/hr")

            } else if (
                foundUser.role ===
                "manager"
            ) {

                navigate("/manager")
            }

        } catch (error) {

            console.log(error)

            alert(
                "Server error ❌"
            )
        }
    }

    return (

        <div
            className='container-fluid min-vh-100 d-flex justify-content-center align-items-center'
            style={{
                background:
                    "linear-gradient(to right, #0f172a, #1e293b)"
            }}
        >

            <div
                className='col-lg-4 col-md-6 col-11 bg-white p-4 shadow-lg'
                style={{
                    borderRadius: "20px"
                }}
            >

                {/* HEADING */}
                <div className='text-center mb-4'>

                    <h2 className='fw-bold'>
                        HRMS Login
                    </h2>

                    <p className='text-muted'>
                        Login as{" "}
                        <span className='fw-bold text-primary text-capitalize'>
                            {selectedRole}
                        </span>
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* CONTACT */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="contact"
                            className="form-control"
                            placeholder='Enter 10 digit number'
                            value={
                                loginData.contact
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4">

                        <label className="form-label fw-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder='Enter password'
                            value={
                                loginData.password
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    )
}

export default Hrlogin