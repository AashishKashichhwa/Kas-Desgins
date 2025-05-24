import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import '../assets/styles/Sidebar.css';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';
import { persistor } from '../redux/Store'; // Import the persistor
import { clearNotifications } from '../redux/notificationsSlice'; // Import clearNotifications

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
                // Clear persisted state and dispatch logout actions
                persistor.purge()
                    .then(() => {
                        dispatch(clearNotifications()); // Dispatch the action
                        dispatch(Logout());
                        toast.success(request.data.message);
                        navigate('/login');
                    })
                    .catch((error) => {
                        console.error("Error purging persisted state:", error);
                        toast.error("Logout failed. Please try again.");
                    });
            } else {
                console.error("Logout API failed:", request.status);
                toast.error("Logout failed. Please try again.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Logout failed. Please try again.");
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

                                {/* ADD THIS ORDER LINK */}
                                <li className="sidebar-item">
                    <NavLink
                        to="/admin/orders" // Route to ViewOrder.jsx
                        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                    >
                        View Orders
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