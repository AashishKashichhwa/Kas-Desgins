import { instance } from '../services/ApiEndpoint'; // ✅ axios instance for authenticated requests

export const getCartByUser = async () => {
    try {
        console.log('Attempting to fetch cart...');
        const res = await instance.get('/api/cart', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Cart fetched successfully:', res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch cart items', error);
        throw error;
    }
};

export const addToCart = async (productId) => {
    try {
        console.log(`Attempting to add product ${productId} to cart...`);
        const res = await instance.post('/api/cart', { productId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Product added to cart successfully:', res.data);
        return res.data;
    } catch (error) {
        console.error(`Failed to add product ${productId} to cart`, error);
        throw error;
    }
};

export const updateCartItem = async (id, quantity) => {
    try {
        console.log(`Attempting to update cart item ${id} to quantity ${quantity}...`);
        const res = await instance.put(`/api/cart/update/${id}`, { quantity }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Cart item updated successfully:', res.data);
        return res.data;
    } catch (error) {
        console.error(`Failed to update cart item ${id}`, error);
        throw error;
    }
};

export const deleteCartItem = async (id) => {
    try {
        console.log(`Attempting to delete cart item ${id}...`);
        const res = await instance.delete(`/api/cart/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('Cart item deleted successfully:', res.data);
        return res.data;
    } catch (error) {
        console.error(`Failed to delete cart item ${id}`, error);
        throw error;
    }
};

export const checkout = async (cartItems) => {
    try {
        console.log('Attempting checkout with cart items:', cartItems);
        const response = await instance.post('/api/cart/create-cart-checkout-session', { cartItems }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Checkout request successful:', response.data);

        if (response.data.url) {
            console.log('Redirecting to:', response.data.url);
            window.location.href = response.data.url;
        } else if (response.data.id) {
            console.log('Redirecting to Stripe Checkout with ID:', response.data.id);
            window.location.replace(`https://checkout.stripe.com/pay/${response.data.id}`);
        } else {
            console.error('No Stripe session URL or ID received');
            throw new Error('No Stripe session URL or ID received');
        }

    } catch (error) {
        console.error("Checkout failed", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error('Error setting up the request', error.message);
        }
        console.error('Axios config:', error.config);
        throw error;
    }
};

// ✅ NEW: Fetch checkout details after payment using Stripe session ID
export const getCheckoutBySessionId = async (sessionId) => {
    const res = await instance.get(`/api/cart/checkout/session/${sessionId}`);
    return res.data;
};
