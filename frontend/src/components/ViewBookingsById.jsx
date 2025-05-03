import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewBookingsById.css';

const ViewBookingsById = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [status, setStatus] = useState('');
    const [finalDesignFields, setFinalDesignFields] = useState([0]);
    const [final3DPreview, setFinal3DPreview] = useState('');
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
                setStatus(res.data.status);
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

    const goToPrevious = () => {
        setCurrentImageIndex(prevIndex =>
            booking.images
                ? (prevIndex - 1 + booking.images.length) % booking.images.length
                : 0
        );
    };

    const goToNext = () => {
        setCurrentImageIndex(prevIndex =>
            booking.images
                ? (prevIndex + 1) % booking.images.length
                : 0
        );
    };

    const handleStatusChange = async (e) => {
        const updatedStatus = e.target.value;
        setStatus(updatedStatus);

        try {
            await instance.put(`/api/bookings/${id}`, {
                status: updatedStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Status updated successfully");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleQuotationSubmit = async () => {
        try {
            await instance.put(`/api/bookings/${id}/send-quotation`, {
                costEstimate: booking.costEstimate
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Quotation sent successfully");
        } catch (err) {
            toast.error("Failed to send quotation");
        }
    };

    const handleFinalDesignSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('final3DPreview', final3DPreview);

            finalDesignFields.forEach((fieldId) => {
                const fileInput = document.getElementById(`finalDesignImage-${fieldId}`);
                if (fileInput && fileInput.files.length > 0) {
                    Array.from(fileInput.files).forEach(file => formData.append('finalDesignImages', file));
                }
            });

            const res = await instance.put(`/api/bookings/${id}/submit-design`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (res.status === 200) {
                toast.success("Final design submitted successfully.");
                navigate('/admin/bookings');
            } else {
                toast.error("Failed to submit final design.");
            }
        } catch (err) {
            console.error("Error submitting final design:", err);
            toast.error("Error submitting final design.");
        }
    };

    const handleAddFinalDesignField = () => {
        setFinalDesignFields((prevFields) => [...prevFields, prevFields.length]);
    };

    const handleRemoveImageField = (fieldIdToRemove) => {
        setFinalDesignFields((prevFields) =>
            prevFields.filter((fieldId) => fieldId !== fieldIdToRemove)
        );
    };

    if (loading) return <p>Loading booking details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    return (
        <div className="booking-details-container">
            <div className="booking-details-contents">
                <button className="close-button" onClick={() => navigate('/admin/bookings')}>×</button>
                <h2 className="booking-detail-title">Booking Details</h2>

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

                {/* Quotation Section */}
                <div className="quotation-section">
                    <p><strong>Cost Estimate:</strong> ${booking.costEstimate}</p>
                    <input
                        type="number"
                        placeholder="Enter cost estimate"
                        value={booking.costEstimate || ''}
                        onChange={(e) => setBooking({ ...booking, costEstimate: e.target.value })}
                        className="cost-estimate-input"
                    />
                    <button onClick={handleQuotationSubmit}>Send Quotation</button>
                </div>

                {/* Status Tracking */}
                <div>
                    <label htmlFor="status">Update Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="AwaitingCostApproval">Awaiting Cost Approval</option>
                        <option value="Designing">Designing</option>
                        <option value="AwaitingFinalDesign">Awaiting Final Design</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>

                {/* Final Design Submission Form */}
                <div className="submit-final-design-form">
                    <h3>Submit Final Design</h3>
                    <form onSubmit={handleFinalDesignSubmit}>
                        <div className="form-group">
                            <label>Final Design Images:</label>
                            {finalDesignFields.map((fieldId) => (
                                <div key={fieldId} className="final-design-field">
                                    <input
                                        type="file"
                                        id={`finalDesignImage-${fieldId}`}
                                        accept="image/*"
                                        multiple
                                        className="final-design-input"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={() => handleRemoveImageField(fieldId)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddFinalDesignField} className="add-image-button">
                                + Add more
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="final3DPreview">3D Visualization (Iframe Code):</label>
                            <textarea
                                id="final3DPreview"
                                value={final3DPreview}
                                onChange={(e) => setFinal3DPreview(e.target.value)}
                                className="final-design-textarea"
                            />
                        </div>

                        <button type="submit" className="submit-design-button">Submit Final Design</button>
                    </form>
                </div>

                {/* 3D Visualization Preview */}
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

export default ViewBookingsById;