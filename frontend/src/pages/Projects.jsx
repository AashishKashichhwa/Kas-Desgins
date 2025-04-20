import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ViewProjects from '../components/ViewProjects';
import  '../assets/styles/Projects.css';

const Project = () => {
  return (
    <div>
      <Navbar/>
      <h2>Projects</h2>
      <ViewProjects/>
      <Footer/>
    </div>
  )
}

export default Project
