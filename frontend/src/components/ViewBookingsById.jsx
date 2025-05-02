import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewProductsById.css'; // Reuse styling or create a new one

const ViewBookingsById = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                console.error("Error fetching booking by ID:", err);
                setError("Failed to load booking details.");
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) return <p>Loading booking details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    return (
        <div className="product-details-container">
            <div className="product-details-contents">
                <button className="close-button" onClick={() => navigate('/admin/bookings')}>×</button>
                <h2 className="product-detail-title">Booking Details</h2>
                <div className="product-details-content">
                    <div className="product-info">
                        <p><strong>Project Name:</strong> {booking.projectName}</p>
                        <p><strong>Customer Name:</strong> {booking.name}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Room Sqft:</strong> {booking.roomSqft}</p>
                        <p><strong>Room Details:</strong> {booking.roomDetails}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Message:</strong> {booking.message}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Cost Estimate:</strong> {booking.costEstimate}</p>
                        <p><strong>Cost Approval:</strong> {booking.costApproval === null ? 'Pending' : booking.costApproval ? 'Approved' : 'Rejected'}</p>

                         {/* Display Images */}
                         {booking.images && booking.images.length > 0 && (
                            <div className="product-image-gallery">
                                <h3>Images:</h3>
                                <div className="gallery-grid">
                                    {booking.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:4000${image}`}
                                            alt={`Booking Image ${index + 1}`}
                                            className="product-gallery-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                         {/*Display finalDesignImages */}
                         {booking.finalDesignImages && booking.finalDesignImages.length > 0 && (
                            <div className="product-image-gallery">
                                <h3>Final Images:</h3>
                                <div className="gallery-grid">
                                    {booking.finalDesignImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:4000${image}`}
                                            alt={`Final Design Image ${index + 1}`}
                                            className="product-gallery-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {booking.final3DPreview && (
                            <div className="product-3d-visualization">
                                <h3>3D Visualization:</h3>
                                <div
                                    className="product-iframe-container"
                                    dangerouslySetInnerHTML={{ __html: booking.final3DPreview }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBookingsById;