// // ManageBookings.jsx
// import React, { useEffect, useState } from 'react';
// import { get, deleteUser } from '../services/ApiEndpoint';
// import { toast } from 'react-hot-toast';
// import '../assets/styles/AdminHome.css';
// import AdminSidebar from './AdminSidebar';
// import BookingForm from './BookingForm';  // Import BookingForm
// import ViewBookings from './ViewBookings';  // Import ViewBookings

// const ManageBookings = () => {
//     const [bookings, setBookings] = useState([]);
//     const [showBookingForm, setShowBookingForm] = useState(false);  // State to control form visibility

//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     const fetchBookings = async () => {
//         try {
//             const request = await get('/api/contact');  // Replace with your actual endpoint
//             const response = request.data;
//                 setBookings(response); // Adjust based on your API response
//         } catch (error) {
//             console.error("Error fetching bookings:", error);
//             toast.error("Failed to fetch bookings.");
//         }
//     };

//     const handleAddBooking = () => {
//         setShowBookingForm(true);  // Show the BookingForm when "Add Booking" is clicked
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteUser(`/api/contact/${id}`);
//             toast.success("Success on Delete the booking")
//             fetchBookings();
//         } catch (error) {
//             console.error('Error deleting reservation:', error);
//             toast.error("Error on Deleting"); //Print even if fails.
//         }
//     };

//     return (
//         <div className="admin-page-container">
//             <AdminSidebar />
//             <main className="main-content">
//                 <div className="admin-container">
//                 <div className="manage-users-header">
//                     <h2>Manage Bookings</h2>

//                     {/* Button to toggle the visibility of BookingForm */}
//                     <button className='addBooking' onClick={handleAddBooking}>Add Booking</button>
//                     </div>

//                     {/* Conditionally render BookingForm if showBookingForm is true */}
//                     {showBookingForm && <BookingForm fetchReservations={fetchBookings} />}

//                     {/* Always render ViewBookings */}
//                     <ViewBookings bookings={bookings} handleDelete={handleDelete} />
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default ManageBookings;

// ManageBookings.jsx
import React, { useEffect, useState } from 'react';
import { get, deleteUser } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/AdminHome.css';
import AdminSidebar from './AdminSidebar';
import BookingForm from './BookingForm';  // Import BookingForm
import ViewBookings from './ViewBookings';  // Import ViewBookings

const ManageBookings = () => {

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                <div className="manage-users-header">
                    <h2>Manage Bookings</h2>
                    </div>


                    <ViewBookings />
                </div>
            </main>
        </div>
    );
};

export default ManageBookings;