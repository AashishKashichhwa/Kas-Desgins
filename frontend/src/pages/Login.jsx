import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import '../assets/styles/Login.css';

export default function Login() {
    const user = useSelector((state) => state.Auth.user);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    }

    if (user) {
        navigate(user.role === 'admin' ? '/admin' : '/user-home');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = await post('/api/auth/login', { email, password });
            const response = request.data;

            if (request.status === 200) {
                dispatch(SetUser(response.user));
                toast.success(response.message);
                navigate(response.user.role === 'admin' ? '/admin' : '/userhome');
            }
        } catch (error) {
            console.error(error);
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <>
            <div className="login-background"></div>
            <div className="login-container">
                <div className='loginTitle'>
                    <h2>Login</h2>
                    <div className="close" onClick={handleClose}>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p className="register-link">
                        Not registered? <Link to={'/register'}>Register here</Link>
                    </p>
                </form>
            </div>
        </>
    );
}