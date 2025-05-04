import React, { useEffect, useState } from 'react';
import { deleteUser, get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/AdminHome.css';
import AdminSidebar from './AdminSidebar';
import { Link } from 'react-router-dom'; // Import Link

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [userDeleted, setUserDeleted] = useState(false);

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const request = await get('/api/admin/getuser');
                const response = request.data;
                if (request.status === 200) {
                    setUsers(response.users);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch users.");
            }
        };
        GetUsers();
    }, [userDeleted]);

    const handleDelete = async (id) => {
        try {
            const request = await deleteUser(`/api/admin/deleteuser/${id}`);
            const response = request.data;
            if (request.status === 200) {
                toast.success(response.message);
                setUserDeleted(!userDeleted);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to delete user.");
            }
        }
    };

    return (
        <div className="admin-page-container">
            <AdminSidebar />

            <main className="main-content">
                <div className="admin-container">
                    <div className="manage-users-header">
                        <h2>Manage Users</h2>
                        <Link to="/register" className="add-user-button">
                            Add User
                        </Link>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((elem) => (
                                    <tr key={elem._id}>
                                        <td>{elem.name}</td>
                                        <td>{elem.email}</td>
                                        <td>{elem.role}</td>
                                        <td class="action">
                                            <Link to={`/admin/edituser/${elem._id}`} className="edit-button">Edit</Link> {/* Added Edit Button */}
                                            <button className='deleteBtn' onClick={() => handleDelete(elem._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default ManageUsers;