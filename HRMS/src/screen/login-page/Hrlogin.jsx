import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Hrlogin = () => {

    const navigate = useNavigate()
    const location = useLocation()
    // const [showPassword, setShowPassword] = useState(false)
    const selectedRole = location.state?.role

    const [contact, setContact] = useState("")
    const [password, setPassword] = useState(["", "", "", ""])

    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [shake, setShake] = useState(false)

    // CONTACT
    const handleContact = (e) => {

        let value = e.target.value.replace(/\D/g, "")

        if (value.length <= 10) {
            setContact(value)
        }
    }

    // PASSWORD
    const handlePasswordChange = (value, index) => {

        if (!/^\d?$/.test(value)) return

        const updated = [...password]

        updated[index] = value

        setPassword(updated)

        // AUTO NEXT
        if (value && index < 3) {
            document
                .getElementById(`pin-${index + 1}`)
                .focus()
        }
    }

    // BACKSPACE
    const handleBackspace = (e, index) => {

        if (
            e.key === "Backspace" &&
            !password[index] &&
            index > 0
        ) {
            document
                .getElementById(`pin-${index - 1}`)
                .focus()
        }
    }

    // ERROR
    const triggerError = (msg) => {

        setError(msg)

        setShake(true)

        setTimeout(() => {
            setShake(false)
        }, 500)
    }

    // LOGIN
    const handleSubmit = async (e) => {

        e.preventDefault()

        setError("")

        if (!selectedRole) {

            triggerError(
                "Role not selected ❌"
            )

            navigate("/")

            return
        }

        if (contact.length !== 10) {

            triggerError(
                "Phone number must be 10 digits ❌"
            )

            return
        }

        const finalPassword =
            password.join("")

        if (finalPassword.length !== 4) {

            triggerError(
                "Password must be 4 digits ❌"
            )

            return
        }

        try {

            setLoading(true)

            const res = await fetch(
                "http://localhost:3000/employe"
            )

            const users = await res.json()

            const foundUser = users.find(
                (u) =>
                    u.contact.toString() === contact &&
                    u.password.toString() === finalPassword &&
                    u.role.toLowerCase() ===
                    selectedRole.toLowerCase()
            )

            // INVALID
            if (!foundUser) {

                setLoading(false)

                triggerError(
                    "Invalid password or role mismatch ❌"
                )

                return
            }

            // SAVE USER
            localStorage.setItem(
                "user",
                JSON.stringify(foundUser)
            )

            // NAVIGATION
            setTimeout(() => {

                if (foundUser.role === "employee") {
                    navigate("/profile")
                }

                else if (foundUser.role === "manager") {
                    navigate("/manager")
                }

                else if (foundUser.role === "hr") {
                    navigate("/hr")
                }

            }, 800)

        } catch (err) {

            console.log(err)

            triggerError(
                "Server error ❌"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <>

            {/* CSS */}
            <style>

                {`

                body{
                    overflow:hidden;
                }

                @keyframes moveBackground {

                    0%{
                        background-position: 0% 50%;
                    }

                    50%{
                        background-position: 100% 50%;
                    }

                    100%{
                        background-position: 0% 50%;
                    }
                }

                @keyframes floatingCircle {

                    0%{
                        transform: translateY(0px);
                    }

                    50%{
                        transform: translateY(-30px);
                    }

                    100%{
                        transform: translateY(0px);
                    }
                }

                @keyframes shake {

                    0%{
                        transform: translateX(0);
                    }

                    25%{
                        transform: translateX(-8px);
                    }

                    50%{
                        transform: translateX(8px);
                    }

                    75%{
                        transform: translateX(-8px);
                    }

                    100%{
                        transform: translateX(0);
                    }
                }

                `}
            </style>

            <div
                className='container-fluid min-vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden'
                style={{

                    background:
                        "linear-gradient(-45deg,#0f172a,#1e3a8a,#2563eb,#0f172a)",

                    backgroundSize: "400% 400%",

                    animation:
                        "moveBackground 10s ease infinite"
                }}
            >

                {/* BACKGROUND CIRCLES */}

                <div
                    className='position-absolute rounded-circle'
                    style={{
                        width: "250px",
                        height: "250px",
                        background: "rgba(255,255,255,0.08)",
                        top: "10%",
                        left: "5%",
                        animation:
                            "floatingCircle 5s ease-in-out infinite"
                    }}
                ></div>

                <div
                    className='position-absolute rounded-circle'
                    style={{
                        width: "180px",
                        height: "180px",
                        background: "rgba(255,255,255,0.06)",
                        bottom: "10%",
                        right: "8%",
                        animation:
                            "floatingCircle 6s ease-in-out infinite"
                    }}
                ></div>

                {/* LOGIN CARD */}

                <div
                    className='col-lg-4 col-md-6 col-11 bg-white shadow-lg position-relative'
                    style={{
                        borderRadius: "30px",
                        padding: "35px",
                        zIndex: 10,
                        animation:
                            shake
                                ? "shake 0.4s"
                                : "none",

                        backdropFilter:
                            "blur(10px)"
                    }}
                >

                    {/* HEADER */}

                    <div className='text-center mb-4'>

                        <div
                            className='mx-auto mb-3 d-flex align-items-center justify-content-center'
                            style={{
                                width: "85px",
                                height: "85px",
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(to right,#2563eb,#1d4ed8)",
                                color: "white",
                                fontSize: "38px",
                                boxShadow:
                                    "0 10px 30px rgba(37,99,235,0.4)"
                            }}
                        >
                            🔐
                        </div>

                        <h2 className='fw-bold mb-2'>
                            HRMS Login
                        </h2>

                        <p className='text-muted mb-0'>

                            Login as{" "}

                            <span className='fw-bold text-primary text-capitalize'>
                                {selectedRole || "Not Selected"}
                            </span>

                        </p>

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className='alert alert-danger text-center py-2 rounded-4'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* CONTACT */}

                        <div className='mb-4'>

                            <label className='form-label fw-semibold'>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={contact}
                                onChange={handleContact}
                                className='form-control'
                                placeholder='Enter 10 digit number'
                                style={{
                                    borderRadius: "15px",
                                    padding: "12px"
                                }}
                            />

                        </div>

                        {/* PASSWORD */}

                        {/* PASSWORD */}
                        <div className='mb-4'>

                            <label className='form-label fw-semibold'>
                                4 Digit Password
                            </label>

                            <div className='d-flex align-items-center gap-2'>

                                <div className='d-flex justify-content-between gap-2 flex-grow-1'>

                                    {password.map((digit, index) => (

                                        <input
                                            key={index}
                                            id={`pin-${index}`}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={digit}
                                            maxLength="1"
                                            className='form-control text-center fw-bold'
                                            style={{
                                                height: "60px",
                                                fontSize: "22px",
                                                borderRadius: "15px"
                                            }}
                                            onChange={(e) =>
                                                handlePasswordChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleBackspace(
                                                    e,
                                                    index
                                                )
                                            }
                                        />
                                    ))}

                                </div>

                                {/* EYE BUTTON */}
                                <button
                                    type="button"
                                    className='btn btn-light border d-flex align-items-center justify-content-center'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "15px"
                                    }}
                                >

                                    <i
                                        className={
                                            showPassword
                                                ? "ri-eye-off-line fs-4"
                                                : "ri-eye-line fs-4"
                                        }
                                    ></i>

                                </button>

                            </div>

                        </div>

                        {/* BUTTON */}

                        <button
                            type='submit'
                            className='btn btn-primary w-100'
                            disabled={loading}
                            style={{
                                padding: "14px",
                                borderRadius: "16px",
                                fontWeight: "bold",
                                fontSize: "17px"
                            }}
                        >

                            {loading
                                ? "Please wait..."
                                : "Login"}

                        </button>

                    </form>

                </div>

            </div>

        </>
    )
}

export default Hrlogin