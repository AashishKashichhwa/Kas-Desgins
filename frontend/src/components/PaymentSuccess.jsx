import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { instance } from '../services/ApiEndpoint'; // Adjust as needed
import '../assets/styles/PaymentSuccess.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCheckCircle } from 'react-icons/fa'; // Import the check circle icon from react-icons/fa

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingId = new URLSearchParams(location.search).get('bookingId');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateAttempted, setUpdateAttempted] = useState(false); // Track if update was attempted
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        if (bookingId) {
            const verifyPaymentAndUpdate = async () => {
                try {
                    toast.loading('Verifying payment and updating booking...');

                    // Call your API to verify the payment and update the paymentStatus to 'Paid'
                    const response = await instance.put(
                        `/api/bookings/${bookingId}`, // Use the existing update booking endpoint.
                        { paymentStatus: 'Paid' }, // Set paymentStatus to 'Paid'
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    );

                    if (response.status === 200) {
                        toast.success('Payment verified successfully and booking updated!');

                        // Optionally, fetch the updated booking details if needed
                        const updatedBookingResponse = await instance.get(
                            `/api/bookings/${bookingId}`,
                            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                        );

                        if (updatedBookingResponse.status === 200) {
                            const updatedBooking = updatedBookingResponse.data;
                            setBooking(updatedBooking);
                            setProjectName(updatedBooking.projectName);
                        } else {
                            toast.error('Failed to fetch booking details after update.');
                        }
                    } else {
                        toast.error('Payment verification and update failed');
                    }
                } catch (error) {
                    toast.error('Payment verification and update failed');
                    console.error('Verification error:', error);
                } finally {
                    toast.dismiss();
                    setLoading(false);
                    setUpdateAttempted(true); // Set updateAttempted to true after the update
                }
            };

            // Ensure the update is only attempted once
            if (!updateAttempted) {
                verifyPaymentAndUpdate();
            }
        } else {
            toast.error('Booking ID not found. Cannot verify payment');
            setLoading(false);
        }
    }, [bookingId, updateAttempted]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container'>
            <Navbar />
            <div className='contents'>
                <div className="payment-success-container">
                    <div className="payment-success-message">
                        Payment Successful!
                    </div>
                    <div className="success-icon">
                    ✓
                </div>
                    <p className="payment-success-details">
                        Your payment was successful for Project Name: {projectName || 'N/A'}
                    </p>

                    <div className="payment-success-actions">
                        <Link to={`/userhome/bookings/${bookingId}`} className="view-bookings-button">
                            View My Bookings
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;