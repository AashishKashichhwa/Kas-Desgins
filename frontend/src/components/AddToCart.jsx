import React, { useEffect, useState } from 'react';
import { getCartByUser, deleteCartItem, updateCartItem, checkout } from '../api/CartApi'; // ✅ using new CartApi functions
import { toast } from 'react-hot-toast';
import '../assets/styles/AddToCart.css';

const AddToCart = () => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await getCartByUser(); // ✅ fetch user cart
            setCartItems(res);
        } catch (error) {
            toast.error("Failed to fetch cart items");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCartItem(id);
            toast.success("Removed from cart");
            fetchCart();
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleQuantityChange = async (id, quantity) => {
        if (quantity < 1) {
            toast.error('Quantity must be at least 1');
            return;
        }
        try {
            await updateCartItem(id, quantity);
            toast.success("Quantity updated");
            fetchCart();
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const handleCheckout = async () => {
        try {
            await checkout(cartItems);
            toast.success("Checkout successful!");
            setCartItems([]);
        } catch (error) {
            toast.error("Checkout failed");
        }
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item._id} className="cart-item">
                                {/* Adjust image source here */}
                                {item.productId?.images && item.productId?.images.length > 0 ? (
                                    <img
                                        src={`http://localhost:4000${item.productId.images[0]}`} // Use the first image in the array
                                        alt={item.productId?.name || "Product"}
                                        width={50}
                                        height={50}
                                    />
                                ) : item.productId?.image ? (
                                    <img
                                        src={`http://localhost:4000${item.productId.image}`} // Use the "image" property if "images" is not defined
                                        alt={item.productId?.name || "Product"}
                                        width={50}
                                        height={50}
                                    />
                                ) : (
                                    <div>No Image Available</div>
                                )}
                                <div>
                                    {item.productId?.name || 'Unnamed Product'} - Rs. {item.productId?.price}
                                </div>

                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                                </div>

                                <button onClick={() => handleDelete(item._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                </>
            )}
        </div>
    );
};

export default AddToCart;