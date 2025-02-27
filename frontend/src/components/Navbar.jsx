import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Logout } from '../redux/AuthSlice';
import { toast } from 'react-hot-toast';
import '../assets/styles/Navbar.css';

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
                    <Link to="/"><div className="logo">Kas Design</div></Link>
                
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                </ul>
                <div className="auth-section">
                    {user ? (
                        <div className="logged-in-auth">
                           <Link to="/" className="logoutBtn" onClick={handleLogout}>Logout</Link>
                            <span className="welcome-text">{user.name}</span>
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