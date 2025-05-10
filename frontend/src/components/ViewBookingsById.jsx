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
    const [isEditMode, setIsEditMode] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showStatusOptions, setShowStatusOptions] = useState(false);
    const [showQuotationInput, setShowQuotationInput] = useState(false);
    const [quotationInput, setQuotationInput] = useState('');
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
                setFinal3DPreview(res.data.final3DPreview || '');
                setQuotationInput(res.data.costEstimate || '');
            } catch (err) {
                console.error("Error fetching booking by ID:", err);
                setError("Failed to load booking details.");
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, isEditMode, showSubmitForm, showEditForm]);

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
            setShowStatusOptions(false);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleQuotationSubmit = async (e) => {
        e.preventDefault();
        try {
            await instance.put(`/api/bookings/${id}/send-quotation`, {
                costEstimate: quotationInput
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Quotation sent successfully");
            setShowQuotationInput(false);

            const updatedBookingRes = await instance.get(`/api/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBooking(updatedBookingRes.data);
            setQuotationInput(updatedBookingRes.data.costEstimate || '');
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
                toast.success("Designs submitted successfully.");
                setShowSubmitForm(false);
            } else {
                toast.error("Failed to submit final design.");
            }
        } catch (err) {
            console.error("Error submitting designs:", err);
            toast.error("Error submitting designs.");
        }
    };

    const handleEditDesignSubmit = async (e) => {
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

            const res = await instance.put(`/api/bookings/${id}/edit-design`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (res.status === 200) {
                toast.success("Designs updated successfully.");
                setIsEditMode(false);
                setShowEditForm(false);
            } else {
                toast.error("Failed to update final design.");
            }
        } catch (err) {
            console.error("Error updating final design:", err);
            toast.error("Error updating final design.");
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

    const hasFinalDesigns = booking?.finalDesignImages?.length > 0 && booking?.final3DPreview;

    return (
        <div className="view-booking-details-container">
            <div className="view-booking-details-contents">
                <button className="close-button" onClick={() => navigate('/admin/bookings')}>×</button>
                <h2 className="view-booking-detail-title">Booking Details</h2>

                <div className="info-container">
                    <div className="info-column">
                        <h3>Project Information</h3>
                        <p><strong>Project Name:</strong> {booking.projectName}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Room Size:</strong> {booking.roomSqft} sqft</p>
                        <p><strong>Room Details:</strong> {booking.roomDetails}</p>
                        <p>
                            <strong>Design Cost Estimate:</strong> Rs. {booking ? booking.costEstimate : ''}
                            <button onClick={() => setShowQuotationInput(!showQuotationInput)} className="inline-button">
                                {booking ? (booking.costEstimate ? "Edit Quotation" : "Add Quotation") : ''}
                            </button>
                        </p>

                        {showQuotationInput && (
                            <form onSubmit={handleQuotationSubmit}>
                                <input
                                    type="number"
                                    placeholder="Enter cost estimate"
                                    value={quotationInput}
                                    onChange={(e) => setQuotationInput(e.target.value)}
                                    className="cost-estimate-input"
                                />
                                <button type="submit" className="quotation-submit-button">Send Quotation</button>
                            </form>
                        )}

                        <p>
                            <strong>Status:</strong> {status}
                            <button onClick={() => setShowStatusOptions(!showStatusOptions)} className="inline-button">
                                Change Status
                            </button>
                            {showStatusOptions && (
                                <select value={status} onChange={handleStatusChange} className="status-select">
                                    <option value="Draft">Draft</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="AwaitingCostApproval">Awaiting Cost Approval</option>
                                    <option value="Designing">Designing</option>
                                    <option value="AwaitingFinalDesign">Awaiting Final Design</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            )}
                        </p>
                    </div>

                    <div className="info-column">
                        <h3>Customer Contact Information</h3>
                        <p><strong>Name:</strong> {booking.name}</p>
                        <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Message:</strong> {booking.message}</p>
                    </div>
                </div>

                {/* Conditionally Rendered Buttons */}
                <div className="design-buttons-container">
                    {!hasFinalDesigns && (
                        <button onClick={() => setShowSubmitForm(!showSubmitForm)} className="toggle-button">
                            {showSubmitForm ? "x" : "Submit Designs"}
                        </button>
                    )}
                    {hasFinalDesigns && (
                        <button onClick={() => setShowEditForm(!showEditForm)} className="editDesign">
                            {showEditForm ? "x" : "Edit Designs"}
                        </button>
                    )}
                </div>
                {showEditForm && (
                    <div className="view-booking-section">
                        <h3>Edit Design</h3>
                        <form onSubmit={handleEditDesignSubmit}>
                            <div className="form-group">
                                <label>Design Images:</label>
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

                            <button type="submit" className="submit-design-button">Update Designs</button>
                        </form>
                    </div>
                )}
                {showSubmitForm && (
                    <div className="view-booking-section">
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

                            <button type="submit" className="submit-design-button">Submit Designs</button>
                        </form>
                    </div>
                )}
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
                        <h4>No Design Images</h4>
                    )}

                    {booking.final3DPreview && (
                        <div className="booking-3d-visualization">
                            <h3>Final 3D Visualization:</h3>
                            <div
                                className="booking-iframe-container"
                                dangerouslySetInnerHTML={{ __html: booking.final3DPreview }}
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

export default ViewBookingsById;