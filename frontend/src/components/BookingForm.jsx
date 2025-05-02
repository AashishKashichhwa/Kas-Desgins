import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { instance } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Bookingform.css';

const BookingForm = ({ isAdmin = false, bookingId = null }) => { // Pass isAdmin prop
    const [formData, setFormData] = useState({ /* ... */ });
    const [formErrors, setFormErrors] = useState({});
    const [booking, setBooking] = useState(null) // set data after getting from API
    const navigate = useNavigate();
    const [imageFields, setImageFields] = useState([0]);
    let currentId = 1;

useEffect(()=>{
if(bookingId){
    fetchBookingData()
}
},[])

const fetchBookingData = async()=>{
    try{
        const res = await instance.get(`/api/bookings/${bookingId}`)
        if(res.status===200){
            setBooking(res.data)
            setFormData(res.data)
        }
    }
    catch(err){
    console.log("Error fetching booking data",err)
    }
}
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleImageChange = (e, fieldId) => {
        const selectedFiles = Array.from(e.target.files);
        setFormData(prevFormData => ({
            ...prevFormData,
            images: [...prevFormData.images, ...selectedFiles],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();

            // Append all form fields
            formDataToSend.append('projectName', formData.projectName);
            formDataToSend.append('roomType', formData.roomType);
            formDataToSend.append('roomSqft', formData.roomSqft);
            formDataToSend.append('roomDetails', formData.roomDetails);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('time', formData.time);
            formDataToSend.append('message', formData.message);

            // Append all images
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            // Make the API call
            const res = await instance.post('/api/bookings', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.status === 201) {
                toast.success('Booking submitted successfully!');
                navigate('/my-bookings');
            }
        } catch (error) {
            console.error('Booking submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit booking');
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.projectName.trim()) errors.projectName = 'Project Name is required';
        if (!formData.roomType.trim()) errors.roomType = 'Room Type is required';
        if (!formData.roomSqft.trim()) errors.roomSqft = 'Room Sqft is required';
        if (!formData.roomDetails.trim()) errors.roomDetails = 'Room Details is required';
        if (!formData.name.trim()) errors.name = 'Your Name is required';
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

    const clearForm = () => {
        setFormData({
            projectName: '',
            roomType: '',
            roomSqft: '',
            roomDetails: '',
            name: '',
            phone: '',
            date: '',
            time: '',
            message: '',
            images: [],
        });
        setFormErrors({});
    };

    const handleAddImageField = () => {
        setImageFields((prevFields) => [...prevFields, currentId++]);
    };

    const handleRemoveImageField = (fieldId) => {
        setImageFields((prevFields) => prevFields.filter((id) => id !== fieldId));

        setFormData(prevFormData => ({
            ...prevFormData,
            images: prevFormData.images.filter((_, index) => {
                const fileInput = document.getElementById(`roomImage-${fieldId}`);
                return !fileInput || !fileInput.files || !Array.from(fileInput.files).includes(prevFormData.images[index]);
            }),
        }));
    };

    return (
        <div className="booking-form-container">
            <button className="closebutton" onClick={() => navigate('/')}>×</button>
            <form onSubmit={handleSubmit} className="booking-form">
                <h2 className="booking-form-title">Submit a Booking Request</h2>

                <fieldset className="form-section">
                    <legend>Project Information</legend>
                    <div className="booking-form-group">
                        <label htmlFor="projectName">Project Name:</label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            className={formErrors.projectName ? 'error-input' : 'booking-form-input'}
                            disabled={isAdmin}
                        />
                        {formErrors.projectName && <span className="error">{formErrors.projectName}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="roomType">Room Type:</label>
                        <input
                            type="text"
                            id="roomType"
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            className={formErrors.roomType ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.roomType && <span className="error">{formErrors.roomType}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="roomSqft">Room Sqft:</label>
                        <input
                            type="text"
                            id="roomSqft"
                            name="roomSqft"
                            value={formData.roomSqft}
                            onChange={handleChange}
                            className={formErrors.roomSqft ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.roomSqft && <span className="error">{formErrors.roomSqft}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="roomDetails">Room Details:</label>
                        <textarea
                            id="roomDetails"
                            name="roomDetails"
                            value={formData.roomDetails}
                            onChange={handleChange}
                            className={formErrors.roomDetails ? 'error-input' : 'booking-form-textarea'}
                             disabled={isAdmin}
                        />
                        {formErrors.roomDetails && <span className="error">{formErrors.roomDetails}</span>}
                    </div>

                    <div className="booking-form-group">
                        <label>Room Images:</label>
                        {imageFields.map((fieldId) => (
                            <div key={fieldId} className="image-input-container">
                                <input
                                    type="file"
                                    id={`roomImage-${fieldId}`}
                                    accept="image/*"
                                    className="booking-form-input"
                                    multiple
                                    onChange={(e) => handleImageChange(e, fieldId)}
                                     disabled={isAdmin}
                                />
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={() => handleRemoveImageField(fieldId)}
                                     disabled={isAdmin}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button type="button" className="add-image-button" onClick={handleAddImageField} disabled={isAdmin}>+ Add more</button>
                    </div>
                </fieldset>

                <fieldset className="form-section">
                    <legend>Your Contact Information</legend>
                    <div className="booking-form-group">
                        <label htmlFor="name">Your Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={formErrors.name ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.name && <span className="error">{formErrors.name}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            value={formData.phone}
                            onChange={handleChange}
                            className={formErrors.phone ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.phone && <span className="error">{formErrors.phone}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={formErrors.date ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.date && <span className="error">{formErrors.date}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="time">Time:</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className={formErrors.time ? 'error-input' : 'booking-form-input'}
                             disabled={isAdmin}
                        />
                        {formErrors.time && <span className="error">{formErrors.time}</span>}
                    </div>
                    <div className="booking-form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="booking-form-textarea"
                             disabled={isAdmin}
                        />
                    </div>
                </fieldset>
                {isAdmin && (
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
                    )}

                     {!isAdmin &&(
                         <div className="form-actions">
                            <button type="submit" className="reserve-btn">Submit Booking</button>
                            <button type="button" className="reset-btn" onClick={clearForm}>Reset</button>
                    </div>
                     )}

                {isAdmin && (
                    <div className="form-actions">
                        <button type="button" className="save-btn" onClick={handleSubmit}>Save Changes</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BookingForm;