import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCheckoutBySessionId } from '../api/CartApi'; // Make sure this function exists
import '../assets/styles/CartPaymentSuccess.css';
import Navbar from './Navbar';
import Footer from './Footer';

const CartPaymentSuccess = () => {
    const location = useLocation();
    const [checkoutData, setCheckoutData] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get('session_id');

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const res = await getCheckoutBySessionId(session_id);
                setCheckoutData(res);
            } catch (error) {
                toast.error("Failed to fetch order details");
            }
        };

        if (session_id) {
            fetchCheckoutData();
        }
    }, [session_id]);

    if (!checkoutData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="cart-payment-success-container">
                <h2>Payment Successful!</h2>


                <div className="success-icon">
                    ✓
                </div>
                <p>Thank you for your purchase.</p>

                <h3>Order Details:</h3>
                {checkoutData.products.map((item) => (
                    <div key={item._id} className="cart-item-details">
                        <p><strong>Product Name:</strong> {item.productId.name}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> Rs. {item.productId.price}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default CartPaymentSuccess;
