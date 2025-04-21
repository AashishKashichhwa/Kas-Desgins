import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ViewProjectsUser from '../components/ViewProjectsUser';
import  '../assets/styles/Projects.css';

const Project = () => {
  return (
    <div>
      <Navbar/>
      <h2>Projects</h2>
      <ViewProjectsUser/>
      <Footer/>
    </div>
  )
}

export default Project
