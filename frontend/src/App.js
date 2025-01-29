import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layout/AdminLayout';
import PublicLayout from './layout/PublicLayout';
import UserLayout from './layout/UserLayout';
// import { useDispatch } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/AuthSlice';

import './assets/styles/style.css';

function App() {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch(); // ✅ Fix spelling

  useEffect(() => {
    dispatch(updateUser()); // ✅ Use correct variable name
  }, [dispatch,user]); // ✅ Fix: Add dispatch to the dependency array

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
