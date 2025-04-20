import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate
import { post } from '../services/ApiEndpoint'
import { toast } from 'react-hot-toast';
import '../assets/styles/Register.css'; // Import the CSS

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClose = () => {
    navigate('/login');
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('/api/auth/register', { name, email, password })
      const response = request.data // Corrected typo: reposne -> response

      if (request.status === 200) {
        toast.success(response.message)
        navigate('/login'); // Redirect to login page after successful registration
      }
      console.log(response)
    } catch (error) {
      console.error(error) // Use console.error for error logging
      toast.error("Registration failed. Please try again."); // Show a user-friendly error message

    }
  }

  return (
    <>
    <div className="register-background"></div>
      <div className='register-container'>
      <div className='registerTitle'>
                    <h2>Register</h2>
                    <div className="close" onClick={handleClose}>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              name="username" // Add name attribute for form handling
              id="username"
              required // Add required attribute for validation
            />
          </div>
          <div className='input-group'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email" // Add name attribute for form handling
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              required // Add required attribute for validation
            />
          </div>
          <div className='input-group'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password" // Add name attribute for form handling
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required // Add required attribute for validation
            />
          </div>
          <button type='submit'>Register</button>
          <p className='register-link'>
            Already have an account? <Link to={'/login'}>Login here</Link>
          </p>
        </form>
      </div>
    </>
  )
}