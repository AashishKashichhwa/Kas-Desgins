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
import AdminLayout from './layout/AdminLayout';
import PublicLayout from './layout/PublicLayout';
import UserLayout from './layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/AuthSlice';
import AdminDashboard from './pages/AdminDashboard';
import UserHome from './pages/UserHome';
import './assets/styles/style.css';
import AdminHome from './pages/AdminHome';
import Services from './pages/Services';

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
        const publicPaths = ['/', '/login', '/register', '/contact', '/about', '/projects'];
         if (!user) {
             if (!publicPaths.includes(location.pathname)) {
                 navigate('/login');
             }
         } else if (user) {
             if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
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
                <Route path='register' element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/services" element={<Services />} />
            </Route>
            <Route path='/userhome' element={<UserLayout />}>
                <Route index element={<UserHome />} />
            </Route>
            <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path='home' element={<AdminHome />} />
            </Route>
        </Routes>
    )
}

export default App;