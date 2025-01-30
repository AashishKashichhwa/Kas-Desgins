import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';
import { toast } from 'react-hot-toast';
import '../assets/styles/Navbar.css'; // Updated CSS import path

const Navbar = () => {
    const user = useSelector((state) => state.Auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">LOGO</div>
                <ul className="nav-links">
                    <li><a href="/about">About</a></li>
                    <li><a href="/service">Service</a></li>
                    <li><a href="/projects">Projects</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
                <div className="auth-section">
                    {user ? (
                        <>
                            <span className="welcome-text">Welcome, {user.name}</span>
                            <a href="/" className="logoutBtn"  onClick={handleLogout} >Logout</a>

                        </>
                    ) : (
                        <div className="login-signup">
                            <a href="/login">Login</a> | <a href="/register">Sign Up</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
