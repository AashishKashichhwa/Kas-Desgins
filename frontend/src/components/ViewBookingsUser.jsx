import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { instance } from '../services/ApiEndpoint';
import '../assets/styles/ViewProjects.css';

const ViewBookingsUser = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await instance.get('/api/bookings/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBookings(res.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to load bookings');
            }
        };
        fetchBookings();
    }, []);

    const handleBookingClick = (id) => {
        navigate(`/userhome/bookings/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/userhome/edit-booking/${id}`);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await instance.delete(`/api/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success("Booking deleted successfully");
            setBookings(bookings.filter(booking => booking._id !== id));
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
                    onClick={() => handleBookingClick(booking._id)}
                    onDelete={(e) => handleDelete(booking._id, e)}
                    onEdit={() => handleEdit(booking._id)}
                />
            ))}
        </div>
    );
};

const BookingCard = ({ booking, onClick, onDelete, onEdit }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let intervalId;
        const imageCount = booking.images ? booking.images.length : 0;

        if (imageCount > 1) {
            intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageCount);
            }, 3000);
        }

        return () => clearInterval(intervalId);
    }, [booking.images]);

    return (
        <div className="project-card" onClick={onClick}>
            <div className="project-actions">
                <button 
                    className="edit-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    Edit
                </button>
                <button 
                    className="delete-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                >
                    Delete
                </button>
            </div>

            <div className="project-image-container">
                {booking.images && booking.images.length > 0 ? (
                    <img
                        src={`http://localhost:4000${booking.images[currentImageIndex]}`}
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