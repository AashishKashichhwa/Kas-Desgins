import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/ViewBookingsById.css';

const ViewBookingsUserById = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApprovalOptions, setShowApprovalOptions] = useState(false);
    const [showRedesignForm, setShowRedesignForm] = useState(false);
    const [redesignComments, setRedesignComments] = useState('');
    const [designApproval, setDesignApproval] = useState(null);
    const [showApprovalDropdown, setShowApprovalDropdown] = useState(false);
    const [showPaymentButton, setShowPaymentButton] = useState(false);
    const approvalDropdownRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const paymentStatus = searchParams.get('payment_status');
    const bookingIdFromParams = searchParams.get('bookingId');
    const [bookingId, setBookingId] = useState(bookingIdFromParams || id);
    const navigate = useNavigate();
    const [paymentVerificationLoading, setPaymentVerificationLoading] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (approvalDropdownRef.current && !approvalDropdownRef.current.contains(event.target)) {
                setShowApprovalDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await instance.get(`/api/bookings/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBooking(res.data);
                // Show payment button only if cost is approved but not paid yet
                setShowPaymentButton(
                    res.data.costApproval === 'Pending' &&
                    res.data.paymentStatus !== 'Paid'
                );
            } catch (err) {
                console.error('Error fetching booking by ID:', err);
                setError('Failed to load booking details.');
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBooking();
        }
    }, [bookingId]);

    useEffect(() => {
        const verifyPaymentStatus = async () => {
            if (paymentStatus === 'success' && bookingId) {
                console.log('Verifying payment status...');
                setPaymentVerificationLoading(true);
                try {
                    const response = await instance.get(`/api/bookings/${bookingId}/verify-payment`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    console.log('Payment verification response:', response.data);

                    if (response.data.verified) {
                        toast.success('Payment successful! Your booking has been updated.');
                        setBooking(response.data.booking); // Update the booking data

                        // Clear payment status from URL
                        setSearchParams((params) => {
                            params.delete('payment_status');
                            return params;
                        });
                    } else {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    toast.error('Failed to verify payment status. Please contact support.');
                } finally {
                    setPaymentVerificationLoading(false);
                }
            }
        };

        verifyPaymentStatus();
    }, [paymentStatus, bookingId, setSearchParams]);

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            booking.images ? (prev - 1 + booking.images.length) % booking.images.length : 0
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            booking.images ? (prev + 1) % booking.images.length : 0
        );
    };

    const handleCostApproval = async (approvalStatus) => {
        try {
            const response = await instance.put(
                `/api/bookings/${bookingId}/cost-approval`,
                {
                    costApproval: approvalStatus === 'Approved' ? 'Pending' : 'Not Approved'
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.success(
                approvalStatus === 'Approved'
                    ? 'Please proceed with payment to confirm approval'
                    : 'Cost estimate disapproved'
            );

            setBooking(response.data.booking);
            setShowApprovalOptions(false);
            setShowPaymentButton(approvalStatus === 'Approved');
        } catch (err) {
            console.error('Error updating cost approval:', err);

            let errorMessage = 'Failed to update cost approval.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
                if (err.response.data.validStatuses) {
                    errorMessage += ` Valid statuses: ${err.response.data.validStatuses.join(', ')}`;
                }
            }

            toast.error(errorMessage);
        }
    };

    const handleRedesignSubmit = async () => {
        try {
            await instance.put(`/api/bookings/${bookingId}`, {
                designModificationComments: redesignComments
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Redesign request submitted successfully!');
            const updatedBooking = await instance.get(`/api/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBooking(updatedBooking.data);
            setShowRedesignForm(false);
        } catch (err) {
            console.error('Error submitting redesign request:', err);
            toast.error('Failed to submit redesign request.');
        }
    };

    const handleDesignApprovalChange = async (approval) => {
        try {
            const status = approval === 'yes' ? 'Completed' : 'AwaitingFinalDesign';
            await instance.put(`/api/bookings/${bookingId}`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success(`Design ${approval === 'yes' ? 'Approved' : 'Rejected'}`);
            const updatedBooking = await instance.get(`/api/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBooking(updatedBooking.data);
            setShowApprovalDropdown(false);
        } catch (error) {
            console.error('Error updating design approval:', error);
            toast.error('Failed to update design approval.');
        }
    };

    const handlePayNowClick = async () => {
        try {
            toast.loading('Preparing payment...');
            console.log('Creating checkout session for booking:', id);

            const response = await instance.post(
                `/api/bookings/${id}/create-checkout-session`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.dismiss();
            console.log('Checkout session response:', response.data);

            if (response.data?.url) {
                console.log('Redirecting to Stripe checkout:', response.data.url);
                // Use window.location.replace instead of href to prevent history entry
                window.location.replace(response.data.url);
            } else {
                console.error('Missing checkout URL in response');
                throw new Error('Missing checkout URL');
            }
        } catch (error) {
            toast.dismiss();
            console.error('Payment initiation failed:', error);

            let errorMessage = 'Payment failed. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        }
    };

    if (loading) return <p>Loading booking details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!booking) return <p>Booking not found.</p>;

    const costEstimate = booking?.costEstimate || 0;
    const canEditApproval = costEstimate > 0 && booking.paymentStatus !== 'Paid';

    return (
        <div className="view-booking-details-container">
            <div className="view-booking-details-contents">
                <button className="close-button" onClick={() => navigate('/user/bookings')}>×</button>
                <h2 className="booking-detail-title">Your Booking</h2>

                <div className="info-container">
                    <div className="info-column">
                        <h3>Project Information</h3>
                        <p><strong>Project Name:</strong> {booking.projectName}</p>
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Room Size:</strong> {booking.roomSqft} sqft</p>
                        <p><strong>Room Details:</strong> {booking.roomDetails}</p>
                        <p><strong>Design Cost Estimate:</strong> NRs. {costEstimate}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        {/* Payment Status Display */}
                        <div className="payment-status">
                            <strong>Payment Status:</strong> {booking.paymentStatus || 'Unpaid'}
                            {booking.paymentStatus === 'Paid' && (
                                <span className="payment-badge">✓ Paid on {new Date(booking.paymentDate).toLocaleDateString()}</span>
                            )}
                        </div>
                        {paymentVerificationLoading && <p>Verifying payment...</p>}

                        {/* Payment Button (conditional) */}
                        {showPaymentButton && (
                            <div className="payment-prompt">
                                <p>Please proceed with payment to confirm your approval</p>
                                <button onClick={handlePayNowClick} className="pay-now-button">
                                    Pay Now
                                </button>
                            </div>
                        )}

                        <p>
                            <strong>Cost Approval Status:</strong> {booking.costApproval}
                            {booking.paymentStatus !== 'Paid' && (
                                <>
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
                                            className="status-select-cost"
                                        >
                                            <option value="Approved">Approve</option>
                                            <option value="Not Approved">Disapprove</option>
                                        </select>
                                    )}
                                </>
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

                {/* Rest of your existing UI components remain unchanged */}
                <div className="design-approval right-button" ref={approvalDropdownRef}>
                    <button
                        onClick={() => setShowApprovalDropdown(!showApprovalDropdown)}
                        className="inline-button-approve"
                        aria-label="Toggle design approval dropdown"
                    >
                        {showApprovalDropdown ? '×' : 'Approve Design'}
                    </button>
                    {showApprovalDropdown && (
                        <div className="approval-dropdown">
                            <select
                                value={designApproval}
                                onChange={(e) => handleDesignApprovalChange(e.target.value)}
                                className="status-select-approval"
                            >
                                <option value="">Select option</option>
                                <option value="yes">Approve</option>
                                <option value="no">Request Changes</option>
                            </select>
                        </div>
                    )}
                </div>

                <button onClick={() => setShowRedesignForm(!showRedesignForm)} className="inline-button">
                    {showRedesignForm ? '×' : 'Request Redesign'}
                </button>

                {showRedesignForm && (
                    <div className="redesign-form">
                        <h3>Request Design Modification</h3>
                        <textarea
                            value={redesignComments}
                            onChange={(e) => setRedesignComments(e.target.value)}
                            placeholder="Enter your design modification comments here..."
                        />
                        <button onClick={handleRedesignSubmit} className="inline-button">Submit Redesign Request</button>
                    </div>
                )}

                {/* Room Image Gallery */}
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

export default ViewBookingsUserById;