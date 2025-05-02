import React, { useEffect, useState } from 'react';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/ViewProjects.css'; // Assuming similar styling

const ViewBookingsUser = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await instance.get('/api/bookings', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // Filter bookings for the current user (you'll need to implement this on the backend)
                setBookings(res.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to load bookings');
            }
        };
        fetchBookings();
    }, []);

    const handleBookingClick = (id) => {
        navigate(`/bookings/${id}`); // Navigate to booking details
    };

    const handleEdit = (id) => {
        navigate(`/edit-booking/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await instance.delete(`/api/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Booking deleted successfully");
            fetchBookings(); // Refresh the booking list
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error("Error deleting booking");
        }
    };

    return (
        <div className="project-grid-container">
            {bookings.map(booking => (
                <BookingCard
                    key={booking._id}
                    booking={booking}
                    onClick={handleBookingClick}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                />
            ))}
        </div>
    );
};

const BookingCard = ({ booking, onClick, handleDelete, handleEdit }) => {
    return (
        <div className="project-card">
            <div className="project-actions">
                <button onClick={() => handleEdit(booking._id)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(booking._id)} className="delete-button">Delete</button>
            </div>

            <div className="project-image-container" onClick={() => onClick(booking._id)}>
                {booking.images && booking.images.length > 0 ? (
                    <img
                        src={`http://localhost:4000${booking.images[0]}`}
                        alt={booking.projectName}
                        className="project-image"
                    />
                ) : (
                    <div className="project-image-placeholder">No Image</div>
                )}
            </div>

            <div className="project-info">
                <div className="project-name">Project: {booking.projectName}</div>
                <div className="customer-name">Customer: {booking.name}</div>
                <div className="project-type">Type: {booking.roomType}</div>
                <div className="project-status">Status: {booking.status}</div>
            </div>
        </div>
    );
};

export default ViewBookingsUser;