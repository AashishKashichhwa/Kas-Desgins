import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaBell } from 'react-icons/fa'; // 🛒 Cart Icon and Bell Icon
import '../assets/styles/Navbar.css';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice'; // Make sure this exists

const Navbar = () => {
    const user = useSelector((state) => state.Auth.user);
    const notifications = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications when the user is available
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (user) {
                    const response = await getNotifications(user._id);
                    if (response.status === 200) {
                        dispatch(setNotifications(response.data)); // Store notifications in Redux state
                    }
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user, dispatch]);

    // Calculate unread notifications count
    useEffect(() => {
        const count = notifications.filter(notification => !notification.read).length;
        setUnreadCount(count);
    }, [notifications]);

    // Logout function
    const handleLogout = async () => {
        try {
            const request = await post('/api/auth/logout');
            if (request.status === 200) {
                dispatch(Logout());
                toast.success(request.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Navigate to Notifications page on bell click
    const handleNotificationClick = () => {
        if (user?.role === 'admin') {
            navigate("/admin/notifications");
        } else {
            navigate("/userhome/notifications");
        }
    };
    

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/"><div className="logo">Kas Design</div></Link>
                
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Booking</Link></li>
                    <li className="products-link">
                        <Link to="/products">Products</Link>
                        {/* 🛒 Cart Icon next to Products */}
                        <Link to="/cart" className="cart-icon">
                            <FaShoppingCart size={22} />
                        </Link>
                    </li>
                </ul>

                <div className="auth-section">
                    {user ? (
                        <div className="logged-in-auth">
                            <div>
                            {/* Notifications Icon */}
                            <FaBell 
                                size={22} 
                                onClick={handleNotificationClick} // Navigate to notifications page
                                className="notification-icon"
                            />
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </div>
                            <div className='loggedData'>
                            {/* Logout and Username */}
                            <Link to="/" className="logoutBtn" onClick={handleLogout}>Logout</Link>
                            <span className="welcome-text">{user.name}</span>
                            </div>
                        </div>

                    ) : (
                        <div className="login-signup">
                            <Link to="/login">Login</Link> | <Link to="/register">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
