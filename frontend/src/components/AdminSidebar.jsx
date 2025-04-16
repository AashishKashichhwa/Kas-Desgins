// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../assets/styles/Sidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        toast.success("Logout successful");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">Admin Panel</div>
            <ul className="sidebar-nav">
                <li className="sidebar-item">
                    <NavLink
                        to="/admin/home"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Home
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink
                        to="/admin/bookings"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Bookings
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Manage Users
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink
                        to="/admin/projects"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Manage Projects
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <button onClick={handleLogout} className="sidebar-link logout-button">Logout</button>
                </li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
