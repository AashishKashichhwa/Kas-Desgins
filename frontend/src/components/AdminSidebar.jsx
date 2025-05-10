// src/component/AdminSideBar.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import '../assets/styles/Sidebar.css';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.Auth.user);
    const notifications = useSelector((state) => state.notifications.notifications);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const count = notifications.filter(
            notification => !notification.read && notification.adminId === user._id
        ).length;
        setUnreadCount(count);
    }, [notifications, user]);

    const handleLogout = async () => {
        try {
            const request = await post('/api/auth/logout');
            if (request.status === 200) {
                dispatch(Logout());
                toast.success(request.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
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
                        to="/admin/notifications"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Notifications
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
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
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        Manage Products
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <button onClick={handleLogout} className="sidebar-link logout-button">
                        Logout
                    </button>
                </li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
