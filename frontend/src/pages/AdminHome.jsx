// import React, { useEffect, useState } from 'react';
import React from 'react';
// import { deleteUser, get } from '../services/ApiEndpoint';
import '../assets/styles/AdminHome.css';
import AdminSidebar from '../components/AdminSidebar';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import { Logout } from '../redux/AuthSlice'
import { toast } from 'react-hot-toast';

const AdminHome = () => {
  const user=useSelector((state)=>state.Auth.user)
  console.log(user)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  // const gotoAdmin=()=>{
  //       navigate('/admin/home')
        
  // }

    const handleLogout=async()=>{
      try {
        const request= await post('/api/auth/logout')
        const response= request.data;
         if (request.status===200) {
             dispatch(Logout())
             toast.success(response.message)
            navigate('/login')
         }
      } catch (error) {
        console.log(error)
      }
    }

    return (
         <div className="admin-page-container">
            <AdminSidebar/>
            <div className='home-container'>
      <div className='user-card'>
        <h2> Welcome,{user && user.name}</h2>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
        
      </div>
     </div>

        </div>
    );
}

export default AdminHome;