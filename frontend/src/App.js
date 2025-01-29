import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import AdminHome from './pages/AdminHome'
import Login from './pages/Login'
import Register from './pages/Register'
import {Toaster} from 'react-hot-toast'

import './assets/styles/style.css';


function App() {
  return (
      <Router>
        <Toaster />
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/adminhome" element={<AdminHome />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/about" element={<About />} />
             <Route path="/projects" element={<Projects />} />
         </Routes>
     </Router>
   );
}
export default App;