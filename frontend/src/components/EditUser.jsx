// EditUser.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/EditUser.css';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const request = await get(`/api/admin/getuser/${id}`);
                const response = request.data;

                if (request.status === 200) {
                    setUser(response.user);
                    setName(response.user.name);
                    setEmail(response.user.email);
                    setRole(response.user.role);
                } else {
                    toast.error("Failed to fetch user.");
                }
            } catch (e) {
                toast.error("Failed to fetch user.");
                console.error(e);
            }
        };

        fetchUser();
    }, [id]);

    const handleUpdate = async () => {
        setLoading(true);
        setError('');
        try {
            const request = await put(`/api/admin/updateuser/${id}`, { name, email, role });
            const response = request.data;

            if (request.status === 200) {
                toast.success(response.message || "User updated successfully!");
                navigate('/admin/users');
            } else {
                setError(response.message || "Update failed!");
                toast.error("Update failed!");
            }
        } catch (e) {
            setError(e.response?.data?.message || "Update failed!");
            toast.error("Update failed!");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-user-container">
            {/* Cross Button */}
            <button className="closeButton" onClick={() => navigate('/admin/users')}>×</button>
            <h2>Edit User</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group-role">
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button className='update' onClick={handleUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
            </button>
        </div>
    );
};

export default EditUser;