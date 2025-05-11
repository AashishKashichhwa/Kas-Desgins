

/// Booking.jsx
import React from 'react';
import BookingForm from '../components/BookingForm';
import ViewBookingsUser from '../components/ViewBookingsUser';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../assets/styles/Contact.css';
// import roomImage from '../assets/images/Contact.jpg';

const Booking = () => {
    return (

        <main className="content" role="main">
            <Navbar/>

            {/* <h1 className="slogan">Make a reservation, we will Booking you soon!</h1> */}
            <div className='bookingContent'>
                <BookingForm />
                {/* <img src={roomImage} alt="Room" className="image" /> */}

            </div>

            <h2>My Bookings</h2>
            <ViewBookingsUser />

            <Footer />
        </main>
    );
};

export default Booking;
