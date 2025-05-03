import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../assets/styles/Bookingform.css';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../services/ApiEndpoint';

const EditBookingUser = () => {
    const { id } = useParams();
    const [projectName, setProjectName] = useState('');
    const [roomType, setRoomType] = useState('');
    const [roomSqft, setRoomSqft] = useState('');
    const [roomDetails, setRoomDetails] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [imageFields, setImageFields] = useState([0]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    let currentId = 1;

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await get(`/api/bookings/${id}`);
                const data = res.data;

                if (res.status === 200) {
                    setProjectName(data.projectName || '');
                    setRoomType(data.roomType || '');
                    setRoomSqft(data.roomSqft || '');
                    setRoomDetails(data.roomDetails || '');
                    setName(data.name || '');
                    setPhoneNumber(data.phoneNumber || '');
                    setDate(data.date ? data.date.split('T')[0] : ''); // Fix for date format
                    setTime(data.time || '');
                    setMessage(data.message || '');

                    setExistingImages(data.images || []);
                    setImageFields([0]);
                    currentId = 1;
                } else {
                    toast.error('Failed to fetch booking.');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch booking.');
            }
        };

        fetchBooking();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('projectName', projectName);
            formData.append('roomType', roomType);
            formData.append('roomSqft', roomSqft);
            formData.append('roomDetails', roomDetails);
            formData.append('name', name);
            formData.append('phoneNumber', phoneNumber);
            formData.append('date', date);
            formData.append('time', time);
            formData.append('message', message);

            let newFilesSelected = false;
            imageFields.forEach((fieldId) => {
                const fileInput = document.getElementById(`bookingImage-${fieldId}`);
                if (fileInput && fileInput.files.length > 0) {
                    newFilesSelected = true;
                    Array.from(fileInput.files).forEach((file) => formData.append('images', file));
                }
            });

            formData.append('replaceImages', newFilesSelected ? 'true' : 'false');

            const res = await axios.put(`http://localhost:4000/api/bookings/${id}`, formData);

            if (res.status === 200) {
                toast.success(res.data.message || 'Booking updated successfully!');
                navigate('/user/bookings');
            } else {
                toast.error(res.data.message || 'Failed to update booking.');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error(error.response?.data?.message || 'Error updating booking');
        }
    };

    const handleAddImageField = () => {
        setImageFields((prevFields) => [...prevFields, currentId++]);
    };

    return (
        <div className="booking-form-container">
            <button className="closebutton" onClick={() => navigate('/user/bookings')}>×</button>
            <form onSubmit={handleSubmit} className="booking-form">
                <h2 className="booking-form-title">Edit Booking</h2>

                <div className="booking-form-group">
                    <label>Project Name:</label>
                    <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                </div>

                <div className="booking-form-group">
                    <label>Room Type:</label>
                    <input type="text" value={roomType} onChange={(e) => setRoomType(e.target.value)} required />
                </div>

                <div className="booking-form-group">
                    <label>Room Sqft:</label>
                    <input type="text" value={roomSqft} onChange={(e) => setRoomSqft(e.target.value)} required />
                </div>

                <div className="booking-form-group">
                    <label>Room Details:</label>
                    <textarea
                        className="booking-form-textarea"
                        value={roomDetails}
                        onChange={(e) => setRoomDetails(e.target.value)}
                        required
                    />
                </div>

                {existingImages.length > 0 && (
                    <div className="booking-form-group">
                        <label>Current Image(s):</label>
                        <div className="image-preview-container">
                            {existingImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:4000${imgUrl}`}
                                    alt={`Room ${index + 1}`}
                                    className="current-project-image-preview"
                                    style={{ maxWidth: '100%', marginBottom: '0.5rem' }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="booking-form-group">
                    <label>{existingImages.length > 0 ? 'Replace Images:' : 'Upload Room Images:'}</label>
                    {imageFields.map((fieldId) => (
                        <div className="image-input-container" key={fieldId}>
                            <input
                                type="file"
                                id={`bookingImage-${fieldId}`}
                                accept="image/*"
                                className="booking-form-input"
                                multiple
                            />
                        </div>
                    ))}
                    <button type="button" className="reserve-btn" onClick={handleAddImageField}>+ Add more</button>
                </div>

                <fieldset className="form-section" style={{ gridColumn: '1 / span 2' }}>
                    <legend>Your Contact Information</legend>

                    <div className="booking-form-group">
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="booking-form-group">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" // Example pattern (adjust for your needs)
                            placeholder="123-456-7890"
                            style={{ color: '#ffffff'}} 
                        />
                    </div>

                    <div className="booking-form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="booking-form-group">
                        <label>Time:</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                    </div>

                    <div className="booking-form-group" style={{ gridColumn: '1 / span 2' }}>
                        <label>Message:</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="booking-form-textarea" />
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="submit" className="reserve-btn">Update Booking</button>
                    <button type="button" className="reset-btn" onClick={() => navigate('/user/bookings')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditBookingUser;
