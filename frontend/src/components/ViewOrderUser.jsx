import React, { useState, useEffect } from 'react';
import { instance } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import '../assets/styles/ViewOrderUser.css';

const ViewOrderUser = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckouts = async () => {
    try {
      const res = await instance.get('/api/userhome/checkouts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCheckouts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching checkouts:', err);
      setError('Failed to fetch checkouts.');
      setLoading(false);
      toast.error('Failed to fetch checkouts');
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  if (loading) return <div>Loading Orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="view-order-user-container">
        <h2>My Orders</h2>
        {checkouts.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="order-list">
            {checkouts.map((checkout) => (
              <div key={checkout._id} className="order-item">
                <h3>Order ID: {checkout._id}</h3>
                <p>Order Date: {checkout.paymentDate ? new Date(checkout.paymentDate).toLocaleDateString() : 'N/A'}</p>
                <p>Total Amount: Rs. {checkout.totalAmount ?? '0'}</p>
                <p>Payment Status: {checkout.paymentStatus ?? 'Pending'}</p>
                <h4>Order Items:</h4>
                <ul>
                  {checkout.products && checkout.products.length > 0 ? (
                    checkout.products.map((item) => (
                      <li key={item._id}>
                        {item.productId?.name ?? 'Unnamed Product'} x {item.quantity ?? 0} (Rs. {item.productId?.price ?? 0})
                      </li>
                    ))
                  ) : (
                    <li>No products found</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewOrderUser;
