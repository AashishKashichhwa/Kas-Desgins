import React from 'react';
import '../assets/styles/ViewCart.css'; // Import CSS for styling

const ViewCart = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  return (
    <div className="product-view-cart-container">
      <h2 className="product-view-cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="product-cart-list">
          {cartItems.map(item => (
            <li key={item._id} className="product-cart-list-item">
              <div className="product-image-container">
                {item.productId && item.productId.images && item.productId.images.length > 0 ? (
                  <img
                    src={`http://localhost:4000${item.productId.images[0]}`}
                    alt={item.productId.name}
                    className="product-cart-image"
                    onError={(e) => {
                      console.error("Failed to load image:", e.target.src);
                      e.target.onerror = null; // Prevents infinite loop
                      e.target.src = "url to default image" // url to default image
                    }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              <div className="product-details">
                <span className="product-name">{item.productId.name} - ${item.productId.price}</span>
              </div>

              <div className="quantity-controls">
                <button className="quantity-button" onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}>
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button className="quantity-button" onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <button className="product-cart-remove-button" onClick={() => onRemoveFromCart(item._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <button className="checkout-button" onClick={onCheckout}>
          Checkout
        </button>
      )}
    </div>
  );
};

export default ViewCart;