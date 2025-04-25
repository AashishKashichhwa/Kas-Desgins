import React from 'react';

const AddToCart = ({ productId, onAddToCart }) => {
    const handleClick = () => {
        if (onAddToCart) {
            onAddToCart(productId);
        } else {
            console.warn("onAddToCart prop not provided to AddToCart component");
        }
    };

    return (
        <button className="product-add-to-cart-button" onClick={handleClick}>Add to Cart</button>
    );
};

export default AddToCart;