// App.js
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
import AdminDashboard from './pages/AdminDashboard';
import UserHome from './pages/UserHome';
import './assets/styles/style.css';
import AdminHome from './pages/AdminHome';
import Services from './pages/Services';
import ViewBookings from './pages/ViewBookings';
import ManageProjects from './pages/ManageProjects';
import ManageUsers from './pages/ManageUsers';
import ManageBookings from './pages/ManageBookings';
import AddProject from './pages/AddProject';
import EditUser from './pages/EditUser';
import EditBooking from './pages/EditBooking'; // Import EditBooking


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
            <Route path='/' element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path='login' element={<Login />} />
                 <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/services" element={<Services />} />
                <Route path="register" element={<Register />} />
            </Route>

            <Route path='/userhome' element={<UserLayout />}>
                <Route index element={<UserHome />} />
            </Route>

            {/* Admin Routes - IMPORTANT: Ensure these are accessible only to admin users */}
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin/home' element={<AdminHome />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/editbooking/:id" element={<EditBooking />} /> {/* ADD THIS LINE */}
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/projects" element={<ManageProjects />} />
            <Route path='/admin/add-project' element={<AddProject />} />
            <Route path="/admin/edituser/:id" element={<EditUser />} />
            <Route path="/register" element={<Register />} />


        </Routes>
    )
}

export default App;