import React from 'react';

const ViewCart = ({ cartItems, onRemoveFromCart }) => {
    return (
        <div className="product-view-cart-container">
            <h2 className="product-view-cart-title">Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="product-cart-list">
                    {cartItems.map(item => (
                        <li key={item.id} className="product-cart-list-item">
                            {item.name} - ${item.price}
                            <button className="product-cart-remove-button" onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewCart;