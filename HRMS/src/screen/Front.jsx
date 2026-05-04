import React from 'react'
import { useNavigate } from 'react-router-dom'
const Front = () => {
    const navigate = useNavigate();
    return (
        <div style={{ height: "100vh" }} className='container-fluid bg-dark text-white'>
            <div className="container d-flex flex-column gap-3 align-items-center">
                <h1 className='text-white mt-3'>HRMS</h1>
                <h4>Welcome To Hrms </h4>
                <h5 className='pb-3'>Please select your role and go to you profile </h5>
                <div className='role-box text-white d-flex flex-wrap justify-content-center gap-3'>
                    <div className='col-3 border border-2 p-2 rounded'>
                        <h3>Employee</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, nesciunt.</p>
                        <button className='btn btn-outline-info' onClick={() => navigate("/hrlogin")}>Go</button>
                    </div>
                    <div className='col-3 border   border-2 p-2 rounded'>
                        <h3>Manager</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, nesciunt.</p>
                        <button className='btn btn-outline-info' onClick={() => navigate("/hrlogin")} >Go</button>
                    </div>
                    <div className='col-3 border border-2 p-2 rounded'>
                        <h3>Admin</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, nesciunt.</p>
                        <button className='btn btn-outline-info' onClick={() => navigate("/hrlogin")} >Go</button>
                    </div>
                </div>
                <div className='col-10 mt-5'>
                    <p>HRMS ek secure aur smart system hai jahan employees, managers aur admin apna data manage kar sakte hain. Role select karke login karein aur easy, organized work experience paayen.</p>
                </div>
            </div>
        </div>
    )
}

export default Front