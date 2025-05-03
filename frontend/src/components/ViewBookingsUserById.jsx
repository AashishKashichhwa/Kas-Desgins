import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewBookingsById.css';

const ViewBookingsUserById = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            try {
                const res = await instance.get(`/api/bookings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBooking(res.data);
            } catch (err) {
                console.error('Error fetching booking by ID:', err);
                setError('Failed to load booking details.');
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            booking.images
                ? (prev - 1 + booking.images.length) % booking.images.length
                : 0
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            booking.images
                ? (prev + 1) % booking.images.length
                : 0
        );
    };

    const handleCostApproval = async (approvalStatus) => {
        if (approvalStatus === 'Approved') {
            navigate(`/payment/${id}`);
        } else {
            toast.success('Design disapproved');
        }
    };

    if (loading) return <p>Loading booking details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    return (
        <div className="booking-details-container">
            <div className="booking-details-contents">
                <button className="close-button" onClick={() => navigate('/user/bookings')}>×</button>
                <h2 className="booking-detail-title">Your Booking</h2>

                <div className="booking-details-content">
                    <div className="booking-info">
                        <p><strong>Project Name:</strong> {booking.projectName}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Room Size:</strong> {booking.roomSqft} sqft</p>
                        <p><strong>Room Details:</strong> {booking.roomDetails}</p>
                        <p><strong>Name:</strong> {booking.name}</p>
                        <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Message:</strong> {booking.message}</p>
                    </div>

                    {/* Image Gallery */}
                    {booking.images && booking.images.length > 0 ? (
                        <div className="booking-image-gallery">
                            <h3>Images:</h3>
                            <div className="imagebox">
                                <button className="image-button back" onClick={goToPrevious}>‹</button>
                                <img
                                    src={`http://localhost:4000${booking.images[currentImageIndex]}`}
                                    alt={`Booking - ${currentImageIndex + 1}`}
                                    className="booking-gallery-image"
                                />
                                <button className="image-button next" onClick={goToNext}>›</button>
                            </div>
                        </div>
                    ) : booking.image ? (
                        <div className="booking-image-gallery">
                            <h3>Image:</h3>
                            <img
                                src={`http://localhost:4000${booking.image}`}
                                alt={booking.projectName}
                                className="booking-gallery-image"
                            />
                        </div>
                    ) : (
                        <h1>No Images</h1>
                    )}
                </div>

                {/* Cost Estimation and Approval */}
                <div>
                    <p><strong>Cost Estimate:</strong> ${booking.costEstimate}</p>
                    <p><strong>Approval Status:</strong> {booking.costApproval}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <button
                        onClick={() => handleCostApproval('Approved')}
                        disabled={booking.costApproval === 'Approved'}
                    >
                        Approve Design Estimation
                    </button>
                    <button
                        onClick={() => handleCostApproval('Not Approved')}
                        disabled={booking.costApproval === 'Not Approved'}
                    >
                        Disapprove Design Estimation
                    </button>
                </div>

                {/* 3D Preview (if available) */}
                {booking.project3DVisualization && (
                    <div className="booking-3d-visualization">
                        <h3>3D Visualization:</h3>
                        <div
                            className="booking-iframe-container"
                            dangerouslySetInnerHTML={{ __html: booking.project3DVisualization }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBookingsUserById;
