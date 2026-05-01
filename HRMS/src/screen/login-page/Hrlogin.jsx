import React from 'react'
import { useNavigate } from 'react-router'
const Hrlogin = () => {
    const navigate = useNavigate()
    return (
        <div className='container d-flex justify-content-center align-items-center'>
            <div className='col-5 pt-5'>
                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                        />
                        <div id="emailHelp" className="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                        />
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">
                            Check me out
                        </label>
                    </div>
                    <button type="submit" onClick={()=>navigate("/hr")} className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>

        </div>
    )
}

export default Hrlogin