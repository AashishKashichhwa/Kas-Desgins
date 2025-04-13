// ManageBookings.jsx
import React, { useEffect, useState } from 'react';
import { get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/AdminHome.css';
import AdminSidebar from '../components/AdminSidebar';
import BookingForm from './BookingForm';  // Import BookingForm
import ViewBookings from './ViewBookings';  // Import ViewBookings

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);  // State to control form visibility

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const request = await get('/api/contact');  // Replace with your actual endpoint
            const response = request.data;

            if (request.status === 200) {
                setBookings(response); // Adjust based on your API response
            } else {
                toast.error("Failed to fetch bookings.");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to fetch bookings.");
        }
    };

    const handleAddBooking = () => {
        setShowBookingForm(true);  // Show the BookingForm when "Add Booking" is clicked
    };

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                    <h2>Manage Bookings</h2>

                    {/* Button to toggle the visibility of BookingForm */}
                    <button onClick={handleAddBooking}>Add Booking</button>

                    {/* Conditionally render BookingForm if showBookingForm is true */}
                    {showBookingForm && <BookingForm fetchReservations={fetchBookings} />}

                    {/* Always render ViewBookings */}
                    <ViewBookings bookings={bookings} />
                </div>
            </main>
        </div>
    );
};

export default ManageBookings;