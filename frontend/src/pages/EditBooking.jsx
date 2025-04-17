import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/EditBooking.css';

const EditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        comments: '',
        status: 'Pending', // Initialize Status to Pending
    });
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const request = await get(`/api/contact/${id}`);
                const response = request.data;

                if (request.status === 200) {
                    const formattedDate = new Date(response.date).toISOString().split('T')[0];

                    setFormData({
                        name: response.name,
                        phone: response.phone,
                        date: formattedDate,
                        time: response.time,
                        comments: response.comments,
                        status: response.status, // Set Status
                    });
                } else {
                    toast.error("Failed to fetch booking.");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
                toast.error("Failed to fetch booking.");
            }
        };

        fetchBooking();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.date) errors.date = 'Date is required';
        if (!formData.time) errors.time = 'Time is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const request = await put(`/api/contact/${id}`, {
                    name: formData.name,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    comments: formData.comments,
                    status: formData.status, // Send Status
                });

                if (request.status === 200) {
                    toast.success('Booking updated successfully!');
                    navigate('/admin/bookings');
                } else {
                    toast.error('Error updating booking.');
                }
            } catch (error) {
                console.error('Error updating booking:', error);
                toast.error('Error updating booking.');
            } finally {
                setLoading(false);
            }
        }
    };

    const clearForm = () => {
        setFormData({ name: '', phone: '', date: '', time: '', comments: '', status: 'Pending' });
        setFormErrors({});
        setMessage(null);
    };

    return (
        <div className="reservation-form-container">
            <h2>Edit Booking</h2>
            <form onSubmit={handleSubmit} id="reservationForm" className="reservationForm-form">
                <fieldset className="fieldset">
                    <legend>Edit Reservation Information</legend>

                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.name && <span className="error">{formErrors.name}</span>}

                    <label htmlFor="phone">Phone no.:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        title="Please enter a valid 10-digit phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.phone && <span className="error">{formErrors.phone}</span>}

                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.date && <span className="error">{formErrors.date}</span>}

                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.time && <span className="error">{formErrors.time}</span>}

                    <label htmlFor="comments">Comments:</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                    ></textarea>

                    {/* Status Dropdown */}
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Booked">Booked</option>  {/* ADD Booked */}
                    </select>

                    <button type="submit" className="reserve-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button type="button" className="reset-btn" onClick={clearForm}>Reset</button>
                </fieldset>
            </form>

            {message && (
                <div className="messages">
                    <div className="message">{message}</div>
                </div>
            )}
        </div>
    );
};

export default EditBooking;