import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Projects from './pages/Projects';
import Products from './pages/Products';
import Booking from './pages/Booking';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layout/PublicLayout';
import UserLayout from './layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/AuthSlice';
import UserHome from './pages/UserHome';
import './assets/styles/style.css';
import AdminHome from './pages/AdminHome';
import Services from './pages/Services';
import ManageProducts from './components/ManageProducts';
import AddProducts from './components/AddProducts';
import EditProducts from './components/EditProducts';
import ViewProductsById from './components/ViewProductsById';
import ViewProductsByIdUsers from './components/ViewProductsByIdUsers';
import ManageProjects from './components/ManageProjects';
import ManageUsers from './components/ManageUsers';
import ManageBookings from './components/ManageBookings';
import AddProject from './components/AddProject';
import EditUser from './components/EditUser';
import EditBooking from './components/EditBooking';
import ViewProjectsById from './components/ViewProjectsById';
import ViewProjectsByIdUsers from './components/ViewProjectsByIdUsers';
import EditProjects from './components/EditProjects';
import Cart from './pages/Cart';
import ViewBookings from './components/ViewBookings';
import ViewBookingsUser from './components/ViewBookingsUser';
import ViewBookingsById from './components/ViewBookingsById';
import EditBookingUser from './components/EditBookingUser';
import ViewBookingsUserById from './components/ViewBookingsUserById';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import AdminNotification from './components/AdminNotification';

import Notifications from './pages/Notifications'; // Import the Notifications page

function App() {
    const user = useSelector((state) => state.Auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateUser());
    }, [dispatch]);

    const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
        ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
        : Promise.resolve(null);

    return (
        <Elements stripe={stripePromise}>
            <Router>
                <Toaster />
                <AppContent user={user} />
            </Router>
        </Elements>
    );
}

function AppContent({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicPaths = ['/', '/login', '/booking', '/about', '/projects', '/products', '/services', '/register', '/cart'];
        const isProjectDetailPage = /^\/projects\/[^/]+$/.test(location.pathname);
        const isProductDetailPage = /^\/products\/[^/]+$/.test(location.pathname);
        const isPaymentSuccessOrFailed = location.pathname === '/paymentsuccess' || location.pathname === '/paymentfailed';
        const isPublic = publicPaths.includes(location.pathname) || isProjectDetailPage || isProductDetailPage || isPaymentSuccessOrFailed;

        if (!user && !isPublic) {
            navigate('/login');
        } else if (user) {
            if (user.role === 'admin' && !location.pathname.startsWith('/admin') && location.pathname !== '/register' && !isPaymentSuccessOrFailed) {
                navigate('/admin');
            } else if (user.role !== 'admin' && !location.pathname.startsWith('/userhome') && !isPublic && !isPaymentSuccessOrFailed) {
                navigate('/userhome');
            }
        }
    }, [user, navigate, location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="booking" element={<Booking />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ViewProductsByIdUsers />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ViewProjectsByIdUsers />} />
                <Route path="services" element={<Services />} />
                <Route path="register" element={<Register />} />
                <Route path="cart" element={<Cart />} />
            </Route>

            {/* New Route for Notifications */}
            <Route path="/notifications" element={<Notifications />} /> {/* Notifications page route */}

            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/paymentfailed" element={<PaymentFailed />} />

            <Route path="/userhome" element={<UserLayout />}>
                <Route index element={<UserHome />} />
                <Route path="bookings" element={<ViewBookingsUser />} />
                <Route path="bookings/:id" element={<ViewBookingsUserById />} />
                <Route path="edit-booking/:id" element={<EditBookingUser />} />
                <Route path="notifications" element={<Notifications />} /> {/* User Notifications */}
            </Route>

            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/bookings" element={<ViewBookings />} />
            <Route path="/admin/bookings/:id" element={<ViewBookingsById />} />
            <Route path="/admin/editbooking/:id" element={<EditBooking />} />
            <Route path="/admin/edit-booking/:id" element={<EditBooking />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/add-product" element={<AddProducts />} />
            <Route path="/admin/products/:id" element={<ViewProductsById />} />
            <Route path="/admin/edit-product/:id" element={<EditProducts />} />
            <Route path="/admin/projects" element={<ManageProjects />} />
            <Route path="/admin/add-project" element={<AddProject />} />
            <Route path="/admin/projects/:id" element={<ViewProjectsById />} />
            <Route path="/admin/edit-project/:id" element={<EditProjects />} />
            <Route path="/admin/edituser/:id" element={<EditUser />} />
            <Route path="/admin/notifications" element={<AdminNotification />} /> {/* Admin Notifications */}
        </Routes>
    );
}

export default App;
