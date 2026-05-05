import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser, deleteUser, updateUser } from '../../feature/userslice/userSlice'

const Employees = () => {

    const { user, status, error } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [editUser, setEditUser] = useState(null)

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    // delete handler
    const handleDelete = (id) => {
        dispatch(deleteUser(id))
    }

    // edit open
    const handleEdit = (u) => {
        setEditUser(u)
    }

    // input change
    const handleChange = (e) => {
        setEditUser({
            ...editUser,
            [e.target.name]: e.target.value
        })
    }

    // save update
    const handleUpdate = () => {
        dispatch(updateUser(editUser))
        setEditUser(null)
    }

    return (
        <div className="container mt-4">
            <h2>Employees List</h2>

            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}

            <div className="row">
                {status === "succeeded" &&
                    user.map((u) => (
                        <div className="col-md-4 mb-3" key={u.id}>
                            <div className="card p-3">

                                {editUser?.id === u.id ? (
                                    <>
                                        <input name="role" value={editUser.role} onChange={handleChange} />
                                        <input name="firstName" value={editUser.firstName} onChange={handleChange} />
                                        <input name="lastName" value={editUser.lastName} onChange={handleChange} />
                                        <input name="email" value={editUser.email} onChange={handleChange} />
                                        <input name="contact" value={editUser.contact} onChange={handleChange} />

                                        <button className="btn btn-success mt-2" onClick={handleUpdate}>
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h5>{u.role}</h5>
                                        <p>{u.firstName} {u.lastName}</p>
                                        <p>{u.email}</p>
                                        <p>{u.contact}</p>

                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(u)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Employees