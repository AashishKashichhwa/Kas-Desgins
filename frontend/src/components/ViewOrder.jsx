// ViewOrder.jsx (Admin View)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Footer from './Footer';
import '../assets/styles/ViewOrder.css'; // Create this CSS file
import AdminSidebar from './AdminSidebar';

const ViewOrder = () => {
    const [checkouts, setCheckouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckouts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/admin/checkouts'); // Adjust the API endpoint if needed
                setCheckouts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching checkouts:", err);
                setError("Failed to fetch checkouts.");
                setLoading(false);
                toast.error("Failed to fetch checkouts"); // Optionally display a toast
            }
        };

        fetchCheckouts();
    }, []);

    if (loading) {
        return <div>Loading Orders...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
            <div className="admin-container">
                <h2>All Orders</h2>
                {checkouts.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table className="order-table">
                        <thead>
                            <tr>
                                {/* <th>Order ID</th> */}
                                <th>User</th>
                                <th>Products</th>
                                <th>Total Amount</th>
                                <th>Payment Status</th>
                                <th>Order Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkouts.map(checkout => (
                                <tr key={checkout._id}>
                                    {/* <td>{checkout._id}</td> */}
                                    <td>{checkout.userId.username} {checkout.userId.email}</td>
                                    <td>
                                        <ul>
                                            {checkout.products.map(item => (
                                                <li key={item._id}>
                                                    {item.productId.name} x {item.quantity} (Rs. {item.productId.price})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>Rs. {checkout.totalAmount}</td>
                                    <td>{checkout.paymentStatus}</td>
                                    <td>{new Date(checkout.paymentDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            </main>
        </div>
    );
};

export default ViewOrder;