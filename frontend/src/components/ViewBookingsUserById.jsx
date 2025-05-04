import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewBookingsById.css'; // Use the same CSS as ViewBookingsById

const ViewBookingsUserById = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApprovalOptions, setShowApprovalOptions] = useState(false); //State to handle cost approval visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            setError('');
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
        try {
            await instance.put(`/api/bookings/${id}`, {
                costApproval: approvalStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success(`Design ${approvalStatus === 'Approved' ? 'approved' : 'disapproved'}`);
            //Refresh the booking after approval/disapproval
            const updatedBooking = await instance.get(`/api/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBooking(updatedBooking.data);
            setShowApprovalOptions(false);
        } catch (err) {
            console.error('Error updating cost approval:', err);
            toast.error('Failed to update cost approval.');
        }
    };

    if (loading) return <p>Loading booking details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    const costEstimate = booking?.costEstimate || 0;
    const canEditApproval = costEstimate > 0;

    return (
        <div className="view-booking-details-container">
            <div className="view-booking-details-contents">
                <button className="close-button" onClick={() => navigate('/user/bookings')}>×</button>
                <h2 className="booking-detail-title">Your Booking</h2>

                {/* Project Information */}
                <div className="info-container">
                    {/* Project Information */}
                    <div className="info-column">
                        <h3>Project Information</h3>
                        <p><strong>Project Name:</strong> {booking.projectName}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Room Size:</strong> {booking.roomSqft} sqft</p>
                        <p><strong>Room Details:</strong> {booking.roomDetails}</p>
                        <p><strong>Design Cost Estimate:</strong> NRs. {costEstimate}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p>
                            <strong>Cost Approval Status:</strong> {booking.costApproval}
                            <button
                                className="inline-button"
                                onClick={() => setShowApprovalOptions(!showApprovalOptions)}
                                disabled={!canEditApproval}
                                title={canEditApproval ? "" : "Wait for Admin to send Design Cost Estimate"}
                                style={{
                                    cursor: canEditApproval ? "pointer" : "not-allowed",
                                    opacity: canEditApproval ? 1 : 0.6
                                }}
                            >
                                {canEditApproval ? "Edit Approval" : "Wait for Admin to send Design Cost Estimate"}
                            </button>
                            {showApprovalOptions && (
                                <select
                                    value={booking.costApproval}
                                    onChange={(e) => handleCostApproval(e.target.value)}
                                    className="status-select"
                                >
                                    <option value="Approved">Approve</option>
                                    <option value="Not Approved">Disapprove</option>
                                </select>
                            )}
                        </p>
                    </div>

                    {/* Customer Contact Information */}
                    <div className="info-column">
                        <h3>Customer Contact Information</h3>
                        <p><strong>Name:</strong> {booking.name}</p>
                        <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Message:</strong> {booking.message}</p>
                    </div>
                </div>

                {/* Room Image */}
                <div className="view-booking-section">
                    <h3>Room Image</h3>
                    {booking.images && booking.images.length > 0 ? (
                        <div className="booking-image-gallery">
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
                        <h1>No Room Images</h1>
                    )}
                </div>

                {/* Design Image and 3D Preview */}
                <div className="view-booking-section">
                    <h3>Design Image and 3D Preview</h3>
                    {booking.finalDesignImages && booking.finalDesignImages.length > 0 ? (
                        <div className="booking-image-gallery">
                            <h3>Final Design Images:</h3>
                            <div className="imagebox">
                                {booking.finalDesignImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:4000${image}`}
                                        alt={`Final Design - ${index + 1}`}
                                        className="booking-gallery-image"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <h1>No Final Design Images</h1>
                    )}

                    {booking.final3DPreview && (
                        <div className="booking-3d-visualization">
                            <h3>Final 3D Visualization:</h3>
                            <div
                                className="booking-iframe-container"
                                dangerouslySetInnerHTML={{ __html: booking.project3DVisualization }}
                            />
                        </div>
                    )}
                </div>

                {/* 3D Visualization Preview */}
                {booking.project3DVisualization && (
                    <div className="view-booking-section">
                        <h3>3D Visualization</h3>
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