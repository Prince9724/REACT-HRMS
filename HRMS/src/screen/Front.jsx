import React from 'react'
import { useNavigate } from 'react-router-dom'

const Front = () => {

    const navigate = useNavigate()

    // ✅ ROLE NAVIGATION ==
    const handleRole = (role) => {

        navigate("/loginpage", {
            state: { role }
        })
    }

    return (

        <div
            className='container-fluid min-vh-100 d-flex align-items-center justify-content-center'
            style={{
                background:
                    "linear-gradient(to right, #0f172a, #1e293b)"
            }}
        >

            <div className="container py-5">

                {/* HEADER **/}
                <div className="text-center mb-5">

                    <h1
                        className='fw-bold text-white'
                        style={{
                            fontSize: "60px",
                            letterSpacing: "3px"
                        }}
                    >
                        HRMS
                    </h1>

                    <h4 className='text-info mt-3 fw-semibold'>
                        Welcome To HRMS
                    </h4>

                    <p
                        className='text-light mt-3 mx-auto'
                        style={{
                            maxWidth: "750px",
                            lineHeight: "30px",
                            opacity: "0.8",
                            fontSize: "17px"
                        }}
                    >
                        HRMS ek secure aur smart employee management system hai
                        jahan Employees, Managers aur HR Admin apna work,
                        attendance, leaves aur reports easily manage kar sakte hain.
                        Continue karne ke liye apna role select kijiye.
                    </p>

                </div>

                {/* ROLE CARDS */}
                <div className='row justify-content-center g-4'>

                    {/* EMPLOYEE */}
                    <div className='col-lg-4 col-md-6'>

                        <div
                            className='card border-0 shadow-lg h-100 p-4 text-center'
                            style={{
                                borderRadius: "25px",
                                background: "#ffffff",
                                transition: "0.3s"
                            }}
                        >

                            <div
                                className='mx-auto mb-4 d-flex align-items-center justify-content-center'
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    borderRadius: "50%",
                                    background: "#dbeafe",
                                    fontSize: "40px"
                                }}
                            >
                                👨‍💼
                            </div>

                            <h3 className='fw-bold'>
                                Employee
                            </h3>

                            <p
                                className='text-muted mt-3'
                                style={{
                                    lineHeight: "28px"
                                }}
                            >
                                Attendance manage karein,
                                leaves apply karein aur
                                apna profile access karein.
                            </p>

                            <button
                                className='btn btn-primary mt-3 fw-semibold'
                                style={{
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                                onClick={() =>
                                    handleRole("employee")
                                }
                            >
                                Continue
                            </button>

                        </div>

                    </div>

                    {/* MANAGER */}
                    <div className='col-lg-4 col-md-6'>

                        <div
                            className='card border-0 shadow-lg h-100 p-4 text-center'
                            style={{
                                borderRadius: "25px",
                                background: "#ffffff"
                            }}
                        >

                            <div
                                className='mx-auto mb-4 d-flex align-items-center justify-content-center'
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    borderRadius: "50%",
                                    background: "#fef3c7",
                                    fontSize: "40px"
                                }}
                            >
                                🧑‍💻
                            </div>

                            <h3 className='fw-bold'>
                                Manager
                            </h3>

                            <p
                                className='text-muted mt-3'
                                style={{
                                    lineHeight: "28px"
                                }}
                            >
                                Team monitor karein,
                                reports dekhein aur
                                employees ka data manage karein.
                            </p>

                            <button
                                className='btn btn-warning mt-3 text-white fw-semibold'
                                style={{
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                                onClick={() =>
                                    handleRole("manager")
                                }
                            >
                                Continue
                            </button>

                        </div>

                    </div>

                    {/* HR ADMIN */}
                    <div className='col-lg-4 col-md-6'>

                        <div
                            className='card border-0 shadow-lg h-100 p-4 text-center'
                            style={{
                                borderRadius: "25px",
                                background: "#ffffff"
                            }}
                        >

                            <div
                                className='mx-auto mb-4 d-flex align-items-center justify-content-center'
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    borderRadius: "50%",
                                    background: "#dcfce7",
                                    fontSize: "40px"
                                }}
                            >
                                🛡️
                            </div>

                            <h3 className='fw-bold'>
                                HR Admin
                            </h3>

                            <p
                                className='text-muted mt-3'
                                style={{
                                    lineHeight: "28px"
                                }}
                            >
                                Complete HRMS system,
                                employees aur departments
                                ko control karein.
                            </p>

                            <button
                                className='btn btn-success mt-3 fw-semibold'
                                style={{
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                                onClick={() =>
                                    handleRole("hr")
                                }
                            >
                                Continue
                            </button>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}
                <div className='text-center mt-5'>

                    <p
                        className='text-light'
                        style={{
                            opacity: "0.7",
                            letterSpacing: "1px"
                        }}
                    >
                        © 2026 HRMS • Smart Employee Management System
                    </p>

                </div>

            </div>

        </div>
    )
}

export default Front    