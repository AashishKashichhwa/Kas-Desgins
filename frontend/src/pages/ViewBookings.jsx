import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewBookings = ({ bookings, handleDelete, handleEdit }) => {
    const navigate = useNavigate();

    return (
        <div className="history-container">
            <section className="history" id="history">
                <h2 className="section-title">Reservation History</h2>
                {bookings.length === 0 ? (
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
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(reservation._id)}>EDIT</button>
                                        <button className="cancel-btn" onClick={() => handleDelete(reservation._id)}>Cancel</button>
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

export default ViewBookings;