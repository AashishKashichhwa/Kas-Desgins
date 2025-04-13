import React, { useState } from 'react';

const BookingForm = ({ fetchReservations }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        comments: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState(null);

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
            try {
                const response = await fetch('http://localhost:4000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setMessage('Reservation done successfully');
                    setFormData({ name: '', phone: '', date: '', time: '', comments: '' });
                    fetchReservations(); // Call fetchReservations to update the list after successful submission
                } else {
                    setMessage('Error in reservation');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setMessage('Error in reservation');
            }
        }
    };

    const clearForm = () => {
        setFormData({ name: '', phone: '', date: '', time: '', comments: '' });
        setFormErrors({});
        setMessage(null); // Reset message when clearing form
    };

    return (
        <div className="reservation-form-container">
            <form onSubmit={handleSubmit} id="reservationForm" className="reservationForm-form">
                <fieldset className="fieldset">
                    <legend>Reservation Information</legend>

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

                    <button type="submit" className="reserve-btn">Reserve</button>
                    <button type="reset" className="reset-btn" onClick={clearForm}>Reset</button>
                </fieldset>
            </form>

            {/* Display success or error message */}
            {message && (
                <div className="messages">
                    <div className="message">{message}</div>
                </div>
            )}
        </div>
    );
};

export default BookingForm;