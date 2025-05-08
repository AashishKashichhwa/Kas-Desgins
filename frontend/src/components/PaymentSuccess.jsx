import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { instance } from '../services/ApiEndpoint'; // Adjust as needed

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = new URLSearchParams(location.search).get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateAttempted, setUpdateAttempted] = useState(false); // Track if update was attempted

  useEffect(() => {
    if (bookingId) {
      const verifyPaymentAndUpdate = async () => {
        try {
          toast.loading('Verifying payment and updating booking...');

          // Call your API to verify the payment and update the paymentStatus to 'Paid'
          const response = await instance.put(
            `/api/bookings/${bookingId}`, // Use the existing update booking endpoint.
            { paymentStatus: 'Paid' }, // Set paymentStatus to 'Paid'
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );

          if (response.status === 200) {
            toast.success('Payment verified successfully and booking updated!');

            // Optionally, fetch the updated booking details if needed
            const updatedBooking = await instance.get(
              `/api/bookings/${bookingId}`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setBooking(updatedBooking.data);

          } else {
            toast.error('Payment verification and update failed');
          }
        } catch (error) {
          toast.error('Payment verification and update failed');
          console.error('Verification error:', error);
        } finally {
          toast.dismiss();
          setLoading(false);
          setUpdateAttempted(true); // Set updateAttempted to true after the update
        }
      };

      // Ensure the update is only attempted once
      if (!updateAttempted) {
        verifyPaymentAndUpdate();
      }
    } else {
      toast.error('Booking ID not found. Cannot verify payment');
      setLoading(false);
    }
  }, [bookingId, updateAttempted]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="alert alert-success" role="alert">
        Payment Successful!
      </div>
      {bookingId ? (
        <p>Booking ID: {bookingId}</p>
      ) : (
        <p>Your payment was processed successfully.</p>
      )}
      <div className="mt-3">
        <Link to="/dashboard" className="btn btn-primary mr-2">
          Go to Dashboard
        </Link>
        <Link to={`/userhome/bookings/${bookingId}`} className="btn btn-secondary">
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;