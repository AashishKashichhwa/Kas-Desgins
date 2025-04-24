import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layout/PublicLayout';
import UserLayout from './layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/AuthSlice';
//Take to note all from these are import

import UserHome from './pages/UserHome';
import './assets/styles/style.css';
import AdminHome from './pages/AdminHome';
import Services from './pages/Services';
import ManageProjects from './components/ManageProjects';  //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import ManageUsers from './components/ManageUsers';  //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import ManageBookings from './components/ManageBookings';  //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import AddProject from './components/AddProject';   //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import EditUser from './components/EditUser';   //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import EditBooking from './components/EditBooking';  //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import ViewProjectsById from './components/ViewProjectsById';   //The pages you are getting to use here will mark errors if is not import, in those files and in these code!
import EditProjects from './components/EditProjects';         //Edit project also is required, with it, the whole code runs

function App() {
    const user = useSelector((state) => state.Auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateUser());
    }, [dispatch]);

    return (
        <Router>
            <Toaster />
            <AppContent user={user} />
        </Router>
    );
}

function AppContent({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicPaths = ['/', '/login', '/contact', '/about', '/projects', '/services', '/register'];
        if (!user) {
            if (!publicPaths.includes(location.pathname)) {
                navigate('/login');
            }
        } else if (user) {
            if (user.role === 'admin' && !location.pathname.startsWith('/admin') && location.pathname !== '/register') {
                navigate('/admin');
            } else if (user.role !== 'admin' && !location.pathname.startsWith('/userhome') && !publicPaths.includes(location.pathname)) {
                navigate('/userhome');
            }
        }
    }, [user, navigate, location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ViewProjectsById />} />
                <Route path="services" element={<Services />} />
                <Route path="register" element={<Register />} />
            </Route>

            <Route path="/userhome" element={<UserLayout />}>
                <Route index element={<UserHome />} />
            </Route>

            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/editbooking/:id" element={<EditBooking />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/projects" element={<ManageProjects />} />
            <Route path="/admin/add-project" element={<AddProject />} />
            <Route path="/admin/projects/:id" element={<ViewProjectsById />} />
 <Route path="/admin/edit-project/:id" element={<EditProjects />} />{/* The Key Code */}
            <Route path="/admin/edituser/:id" element={<EditUser />} />

        </Routes>
    );
}

export default App;