import React from 'react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import "../add/Add.css"
 import axios from 'axios'
//  import employ from '../../../../utils/Api'
const Add = () => {
    const res = axios.post();
    const navigate = useNavigate();
    const [member , setmember] = useState({});
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">

            <div className="col-md-6">

                <h1 className="fw-bold text-primary mb-2">Welcome to XCELTECH</h1>
                <p className="text-muted mb-4">Register your account</p>

                <div className="row g-3">

                    <div className="col-md-6">
                        <label className="form-label text-primary">First Name</label>
                        <input type="text" onChange={(e)=>setmember({...member, firstName: e.target.value})} className="form-control shadow-sm" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-primary">Last Name</label>
                        <input type="text"
                            onChange={(e)=>setmember({...member, lastName: e.target.value})}
                        className="form-control shadow-sm" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-primary">E-mail Address</label>
                        <input type="email"
                            onChange={(e)=>setmember({...member, email: e.target.value})}
                        className="form-control shadow-sm" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-primary">Phone Number</label>
                        <input type="text"
                          onChange={(e)=>setmember({...member, contact: e.target.value})}  
                        className="form-control shadow-sm" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-primary">Password</label>
                        <input type="password"
                            onChange={(e)=>setmember({...member, pasword: e.target.value})}
                        className="form-control shadow-sm" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-primary">Confirm Password</label>
                        <input type="password" className="form-control shadow-sm" />
                    </div>

                    <div className="col-12 mt-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label text-muted">
                                Yes, I want to receive KPIS newsletters
                            </label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label text-muted">
                                I agree to all the <span className="text-primary">Terms</span>,{" "}
                                <span className="text-primary">Privacy Policy</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <button className="btn btn-primary px-5 py-2">
                            Create Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Add