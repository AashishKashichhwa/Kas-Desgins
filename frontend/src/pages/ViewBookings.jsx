import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/EditBooking.css';
// import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

const ViewBookings = ({ bookings = [], handleDelete }) => {
    const handleDeleteClick = (id) => {
        const confirmDelete = window.confirm("Do you really want to delete this booking?");
        if (confirmDelete) {
            handleDelete(id);
        }
    };

    return (
        <div className="history-container">
            <section className="history" id="history">
                <h2 className="section-title">Reservation History</h2>
                {!bookings || bookings.length === 0 ? (
                    <h4 className="validation">No previous reservations.</h4>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Comments</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.phone}</td>
                                    <td>{new Date(reservation.date).toLocaleDateString()}</td>
                                    <td>{reservation.time}</td>
                                    <td>{reservation.comments}</td>
                                    <td>{reservation.status}</td>
                                    <td className='action'>
                                        <Link to={`/admin/editbooking/${reservation._id}`} className="edit-btn">Edit</Link>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDeleteClick(reservation._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

ViewBookings.propTypes = {
    bookings: PropTypes.array,
    handleDelete: PropTypes.func.isRequired
};

ViewBookings.defaultProps = {
    bookings: []
};

export default ViewBookings;