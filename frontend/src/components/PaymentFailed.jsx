import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const bookingId = new URLSearchParams(location.search).get('bookingId');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`/api/bookings/${bookingId}`); // Replace with your actual API endpoint
                if (response.ok) {
                    const data = await response.json();
                    setBooking(data);
                } else {
                    console.error('Failed to fetch booking:', response.status);
                    // Optionally redirect to an error page or display an error message
                    navigate('/error'); // Example redirection
                }
            } catch (error) {
                console.error('Error fetching booking:', error);
                navigate('/error');
            }
        };

        if (bookingId) {
            fetchBooking();
        } else {
            // Handle the case where bookingId is missing
            console.error('Booking ID is missing from the URL.');
            navigate('/error');
        }
    }, [bookingId, navigate]);

    if (!booking) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                Payment Failed!
            </div>
            <p>There was a problem processing your payment. Please try again.</p>
            <p>Booking ID: {bookingId}</p> {/* Display the booking ID */}

            <Link to="/user/bookings" className="btn btn-secondary">
                Try Again
            </Link>
             <Link to="/dashboard" className="btn btn-primary mr-2">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default PaymentFailed;