// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaBell } from 'react-icons/fa';
import '../assets/styles/Navbar.css';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice';
import { persistor } from '../redux/Store';
import { clearNotifications } from '../redux/notificationsSlice';

const Navbar = () => {
  const user = useSelector((state) => state.Auth.user);
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user) {
          const response = await getNotifications(user._id);
          console.log("API response:", response.data); // Add this line

          if (response.status === 200) {
            // Check if response.data is an array before dispatching
            if (Array.isArray(response.data)) {
              dispatch(setNotifications(response.data));
            } else if (typeof response.data === 'object' && response.data !== null && Array.isArray(response.data.notifications)) {
              dispatch(setNotifications(response.data.notifications));
            }
            else {
              console.error("Invalid API response format:", response.data);
              toast.error("Failed to load notifications. Invalid data format.");
              dispatch(setNotifications([])); // Dispatch an empty array to reset state
            }
          } else {
            console.error('Failed to fetch notifications:', response.status);
            toast.error('Failed to fetch notifications');
            dispatch(setNotifications([]));
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Error fetching notifications');
        dispatch(setNotifications([]));
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user, dispatch]);

  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleLogout = async () => {
    try {
      const request = await post('/api/auth/logout');
      if (request.status === 200) {
        // Clear persisted state and dispatch logout actions
        persistor.purge()
          .then(() => {
            dispatch(clearNotifications());
            dispatch(Logout());
            toast.success(request.data.message);
            navigate('/login');
          })
          .catch((error) => {
            console.error("Error purging persisted state:", error);
            toast.error("Logout failed.  Please try again.");
          });
      } else {
        console.error("Logout API failed:", request.status);
        toast.error("Logout failed.  Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed.  Please try again.");
    }
  };

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
          <li><Link to="/booking">Bookings</Link></li>
          <li className="products-link">
            <Link to="/products">Products</Link>
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart size={22} />
            </Link>
          </li>
        </ul>

        <div className="auth-section">
          {user ? (
            <div className="logged-in-auth">
              <div>
                <FaBell
                  size={22}
                  onClick={handleNotificationClick}
                  className="notification-icon"
                />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </div>
              <div className='loggedData'>
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
