// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../assets/styles/Contact.css'

// const Contact = () => {
//     const navigate = useNavigate();
//     const [reservations, setReservations] = useState([]);
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         date: '',
//         time: '',
//         comments: '',
//     });
//     const [formErrors, setFormErrors] = useState({});

//     const [message, setMessage] = useState(null)

//     useEffect(() => {
//         fetchReservations();
//     }, []);

//     const fetchReservations = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/api/contact');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const data = await response.json();
//             setReservations(data);
//         } catch (error) {
//             console.error("Error fetching reservations", error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value} = e.target;
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             [name]: value,
//         }));
//     };

//     const validateForm = () => {
//         let errors = {};
//         if (!formData.name.trim()) {
//             errors.name = 'Name is required';
//         }
//         if (!formData.phone.trim()) {
//             errors.phone = 'Phone number is required';
//         } else if (!/^[0-9]{10}$/.test(formData.phone)) {
//             errors.phone = 'Please enter a valid 10-digit phone number';
//         }
//         if (!formData.date) {
//             errors.date = 'Date is required';
//         }
//           if (!formData.time) {
//             errors.time = 'Time is required';
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             try {
//                 const response = await fetch('http://localhost:4000/api/contact', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         name: formData.name,
//                         phone: formData.phone,
//                         date: formData.date,
//                        time: formData.time,
//                         comments: formData.comments,
//                     }),
//                 });

//                 if (response.ok) {
//                     setMessage('Reservation done successfully')
//                     fetchReservations()
//                     setFormData({
//                         name: '',
//                         phone: '',
//                         date: '',
//                        time: '',
//                         comments: '',
//                     })


//                 } else {
//                     setMessage("Error in reservation")
//                 }


//             } catch (error) {
//                 console.error("Error submitting form:", error);
//             }
//         }
//     };

//     const clearForm = () => {
//         setFormData({
//             name: '',
//             phone: '',
//             date: '',
//             time: '',
//             comments: '',
//         });
//         setFormErrors({});
//     };

//     const handleEdit = (id) => {
//         navigate(`/edit_reservation/${id}`)
//     }
//     const handleDelete = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:3000/api/contact/${id}`, {
//                 method: 'DELETE',
//             });
//             if (response.ok) {
//                 setMessage("Reservation deleted successfully")
//                 fetchReservations()
//             } else {
//                 setMessage("Error in deleting reservation")
//             }
//         } catch (error) {
//             console.error('Error deleting reservation:', error);
//         }
//     };

//     return (
        
//         <main className="content" role="main">
//           <h1 className="slogan">Make a reservation, we will contact you soon!</h1>
//             <div className="reservation-form-container">
//                 <form onSubmit={handleSubmit} id="reservationForm" className="reservationForm-form">
//                     <fieldset className="fieldset">
//                         <legend>Reservation Information</legend>
//                         <label htmlFor="name">Name:</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                         {formErrors.name && <span className="error">{formErrors.name}</span>}


//                         <label htmlFor="phone">Phone no.:</label>
//                         <input
//                             type="tel"
//                             id="phone"
//                             name="phone"
//                             pattern="[0-9]{10}"
//                             maxLength="10"
//                             title="Please enter a valid 10-digit phone number"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             required
//                         />
//                         {formErrors.phone && <span className="error">{formErrors.phone}</span>}

//                         <label htmlFor="date">Date:</label>
//                         <input
//                             type="date"
//                             id="date"
//                             name="date"
//                             value={formData.date}
//                             onChange={handleChange}
//                             required
//                         />
//                         {formErrors.date && <span className="error">{formErrors.date}</span>}
//                          <label htmlFor="time">Time:</label>
//                         <input
//                             id="time"
//                             type="time"
//                             name="time"
//                              value={formData.time}
//                             onChange={handleChange}
//                         />
//                            {formErrors.time && <span className="error">{formErrors.time}</span>}


//                         <label htmlFor="needs">Comments:</label>
//                         <textarea
//                             id="needs"
//                             name="comments"
//                             value={formData.comments}
//                             onChange={handleChange}
//                         ></textarea>

//                         <button type="submit" className="reserve-btn">Reserve</button>
//                         <button type="reset" className="reset-btn" onClick={clearForm}>
//                             Reset
//                         </button>
//                     </fieldset>
//                     {message && (
//                         <div className="messages">
//                             <div className="message">
//                                 {message}
//                             </div>
//                         </div>
//                     )}
//                 </form>
//             </div>
//             <div className="history-container">
//                 <section className="history" id="history">
//                     <h2 className="section-title">Reservation History</h2>
//                     {reservations.length === 0 ? (
//                         <h4 className="validation">No previous reservations.</h4>
//                     ) : (
//                         <table className="history-table">
//                             <thead>
//                                 <tr>
//                                     <th>Name</th>
//                                     <th>Phone Number</th>
//                                     <th>Date</th>
//                                      <th>Time</th>
//                                     <th>Comments</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {reservations.map(reservation => (
//                                     <tr key={reservation._id}>
//                                         <td>{reservation.name}</td>
//                                         <td>{reservation.phone}</td>
//                                         <td>{new Date(reservation.date).toLocaleDateString()}</td>
//                                          <td>{reservation.time}</td>
//                                         <td>{reservation.comments}</td>
//                                         <td>{reservation.status}</td>
//                                         <td>
//                                             <button className="edit-btn" onClick={() => handleEdit(reservation._id)}>EDIT</button>
//                                             <button className="cancel-btn" onClick={() => handleDelete(reservation._id)}>Cancel</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </section>
//             </div>
//         </main>
//     );
// };

// export default Contact;

/// Contact.jsx
import React from 'react';
import BookingForm from './BookingForm';
import ViewBookings from './ViewBookings';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../assets/styles/Contact.css';
import roomImage from '../assets/images/Contact.jpg';

const Contact = () => {
    return (

        <main className="content" role="main">
            <Navbar/>

            <h1 className="slogan">Make a reservation, we will contact you soon!</h1>
            <div className='bookingContent'>
                <BookingForm />
                <img src={roomImage} alt="Room" className="image" />

            </div>
            <ViewBookings />

            <Footer />
        </main>
    );
};

export default Contact;
