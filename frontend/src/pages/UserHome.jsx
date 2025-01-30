// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { post } from '../services/ApiEndpoint'
// import { Logout } from '../redux/AuthSlice'
// import { toast } from 'react-hot-toast';

// export default function Home() {
//   const user=useSelector((state)=>state.Auth.user)
//   console.log(user)
//   const navigate=useNavigate()
//   const dispatch=useDispatch()
//   const gotoAdmin=()=>{
//         navigate('/admin')
        
//   }
//   const handleLogout=async()=>{
//     try {
//       const request= await post('/api/auth/logout')
//       const response= request.data;
//        if (request.status===200) {
//            dispatch(Logout())
//            toast.success(response.message)
//           navigate('/login')
//        }
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   return (
//     <>

//      <div className='home-container'>
//       <div className='user-card'>
//         <h2> Welcome,{user && user.name}</h2>
//         <button className='logout-btn' onClick={handleLogout}>Logout</button>
//         {user && user.role==='admin' ? <button className='admin-btn' onClick={gotoAdmin}>Go To admin</button> :''}
        
//       </div>
//      </div>



//     </>
//   )
// }



import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { post } from '../services/ApiEndpoint';
// import { Logout } from '../redux/AuthSlice';
// import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import '../assets/styles/Home.css';

const CreativeSolutions = () => <section className="placeholder-section"><h2>Creative Solutions</h2></section>;
const OurInteriors = () => <section className="placeholder-section"><h2>Our Interiors Designed</h2></section>;
const ServicesProvided = () => <section className="placeholder-section"><h2>Services Provided</h2></section>;
const FeaturedProjects = () => <section className="placeholder-section"><h2>Our Featured Projects</h2></section>;
const HowWeWork = () => <section className="placeholder-section"><h2>How We Work</h2></section>;
const WhatPeopleThink = () => <section className="placeholder-section"><h2>What People Think</h2></section>;
const LatestPosts = () => <section className="placeholder-section"><h2>Latest Posts</h2></section>;


const UserHome = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <div className='auth-container'>
            </div>
            <CreativeSolutions />
            <OurInteriors />
            <ServicesProvided />
            <FeaturedProjects />
            <HowWeWork />
            <WhatPeopleThink />
            <LatestPosts />
            <Footer />
        </div>
    );
};

export default UserHome;