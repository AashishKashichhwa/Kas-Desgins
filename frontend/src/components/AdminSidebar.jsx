// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../assets/styles/Sidebar.css'; // Make sure this path is correct

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        toast.success("Logout successful"); // optional user feedback
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">Admin Panel</div>
            <ul className="sidebar-nav">
                <li className="sidebar-item">
                    <Link to="/admin/home" className="sidebar-link">Home</Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/admin/bookings" className="sidebar-link">Bookings</Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/admin/users" className="sidebar-link">Manage Users</Link>
                </li>
                <li className="sidebar-item">
                    <Link to="/admin/projects" className="sidebar-link">Manage Projects</Link>
                </li>
                <li className="sidebar-item">
                    <button onClick={handleLogout} className="sidebar-link logout-button">Logout</button>
                </li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;