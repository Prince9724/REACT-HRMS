import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '../../feature/userslice/userSlice'

const Employees = () => {

    const { user, status, error } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Employees List</h2>

            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}

            <div className="row">
                {status === "succeeded" &&
                    user.map((u) => (
                        <div className="col-md-4 mb-3" key={u.id}>
                            <div className="card shadow-sm p-3">

                                {/* 🔥 Role top pe */}
                                <h5 className="text-primary">
                                    {u.role || "No Role"}
                                </h5>

                                {/* Name niche */}
                                <p>
                                    <strong>Name:</strong> {u.firstName || ""} {u.lastName || ""}
                                </p>

                                <p><strong>Email:</strong> {u.email || "N/A"}</p>
                                <p><strong>Contact:</strong> {u.contact || "N/A"}</p>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Employees