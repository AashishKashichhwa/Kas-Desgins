import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { instance } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Bookingform.css';

const EditBooking = ({ bookingId }) => {
    const [formData, setFormData] = useState({
        costEstimate: 0,
        status: 'Draft',
        costApproval: null,
    });
    const [booking, setBooking] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (bookingId) {
            fetchBookingData();
        }
    }, [bookingId]);

    const fetchBookingData = async () => {
        try {
            const res = await instance.get(`/api/bookings/${bookingId}`);
            if (res.status === 200) {
                setBooking(res.data);
                setFormData({
                    costEstimate: res.data.costEstimate || 0,
                    status: res.data.status || 'Draft',
                    costApproval: res.data.costApproval === null ? '' : res.data.costApproval.toString(),
                });
            }
        } catch (err) {
            console.error("Error fetching booking data", err);
            toast.error("Error fetching booking data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await instance.put(`/api/bookings/${bookingId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 200) {
                toast.success('Booking updated successfully!');
                navigate('/admin/bookings'); // Redirect to the bookings list
            } else {
                toast.error('Failed to update booking');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error(error.response?.data?.message || 'Failed to update booking');
        }
    };

    return (
        <div className="edit-booking-container">
            <h2>Edit Booking</h2>
            <form onSubmit={handleSubmit} className="booking-form">
                <fieldset className="form-section">
                    <legend>Admin Controls</legend>
                    <div className="booking-form-group">
                        <label htmlFor="costEstimate">Cost Estimate:</label>
                        <input
                            type="number"
                            id="costEstimate"
                            name="costEstimate"
                            value={formData.costEstimate}
                            onChange={handleChange}
                            className="booking-form-input"
                        />
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="booking-form-input"
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
                    <div className="booking-form-group">
                        <label htmlFor="costApproval">Cost Approval:</label>
                        <select
                            id="costApproval"
                            name="costApproval"
                            value={formData.costApproval === null ? '' : formData.costApproval.toString()}
                            onChange={handleChange}
                            className="booking-form-input"
                        >
                            <option value="">Select</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                </fieldset>
                <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditBooking;